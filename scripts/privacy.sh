#!/usr/bin/env bash
# Проверка перед публикацией: в контенте не должно быть данных заказчиков.
#
# Единственное законное исключение — собственные контакты владельца,
# они вынесены в lib/owner.ts и потому исключены из поиска целиком.
#
# Имена заказчиков в этом файле не хранятся: репозиторий публичный, и денилист
# сам по себе является расшифровкой обезличенных кейсов. Список приходит снаружи:
#   локально — из .privacy-clients (не коммитится, см. .gitignore),
#   в CI      — из секрета PRIVACY_CLIENTS.
# Если списка нет, проверка падает, а не проходит частично.
set -uo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

PATTERN='\+7[0-9 ()-]{10,}|[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|заказ.?№|договор.?№|Профи\.ру'

CLIENTS="${PRIVACY_CLIENTS:-}"
if [[ -z "$CLIENTS" && -f .privacy-clients ]]; then
  # Пустые строки и комментарии выкидываем, остальное склеиваем в одну альтернативу.
  CLIENTS=$(grep -Ev '^\s*(#|$)' .privacy-clients | paste -sd '|' -)
fi

# Пустая альтернатива совпадает с любой строкой: перевод строки в конце секрета
# или лишний «|» роняли проверку на всём сайте. Переводы строк превращаем в «|»,
# а пустые звенья выкидываем.
CLIENTS=$(printf '%s' "$CLIENTS" | tr -d '\r' | tr '\n' '|' | sed -E 's/\|+/|/g; s/^\|//; s/\|$//')

if [[ -z "$CLIENTS" ]]; then
  echo "Список заказчиков не найден: нет ни PRIVACY_CLIENTS, ни .privacy-clients." >&2
  echo "Без него проверка неполная, поэтому она не проходит." >&2
  [[ -n "${GITHUB_ACTIONS:-}" ]] && echo "::error::privacy: PRIVACY_CLIENTS пуст"
  exit 1
fi

hits=$(grep -rEn "$PATTERN|$CLIENTS" lib/ app/ components/ \
  --exclude=owner.ts 2>/dev/null || true)

if [[ -n "$hits" ]]; then
  echo "Найдены данные, которых на сайте быть не должно:"
  # Логи публичного репозитория читает любой вошедший: в CI печатаем только
  # файл и строку, а не саму строку с найденным именем.
  if [[ -n "${GITHUB_ACTIONS:-}" ]]; then
    n=$(printf '%s\n' "$hits" | wc -l)
    alts=$(printf '%s' "$CLIENTS" | tr '|' '\n' | wc -l)
    short=$(printf '%s' "$CLIENTS" | tr '|' '\n' | awk '{ print length }' | sort -n | head -1)
    where=$(printf '%s\n' "$hits" | cut -d: -f1,2 | head -15 | paste -sd ' ' -)
    echo "::error::privacy: $n совпадений; в списке $alts имён, самое короткое $short симв.; где: $where"
  else
    echo "$hits"
  fi
  exit 1
fi

echo "Приватность: чисто"
