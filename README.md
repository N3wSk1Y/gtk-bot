# Управление категориями
**Получение категорий**
```
GET https://gtk-sp.ru/categories
```

**Удаление категорий**


`id` - id категории
```
DELETE https://gtk-sp.ru/categories
```

**Добавление категорий**


`id` - id категории
`name` - имя категории
`description` - описание категории
`emoji_id` - id эмодзи категории
```
POST https://gtk-sp.ru/categories
```

**Модифицирование категорий**

(все поля, кроме `id`, - необязательные)

`id` - id категории
`name` - имя категории
`description` - описание категории
`emoji_id` - id эмодзи категории
```
PUT https://gtk-sp.ru/categories
```
