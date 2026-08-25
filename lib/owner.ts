/**
 * Контакты владельца сайта — в одном месте, а не продублированы по языкам.
 *
 * Отдельный файл нужен ещё и для проверки приватности: она ищет по контенту
 * телефоны и почтовые адреса, потому что там не должно быть данных заказчиков.
 * Собственные контакты — единственное законное исключение, и оно живёт здесь,
 * чтобы проверку можно было сузить до одного файла вместо списка исключений.
 */
export const OWNER = {
  name: "Андрей",
  nameEn: "Andrei",
  telegram: { handle: "@SamsaIT1", href: "https://t.me/SamsaIT1" },
  email: { address: "proskurinandrei016@yandex.com", href: "mailto:proskurinandrei016@yandex.com" },
  github: { handle: "github.com/Samsa016", href: "https://github.com/Samsa016" },
} as const;
