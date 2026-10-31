#!/usr/bin/env bash
# Кодирование демки под бюджеты из скилла video-demo.
#
#   scripts/encode.sh <вход> <слаг> [старт_сек] [длительность_сек] [постер_сек]
#
# На выходе: public/video/<слаг>.webm (AV1), .mp4 (H.264 для Safari)
# и public/poster/<слаг>.jpg — кадр результата, а не первый кадр.
set -euo pipefail

INPUT=${1:?нужен путь к исходнику}
SLUG=${2:?нужен слаг кейса}
START=${3:-0}
DUR=${4:-10}
POSTER_AT=${5:-}

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VIDEO_DIR="$ROOT/public/video"
POSTER_DIR="$ROOT/public/poster"
mkdir -p "$VIDEO_DIR" "$POSTER_DIR"

# Общий грейд связывает демки в одну систему: у одних кейсов интерфейс белый,
# у других почти чёрный, и рядом на тёмной странице чистый белый бьёт по глазам.
# Правка мягкая — гасит только верхние света и чуть снимает насыщенность,
# продукт при этом выглядит как выглядит.
GRADE="curves=all='0/0 0.5/0.49 1/0.92',eq=saturation=0.94"

SCALE="scale='min(1280,iw)':-2:flags=lanczos,fps=30,${GRADE}"

echo "→ $SLUG: ${START}s +${DUR}s"

ffmpeg -y -v error -ss "$START" -t "$DUR" -i "$INPUT" \
  -an -c:v libsvtav1 -crf 40 -preset 6 -g 60 \
  -vf "$SCALE" -pix_fmt yuv420p \
  "$VIDEO_DIR/$SLUG.webm"

ffmpeg -y -v error -ss "$START" -t "$DUR" -i "$INPUT" \
  -an -c:v libx264 -crf 27 -preset slow -profile:v high -level 4.0 \
  -vf "$SCALE" -pix_fmt yuv420p -movflags +faststart \
  "$VIDEO_DIR/$SLUG.mp4"

# Постер режем из готового клипа, а не из исходника: смещение trim и особенности
# перемотки сырого webm иначе уводят кадр в произвольное место записи.
# По умолчанию — за 1.2 с до конца: там виден результат действия.
CLIP_DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$VIDEO_DIR/$SLUG.mp4")
if [[ -z "$POSTER_AT" ]]; then
  POSTER_AT=$(awk "BEGIN { d = $CLIP_DUR - 1.2; print (d > 0 ? d : $CLIP_DUR / 2) }")
fi

# Постер режется из готового клипа — грейд на нём уже применён.
ffmpeg -y -v error -ss "$POSTER_AT" -i "$VIDEO_DIR/$SLUG.mp4" -frames:v 1 \
  -vf "scale='min(1280,iw)':-2:flags=lanczos,format=yuvj420p" -q:v 6 \
  "$POSTER_DIR/$SLUG.jpg"

# Второй размер под телефоны: на 390 px кадр шириной 1280 — чистая трата трафика.
ffmpeg -y -v error -i "$POSTER_DIR/$SLUG.jpg" \
  -vf "scale=640:-2:flags=lanczos,format=yuvj420p" -q:v 6 \
  "$POSTER_DIR/$SLUG@640.jpg"

size() { du -k "$1" | cut -f1; }
WEBM_KB=$(size "$VIDEO_DIR/$SLUG.webm")
MP4_KB=$(size "$VIDEO_DIR/$SLUG.mp4")
POSTER_KB=$(size "$POSTER_DIR/$SLUG.jpg")

printf "   webm %sK  mp4 %sK  постер %sK\n" "$WEBM_KB" "$MP4_KB" "$POSTER_KB"

# Бюджеты из скилла: webm ≤ 1200K, mp4 ≤ 1600K, постер ≤ 60K.
over=0
[[ $WEBM_KB   -gt 1200 ]] && { echo "   ! webm превышает бюджет 1200K";   over=1; }
[[ $MP4_KB    -gt 1600 ]] && { echo "   ! mp4 превышает бюджет 1600K";    over=1; }
[[ $POSTER_KB -gt 60   ]] && { echo "   ! постер превышает бюджет 60K";   over=1; }
exit $over
