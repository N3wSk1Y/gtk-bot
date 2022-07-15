-- MySQL dump 10.13  Distrib 8.0.29, for Linux (x86_64)
--
-- Host: localhost    Database: gtk
-- ------------------------------------------------------
-- Server version	8.0.29-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` text NOT NULL,
  `name` text NOT NULL,
  `description` text NOT NULL,
  `emoji_id` text NOT NULL,
  UNIQUE KEY `UNIQUE` (`id`(18))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('instruments','Инструменты и оружие','Кирки, мечи, лопаты и топоры','992185372618526780'),('armor','Броня','Топочка и не только','993118490829533224'),('enchanted_books','Зачарования','Шелк, удача и даже починка','992339167063310347'),('building_blocks','Строительные блоки','Из этого можно построить Глориан','993243381801160835'),('food','Еда','Золотая морковка и не только','993118524912435230'),('other','Прочее','Всякая мелочовка','993123409351409725');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders_history`
--

DROP TABLE IF EXISTS `orders_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `deliverer` text NOT NULL,
  `products` json NOT NULL,
  `price` int NOT NULL,
  `paymend_method` text NOT NULL,
  `status` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders_history`
--

LOCK TABLES `orders_history` WRITE;
/*!40000 ALTER TABLE `orders_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` text NOT NULL,
  `name` text NOT NULL,
  `emoji_id` text NOT NULL,
  `category_name` text NOT NULL,
  `price` int NOT NULL,
  `enabled` int DEFAULT '1',
  UNIQUE KEY `UNIQUE` (`id`(18))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('diamond_sword','Алмазный Меч','993118446978080778','instruments',48,1),('diamond_axe','Алмазный Топор','993118413092294687','instruments',20,1),('trident_clear','Чистый Трезубец','993122604774850620','instruments',32,0),('diamond_helmet','Алмазный Шлем','993118498538663936','armor',32,1),('diamond_chestplate','Алмазный Нагрудник','993118490829533224','armor',16,1),('diamond_leggins','Алмазные Поножи','993118508319768686','armor',16,1),('diamond_boots','Алмазные Ботинки','993118482407374848','armor',32,1),('copper_1','Потемневший Блок Меди','997052625054863411','building_blocks',16,0),('copper_2','Состаренный Блок Меди','997052738896658462','building_blocks',16,0),('copper_3','Окисленный Блок Меди','997052745586589696','building_blocks',16,0),('sea_lantern','Морской Фонарь','997053823426236416','building_blocks',3,1),('prismarine_bricks','Призмариновые Кирпичи','997054525548531804','building_blocks',2,1),('prismarine_block','Призмариновый Блок','997054612483878932','building_blocks',1,1),('hive_block','Блок Пчелиных Сот','997055473289273464','building_blocks',32,0),('white_wool','Белая Шерсть','997055872612171816','building_blocks',2,0),('golden_carrot','Золотая Морковь','993118524912435230','food',4,0),('cooked_cod','Жареная Треска','997056696608358470','food',1,1),('kelp_block','Блок Сушёной Ламинарии','993122346451865610','other',4,0),('sponge_block','Губка','993123409351409725','other',16,0),('totem','Тотем Бессмертия','993118532265054208','other',1,1),('ink','Чернильный Мешок','993122627147280454','other',8,1),('cactus','Кактус','997058377530224690','other',4,0),('netherite_ingot','Незеритовый Слиток','993122840599605288','other',10,0),('diamond_pickaxe_silk','Алмазная Кирка (шелк)','992185372618526780','instruments',20,1),('diamond_pickaxe_fortune','Алмазная Кирка (удача)','992185372618526780','instruments',20,1),('diamond_shovel_silk','Алмазная Лопата (шёлк)','993118468784267287','instruments',18,1),('diamond_shovel_fortune','Алмазная Лопата (удача)','993118468784267287','instruments',18,1),('unbreaking_book','Прочность 3','992339167063310347','enchanted_books',16,1),('fortune_book','Удача 3','992339167063310347','enchanted_books',16,1),('silk_book','Шёлковое Касание','992339167063310347','enchanted_books',16,1),('looting_book','Добыча 3','992339167063310347','enchanted_books',16,1),('efficiency_book','Эффективность 5','992339167063310347','enchanted_books',20,1),('protection_book','Защита 4','992339167063310347','enchanted_books',18,1),('riptide_book','Тягун 3','992339167063310347','enchanted_books',16,1),('aqua_book','Подводник','992339167063310347','enchanted_books',16,1),('falling_book','Невесомость 4','992339167063310347','enchanted_books',24,1),('respiration_book','Подводное Дыхание 3','992339167063310347','enchanted_books',18,1),('sharpness_book','Острота 5','992339167063310347','enchanted_books',20,1),('sweeping_book','Разящий Клинок 3','992339167063310347','enchanted_books',16,1),('walking_book','Подводная Ходьба 3','992339167063310347','enchanted_books',16,1),('fire_book','Заговор Огня 2','992339167063310347','enchanted_books',16,1),('infinity_book','Бесконечность','992339167063310347','enchanted_books',16,1),('fire_protection_book','Огнеупорность 4','992339167063310347','enchanted_books',16,1),('impaling_book','Пронзатель 5','992339167063310347','enchanted_books',16,1),('channeling_book','Громовержец','992339167063310347','enchanted_books',16,1),('impaling_arrow_book','Пронзающая Стрела 4','992339167063310347','enchanted_books',16,1),('flame_book','Воспламенение','992339167063310347','enchanted_books',16,1);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stats`
--

DROP TABLE IF EXISTS `stats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stats` (
  `config_id` int NOT NULL AUTO_INCREMENT,
  `imarket_balance` int NOT NULL DEFAULT '0',
  `bank_balance` int NOT NULL DEFAULT '0',
  `assets` int NOT NULL DEFAULT '0' COMMENT 'Активы',
  `deposits_debt` int NOT NULL DEFAULT '0' COMMENT 'Долг по вкладам',
  `credits_debt` int NOT NULL DEFAULT '0' COMMENT 'Долг по кредитам',
  PRIMARY KEY (`config_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stats`
--

LOCK TABLES `stats` WRITE;
/*!40000 ALTER TABLE `stats` DISABLE KEYS */;
INSERT INTO `stats` VALUES (1,11,0,0,0,0);
/*!40000 ALTER TABLE `stats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `topup_history`
--

DROP TABLE IF EXISTS `topup_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `topup_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `value` int NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `topup_history`
--

LOCK TABLES `topup_history` WRITE;
/*!40000 ALTER TABLE `topup_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `topup_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transfer_history`
--

DROP TABLE IF EXISTS `transfer_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transfer_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `value` int NOT NULL,
  `target` int NOT NULL DEFAULT '0' COMMENT '0 - iMarket, 1 - Bank',
  `reason` text NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transfer_history`
--

LOCK TABLES `transfer_history` WRITE;
/*!40000 ALTER TABLE `transfer_history` DISABLE KEYS */;
INSERT INTO `transfer_history` VALUES (5,5,1,1,'Покупка товаров в iMarket','2022-07-14 20:11:05');
/*!40000 ALTER TABLE `transfer_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `minecraft_username` text NOT NULL,
  `uuid` text NOT NULL,
  `balance` int NOT NULL DEFAULT '0',
  `card_number` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (4,'Ress_Svetov','7b77ecfad44e4431b22090588556786f',0,22555),(5,'N3wSk1Y','b4e75811613c4427945698ce20fa50a3',4,85518);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `withdraw_history`
--

DROP TABLE IF EXISTS `withdraw_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `withdraw_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid` int NOT NULL,
  `value` int NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `withdraw_history`
--

LOCK TABLES `withdraw_history` WRITE;
/*!40000 ALTER TABLE `withdraw_history` DISABLE KEYS */;
/*!40000 ALTER TABLE `withdraw_history` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-07-15 13:49:23
