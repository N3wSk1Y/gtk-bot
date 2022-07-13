-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Июл 13 2022 г., 16:27
-- Версия сервера: 5.7.21-20-beget-5.7.21-20-1-log
-- Версия PHP: 5.6.40

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `newskiy_gtk`
--

-- --------------------------------------------------------

--
-- Структура таблицы `categories`
--
-- Создание: Июл 13 2022 г., 07:26
-- Последнее обновление: Июл 13 2022 г., 07:28
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` text NOT NULL,
  `name` text NOT NULL,
  `description` text NOT NULL,
  `emoji_id` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `emoji_id`) VALUES
('instruments', 'Инструменты и оружие', 'Кирки, мечи, лопаты и топоры', '992185372618526780'),
('armor', 'Броня', 'Топочка и не только', '993118490829533224'),
('enchanted_books', 'Зачарования', 'Шелк, удача и даже починка', '992339167063310347'),
('building_blocks', 'Строительные блоки', 'Из этого можно построить Глориан', '993243381801160835'),
('food', 'Еда', 'Золотая морковка и не только', '993118524912435230'),
('other', 'Прочее', 'Всякая мелочовка', '993123409351409725');

-- --------------------------------------------------------

--
-- Структура таблицы `orders_history`
--
-- Создание: Июл 13 2022 г., 11:44
--

DROP TABLE IF EXISTS `orders_history`;
CREATE TABLE `orders_history` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `deliverer` text NOT NULL,
  `products` json NOT NULL,
  `price` int(11) NOT NULL,
  `paymend_method` text NOT NULL,
  `status` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `products`
--
-- Создание: Июл 13 2022 г., 09:31
-- Последнее обновление: Июл 13 2022 г., 09:31
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` text NOT NULL,
  `name` text NOT NULL,
  `emoji_id` text NOT NULL,
  `category_name` text NOT NULL,
  `price` int(11) NOT NULL,
  `enabled` int(11) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `products`
--

INSERT INTO `products` (`id`, `name`, `emoji_id`, `category_name`, `price`, `enabled`) VALUES
('diamond_pickaxe_silk', 'Алмазная кирка (шелк)', '992185372618526780', 'instruments', 10, 1);

-- --------------------------------------------------------

--
-- Структура таблицы `stats`
--
-- Создание: Июл 13 2022 г., 09:14
-- Последнее обновление: Июл 13 2022 г., 11:52
--

DROP TABLE IF EXISTS `stats`;
CREATE TABLE `stats` (
  `config_id` int(11) NOT NULL,
  `imarket_balance` int(11) NOT NULL DEFAULT '0',
  `bank_balance` int(11) NOT NULL DEFAULT '0',
  `assets` int(11) NOT NULL DEFAULT '0' COMMENT 'Активы',
  `deposits_debt` int(11) NOT NULL DEFAULT '0' COMMENT 'Долг по вкладам',
  `credits_debt` int(11) NOT NULL DEFAULT '0' COMMENT 'Долг по кредитам'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `stats`
--

INSERT INTO `stats` (`config_id`, `imarket_balance`, `bank_balance`, `assets`, `deposits_debt`, `credits_debt`) VALUES
(1, 10, 0, 0, 0, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `topup_history`
--
-- Создание: Июл 13 2022 г., 11:43
--

DROP TABLE IF EXISTS `topup_history`;
CREATE TABLE `topup_history` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `value` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Структура таблицы `transfer_history`
--
-- Создание: Июл 13 2022 г., 11:44
-- Последнее обновление: Июл 13 2022 г., 11:52
--

DROP TABLE IF EXISTS `transfer_history`;
CREATE TABLE `transfer_history` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `value` int(11) NOT NULL,
  `target` int(11) NOT NULL DEFAULT '0' COMMENT '0 - iMarket, 1 - Bank',
  `reason` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `transfer_history`
--

INSERT INTO `transfer_history` (`id`, `userid`, `value`, `target`, `reason`, `date`) VALUES
(4, 3, 10, 1, 'Покупка товаров в iMarket', '2022-07-13 11:52:48');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--
-- Создание: Июл 12 2022 г., 21:14
-- Последнее обновление: Июл 13 2022 г., 12:48
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `minecraft_username` text NOT NULL,
  `uuid` text NOT NULL,
  `balance` int(11) NOT NULL DEFAULT '0',
  `card_number` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `minecraft_username`, `uuid`, `balance`, `card_number`) VALUES
(3, 'N3wSk1Y', 'b4e75811613c4427945698ce20fa50a3', 0, 12323),
(4, 'Ress_Svetov', '7b77ecfad44e4431b22090588556786f', 0, 22555);

-- --------------------------------------------------------

--
-- Структура таблицы `withdraw_history`
--
-- Создание: Июл 13 2022 г., 11:44
--

DROP TABLE IF EXISTS `withdraw_history`;
CREATE TABLE `withdraw_history` (
  `id` int(11) NOT NULL,
  `userid` int(11) NOT NULL,
  `value` int(11) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `categories`
--
ALTER TABLE `categories`
  ADD UNIQUE KEY `UNIQUE` (`id`(18));

--
-- Индексы таблицы `orders_history`
--
ALTER TABLE `orders_history`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `products`
--
ALTER TABLE `products`
  ADD UNIQUE KEY `UNIQUE` (`id`(18));

--
-- Индексы таблицы `stats`
--
ALTER TABLE `stats`
  ADD PRIMARY KEY (`config_id`);

--
-- Индексы таблицы `topup_history`
--
ALTER TABLE `topup_history`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `transfer_history`
--
ALTER TABLE `transfer_history`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `withdraw_history`
--
ALTER TABLE `withdraw_history`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `orders_history`
--
ALTER TABLE `orders_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `stats`
--
ALTER TABLE `stats`
  MODIFY `config_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `topup_history`
--
ALTER TABLE `topup_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `transfer_history`
--
ALTER TABLE `transfer_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT для таблицы `withdraw_history`
--
ALTER TABLE `withdraw_history`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
