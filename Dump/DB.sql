-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: corfucruises
-- ------------------------------------------------------
-- Server version	8.0.19

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `aspnetroleclaims`
--

DROP TABLE IF EXISTS `aspnetroleclaims`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetroleclaims` (
  `id` int NOT NULL AUTO_INCREMENT,
  `RoleId` varchar(100) NOT NULL,
  `ClaimType` varchar(100) DEFAULT NULL,
  `ClaimValue` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetroleclaims`
--

LOCK TABLES `aspnetroleclaims` WRITE;
/*!40000 ALTER TABLE `aspnetroleclaims` DISABLE KEYS */;
/*!40000 ALTER TABLE `aspnetroleclaims` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aspnetroles`
--

DROP TABLE IF EXISTS `aspnetroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetroles` (
  `Id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Name` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `NormalizedName` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `ConcurrencyStamp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  UNIQUE KEY `RoleNameIndex` (`NormalizedName`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetroles`
--

LOCK TABLES `aspnetroles` WRITE;
/*!40000 ALTER TABLE `aspnetroles` DISABLE KEYS */;
INSERT INTO `aspnetroles` VALUES ('23497d7f-804b-4245-9e7b-ac8db606d454','Admin','ADMIN','0ad0011a-055a-43ea-a909-a32ffc330095'),('b36b0c1c-4db7-4ae0-85f5-043b6647bb3a','User','USER','da9e667b-da55-4caa-a9b0-90dc0d00adcf');
/*!40000 ALTER TABLE `aspnetroles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aspnetuserclaims`
--

DROP TABLE IF EXISTS `aspnetuserclaims`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetuserclaims` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` varchar(100) NOT NULL,
  `ClaimType` varchar(100) DEFAULT NULL,
  `ClaimValue` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetuserclaims`
--

LOCK TABLES `aspnetuserclaims` WRITE;
/*!40000 ALTER TABLE `aspnetuserclaims` DISABLE KEYS */;
/*!40000 ALTER TABLE `aspnetuserclaims` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aspnetuserroles`
--

DROP TABLE IF EXISTS `aspnetuserroles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetuserroles` (
  `userid` varchar(100) NOT NULL,
  `roleid` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetuserroles`
--

LOCK TABLES `aspnetuserroles` WRITE;
/*!40000 ALTER TABLE `aspnetuserroles` DISABLE KEYS */;
INSERT INTO `aspnetuserroles` VALUES ('8faa73be-02f9-4588-afbe-bef129ba9e22','b36b0c1c-4db7-4ae0-85f5-043b6647bb3a'),('b747c76a-7612-4892-9672-b81ade1823d0','23497d7f-804b-4245-9e7b-ac8db606d454'),('e7e014fd-5608-4936-866e-ec11fc8c16da','23497d7f-804b-4245-9e7b-ac8db606d454'),('b642cebf-d980-4f52-83bf-bc03ce410a77','b36b0c1c-4db7-4ae0-85f5-043b6647bb3a');
/*!40000 ALTER TABLE `aspnetuserroles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `aspnetusers`
--

DROP TABLE IF EXISTS `aspnetusers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aspnetusers` (
  `Id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `UserName` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `NormalizedUserName` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Email` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `NormalizedEmail` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `EmailConfirmed` tinyint(1) NOT NULL,
  `PasswordHash` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `SecurityStamp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `ConcurrencyStamp` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `PhoneNumber` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `PhoneNumberConfirmed` tinyint(1) NOT NULL,
  `TwoFactorEnabled` tinyint(1) NOT NULL,
  `LockoutEnd` datetime(6) DEFAULT NULL,
  `LockoutEnabled` tinyint(1) NOT NULL,
  `AccessFailedCount` int NOT NULL,
  `Discriminator` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `DisplayName` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `IsAdmin` tinyint(1) NOT NULL,
  `IsFirstLogin` tinyint(1) NOT NULL,
  `IsOneTimePasswordChanged` tinyint(1) NOT NULL,
  `OneTimePassword` longtext,
  `IsActive` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  UNIQUE KEY `UserNameIndex` (`NormalizedUserName`),
  KEY `EmailIndex` (`NormalizedEmail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aspnetusers`
--

LOCK TABLES `aspnetusers` WRITE;
/*!40000 ALTER TABLE `aspnetusers` DISABLE KEYS */;
INSERT INTO `aspnetusers` VALUES ('b642cebf-d980-4f52-83bf-bc03ce410a77','website','WEBSITE','bestofcorfucruises@gmail.com','BESTOFCORFUCRUISES@GMAIL.COM',1,'AQAAAAEAACcQAAAAEBf5VrryVakkA5A4K1SsGaWgkIbnn32uSQ+4DQKjyZCqXrwr5My2OGBXVdQtgL5BcA==','3HWNS7GUPD2UIAMWCVWVLNPM6AV5FJMQ','8dde268b-b6fe-48d6-b1be-36cf7e0f43f9',NULL,0,0,NULL,1,0,'AppUser','Website',0,0,1,'',1),('b747c76a-7612-4892-9672-b81ade1823d0','mitsos','MITSOS','gatopoulidis@gmail.com','GATOPOULIDIS@GMAIL.COM',1,'AQAAAAEAACcQAAAAEN8z18IB7IEjtO+tReBETOaxQnF9DHAXwm3PBw8LSQwWUNYGhj7fctjBgBbNkZ/DGQ==','VL6XE5SRYFCR42TX7RXSDRZRPPDPLUNI','82b9f647-2ba8-498d-8732-6e58cb2c6830',NULL,0,0,NULL,1,0,'AppUser','Mitsos',1,0,1,'',1),('e7e014fd-5608-4936-866e-ec11fc8c16da','sourvinos','SOURVINOS','johnsourvinos@hotmail.com','JOHNSOURVINOS@HOTMAIL.COM',1,'AQAAAAEAACcQAAAAEH/4LS5Mepgs/QYCJXNjdSUiwEbdMEy/25b1PLI5j/m4J0nm3U8ZFzZT/z9PHMqejg==','MBKFPLCJWCYLTN6IQA4R3XVPNMEYJK4J','102d2f32-c1f8-4847-b82f-d8124435cf9e',NULL,0,0,NULL,1,0,'AppUser','John',1,0,1,'46929e6c-ee70-447a-ba35-542b4be14746',1);
/*!40000 ALTER TABLE `aspnetusers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookingdetails`
--

DROP TABLE IF EXISTS `bookingdetails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookingdetails` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `BookingId` int NOT NULL,
  `OccupantId` int NOT NULL,
  `NationalityId` int NOT NULL,
  `LastName` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `FirstName` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `DOB` datetime(6) NOT NULL,
  `Email` varchar(128) DEFAULT NULL,
  `Phones` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `SpecialCare` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Remarks` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `IsCheckedIn` tinyint(1) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_Details_TripId` (`BookingId`),
  CONSTRAINT `bookingdetails_ibfk_1` FOREIGN KEY (`BookingId`) REFERENCES `bookings` (`BookingId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookingdetails`
--

LOCK TABLES `bookingdetails` WRITE;
/*!40000 ALTER TABLE `bookingdetails` DISABLE KEYS */;
INSERT INTO `bookingdetails` VALUES (71,23,1,1,'Brown','George','1970-01-01 00:00:00.000000','johnsourvinos@hotmail.com','0','','',0);
/*!40000 ALTER TABLE `bookingdetails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `BookingId` int NOT NULL AUTO_INCREMENT,
  `Date` datetime(6) NOT NULL,
  `DestinationId` int NOT NULL,
  `CustomerId` int NOT NULL,
  `PickupPointId` int NOT NULL,
  `ShipId` int NOT NULL,
  `DriverId` int NOT NULL,
  `PortId` int NOT NULL,
  `Email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Phones` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Adults` int NOT NULL,
  `Kids` int NOT NULL,
  `Free` int NOT NULL,
  `TotalPersons` int GENERATED ALWAYS AS (((`Adults` + `Kids`) + `Free`)) VIRTUAL,
  `Remarks` varchar(255) NOT NULL,
  `UserId` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`BookingId`),
  KEY `IX_Trips_DestinationId` (`DestinationId`),
  KEY `IX_Trips_DriverId` (`DriverId`),
  KEY `IX_Trips_PickupPointId` (`PickupPointId`),
  KEY `IX_Trips_PortId` (`PortId`),
  KEY `IX_Trips_ShipId` (`ShipId`),
  KEY `FK_Trips_Customers_CustomerId_idx` (`CustomerId`),
  CONSTRAINT `FK_Trips_Customers_CustomerId` FOREIGN KEY (`CustomerId`) REFERENCES `customers` (`Id`),
  CONSTRAINT `FK_Trips_Destinations_DestinationId` FOREIGN KEY (`DestinationId`) REFERENCES `destinations` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_Trips_Drivers_DriverId` FOREIGN KEY (`DriverId`) REFERENCES `drivers` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_Trips_PickupPoints_PickupPointId` FOREIGN KEY (`PickupPointId`) REFERENCES `pickuppoints` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_Trips_Ports_PortId` FOREIGN KEY (`PortId`) REFERENCES `ports` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_Trips_Ship_ShipId` FOREIGN KEY (`ShipId`) REFERENCES `ships` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` (`BookingId`, `Date`, `DestinationId`, `CustomerId`, `PickupPointId`, `ShipId`, `DriverId`, `PortId`, `Email`, `Phones`, `Adults`, `Kids`, `Free`, `Remarks`, `UserId`) VALUES (13,'2021-05-03 00:00:00.000000',2,10,844,3,2,1,'johnsourvinos@hotmail.com','26610 44340',2,1,0,'','e7e014fd-5608-4936-866e-ec11fc8c16da'),(14,'2021-05-02 00:00:00.000000',2,1,844,1,1,1,'email@server.com','',2,1,0,'','b642cebf-d980-4f52-83bf-bc03ce410a77'),(15,'2021-05-02 00:00:00.000000',2,1,844,1,1,1,'email@server.com','',2,1,0,'','b642cebf-d980-4f52-83bf-bc03ce410a77'),(16,'2021-05-02 00:00:00.000000',2,1,844,1,1,1,'email@server.com','',2,1,0,'','b642cebf-d980-4f52-83bf-bc03ce410a77'),(17,'2021-05-02 00:00:00.000000',2,1,844,1,1,1,'email@server.com','',2,1,0,'','b642cebf-d980-4f52-83bf-bc03ce410a77'),(18,'2021-05-19 00:00:00.000000',2,35,972,1,1,2,'johnsourvinos@hotmail.com','123',1,2,2,'no ','e7e014fd-5608-4936-866e-ec11fc8c16da'),(20,'2021-05-19 00:00:00.000000',2,167,972,1,1,2,'','',3,2,1,'','e7e014fd-5608-4936-866e-ec11fc8c16da'),(21,'2021-05-19 00:00:00.000000',3,35,1578,1,1,2,'johnsourvinos@hotmail.com','6987 810 747',3,2,1,'NO REMARKS','e7e014fd-5608-4936-866e-ec11fc8c16da'),(22,'2021-05-03 00:00:00.000000',45,35,990,1,1,1,'','',3,2,0,'','e7e014fd-5608-4936-866e-ec11fc8c16da'),(23,'2021-05-01 00:00:00.000000',2,1,844,3,2,1,'johnsourvinos@hotmail.com','phones',2,1,0,'','e7e014fd-5608-4936-866e-ec11fc8c16da'),(24,'2021-05-19 00:00:00.000000',45,35,942,1,1,1,'johnsourvinos@hotmail.com','1',2,2,0,'no remarks','e7e014fd-5608-4936-866e-ec11fc8c16da');
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Profession` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Address` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Phones` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `PersonInCharge` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Email` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `IsActive` tinyint NOT NULL,
  `UserId` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `FK_Customers_AspNetUsers_Id` (`UserId`),
  CONSTRAINT `FK_Customers_AspNetUsers_Id` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'WEBSITE','','','','','',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(2,'PACHIS TRAVEL','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΓΚΙΛΦΟΡΔ 7-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(3,'PACHIS TRAVEL','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΓΚΙΛΦΟΡΔ 7-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(5,'PACHIS TRAVEL','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΓΚΙΛΦΟΡΔ 7-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(8,'M.T.S. INCOMING S.A.','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΕΘΝΙΚΗΣ ΠΑΛΑΙΟΚΑΣΤΡΙΤΣΗΣ 58-ΚΕΡΚΥΡΑ','0661.24586','FAGOGENIS NIKOS','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(9,'FLORIDA HOLIDAYS','-','-','0662.61117','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(10,'ISLAND HOLIDAYS','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΚΑΒΟΣ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(12,'ASPROKAVOS','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΚΑΒΟΣ-ΛΕΥΚΙΜΜΗ','0662.61281','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(13,'NAOS','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΚΑΒΟΣ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(19,'ΚΑΡΑΤΖΕΝΗΣ ΕΥΑΓΓΕΛΟΣ','ΕΚΔΟΤΗΡΙΟ ΕΙΣΙΤΗΡΙΩΝ','ΜΩΡΑΙΤΙΚΑ ΚΕΡΚΥΡΑ','2661076768','','vangeliskar@yahoo.gr',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(22,'LORD TRAVEL','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΕΘΝΙΚΗ ΛΕΥΚΙΜΜΗΣ 38 - ΚΕΡΚΥΡΑ','0661.91617','KALOUDIS VASILIS','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(24,'ΒΛΑΧΟΣ ΓΕΩΡΓΙΟΣ G+S','-','-','0661.75723','VLACHOS GEORGIOS','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(25,'STAR TRAVEL','-','-','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(30,'TRAVELWORLD','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΕΘΝΙΚΗ ΠΑΛΑΙΟΚΑΣΤΡΙΤΣΑΣ 25','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(34,'C.T.S','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΕΘΝ. ΠΑΛΑΙΟΚΑΣΤΡΙΤΣΑΣ - ΑΛΥΚΕΣ ΠΟΤΑΜΟΥ','0661.48994','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(35,'TUI HELLAS','ΤΑΞΕΙΔΙΩΤΙΚΗ ΤΟΥΡΙΣΤΙΚΗ ','Λ.ΑΜΑΡΟΥΣΙΟΥ ΧΑΛΑΝΔΡΙΟΥ 80, 151 25 ΠΑΡ. ΑΜΑΡΟΥΣΙΟΥ','','ANGELA MAKRI','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(38,'KYANEA','-','-','','THODORIS','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(42,'BENITSES TRV','-','-','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(45,'HELLENIC ISLAND SERVISES','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΜΟΝΟΠΡΟΣΩΠΗ Ι.Κ.Ε','','ANNITA','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(48,'HELLAS TOURIST SERVICES S.A.','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΕΘΝΙΚΗ ΠΑΛΑΙΟΚΑΣΤΡΙΤΣΑΣ 58Α','2661034495','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(49,'IONIAN TRAVEL','-','-','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(54,'COSMOS CORFU A.E','-','-','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(58,'ΠΑΠΑΔΑΤΟΥ ΧΡΙΣΤΙΑΝΝΑ','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΑΓ. ΓΟΡΔΙΟΣ - ΣΥΝ/ΔΕΣ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(59,'TRUST TRV','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΓΟΥΒΙΑ - ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(60,'STATUS','-','-','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(62,'CORFIOT HOLIDAYS','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΠΕΡΟΥΛΑΔΕΣ - ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(67,'FOUXIA','-','-','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(70,'MAIANΔΡΟΣ','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΕΘΝΙΚΗ ΑΝΤΙΣΤΑΣΕΩΣ - ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(72,'SUNSPOTS','ΤΟΥΡΙΣΤΙΚΕΣ ΕΠΙΧΕΙΡΗΣΕΙΣ','ΕΘΝ. ΠΑΛΑΙΟΚΑΣΤΡΙΤΣΑΣ 24','2661039707','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(73,'PANDIS TRAVEL KAVOS','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΚΑΒΟΣ-ΛΕΥΚΙΜΜΗΣ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(77,'NEXT HOLIDAYS','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΜΕΣΣΟΓΓΗ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(78,'KARDAKARIS NIKOLAOS','-','-','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(89,'DAFNIS FIRST TRAVEL Α.Ε.','ΤΟΥΡΙΣΤΙΚΗ & ΞΕΝΟΔΟΧΕΙΑΚΗ ΕΤΑΙΡΙΑ','2ο ΧΛΜ ΕΘΝ. ΠΕΛΕΚΑ - ΑΛΕΠΟΥ, ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(92,'TSOKAS','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΕΘΝ. ΑΝΤΙΣΤΑΣΕΩΣ 12 - ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(93,'HELLENIC CORFU SERVICES','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΕΘΝΙΚΗ ΠΑΛΑΙΟΚΑΣΤΡΙΤΣΑΣ 24','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(96,'GRECO SERVICES','-','-','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(99,'ΒΑΣΙΛΑΚΗΣ ΑΝΤ. ΦΙΛΙΠΠΟΣ','ΓΡΑΦΕΙΟ ΓΕΝ. ΤΟΥΡΙΣΜΟΥ-ΕΝΟΙΚ/ΣΕΙΣ ΑΥΤ.','ΡΟΔΑ - ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(103,'CORFU TOURIST SERVICES','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΝΑΥΣΙΚΑΣ 30-ΚΑΝΟΝΙ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(105,'CORFU PARADISE','-','-','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(109,'METAXA AIKATERINH','-','-','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(114,'CORFU SEA TRAVEL','-','-','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(116,'KOKKINOS TRAVEL','ΤΟΥΡΙΣΤΙΚΟ ΓΡΑΦΕΙΟ','ΜΑΚΕΔΟΝΙΑΣ 3, 153 41-ΑΓΙΑ ΠΑΡΑΣΚΕΥΗ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(117,'EURO VOYAGES TRAVEL','-','-','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(120,'ΒΛΑΣΕΡΟΣ ΚΩΝ/ΝΟΣ-ΚΑPPA VITA','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΕΛ.ΒΕΝΙΖΕΛΟΥ 32 Α-ΚΕΡΚΥΡΑ (ΥΠΟΚΑΤΑΣΤΗΜΑ)','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(121,'VRADI SOFIA','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΝΤΑΡΑΤΣΟΥ - ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(123,'GIANOYLIS TRAVEL','-','-','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(124,'PIPILAS TRAVEL','-','-','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(125,'KRASAKIS','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΑΧΑΡΑΒΗ - ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(127,'KANOYLAS','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΕΘΝΙΚΗ ΠΑΛΑΙΟΚΑΣΤΡΙΤΣΑΣ 13-14','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(128,'PATROS TRAVEL','-','-','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(129,'XELGKA MPOYTEP','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΔΑΣΙΑ - ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(130,'OPTIMUM INTERNATIONAL A.E.','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΑΓ. ΙΩΑΝΝΗΣ - ΠΕΡΙΣΤΕΡΩΝ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(132,'ZORPIDIS','-','-','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(133,'MEETING POINT HELLAS AE','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΔΗΜΗΤΡΙΟΥ ΚΑΣΑΠΑΚΗ 7','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(134,'KARDAKARI PANAGIOTA','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','RODA - KERKYRA','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(135,'MOYZENIDIS TRAVEL','ΓΡΑΦΕΙΟ ΤΑΞΙΔΙΩΝ','ΚΑΡΑΤΑΣΟΥ 7-ΘΕΣΣΑΛΟΝΙΚΗ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(136,'FOULVIA','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΚΑΣΣΙΩΠΗ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(137,'IBIS EL GRECO','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΜΕΤΕΩΡΩΝ 10','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(138,'ΔΑΡΑΜΟΥΣΚΑΣ ΑΝΑΣΤΑΣΙΟΣ','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΣΙΔΑΡΙ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(139,'SKORDILIS PANAGIWTHS','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΜΕΣΟΓΓΗ-ΠΟΤΑΜΙ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(140,'CAPO DI CORFU','-','-','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(141,'CORFU CRUISES','-','-','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(142,'ΚΑΝΟΥΛΑΣ Ι.Κ.Ε','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΕΘΝΙΚΗ ΠΑΛ/ΤΣΑΣ 11-13','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(143,'ΒΛΑΣΕΡΟΣ ΦΙΛΙΠΠΟΣ','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΣΙΔΑΡΙ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(144,'ΜΠΟΤΣΗΣ ΤΑΣΣΟΣ','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΜΕΣΟΓΓΗ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(145,'PATRAS TRAVEL CORFU','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΕΘΝΙΚΗΣ ΑΝΤΙΣΤΑΣΕΩΣ 4-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(147,'GREEN VIEW TRAVEL','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','2ο ΧΛΜ ΕΘΝΙΚΗΣ ΠΑΛΑΙΟΚΑΣΤΡΙΤΣΑΣ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(148,'CORFU GOLDEN TRAVEL','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','IPSOS, 49083 KERKYRA','2661093622','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(149,'STORK TOURS','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΑΓ.ΓΕΩΡΓΙΟΣ ΑΡΓΥΡΑΔΩΝ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(150,'ΓΡΑΜΜΕΝΟΣ ΣΤΕΦΑΝΟΣ','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΜΠΕΝΙΤΣΕΣ-ΚΕΡΚΥΡΑΣ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(151,'ΠΛΩΤΙΝ ΚΕΡΚΥΡΑΣ ΕΠΕ','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΕΘΝ.ΠΕΛΕΚΑ ΑΛΕΠΟΥ, ΚΕΡΚΥΡΑ','2661022000','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(152,'ARONDA','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΔΑΣΣΙΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(153,'ANTHIS TRAVEL','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΚΟΝΤΟΚΑΛΙ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(154,'LEOPARD TRAVEL','ΤΟΥΡΙΣΤΙΚΟ ΓΡΑΦΕΙΟ','ΡΟΔΑ-ΣΦΑΚΕΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(155,'AKVILA TRAVEL','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΑΓ. ΓΕΩΡΓΙΟΣ ΑΡΓΥΡΑΔΩΝ - ΚΕΡΚΥΡΑ ','2662051679','ΚΑΒΒΑΔΙΑΣ ΚΩΝ. ΠΡΟΚΟΠΙΟΣ','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(156,'ΚΑΨΟΚΑΒΑΔΗΣ & ΣΙΑ Ο.Ε','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΜΠΕΝΙΤΣΕΣ-ΚΕΡΚΥΡΑΣ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(157,'CORFU 4 ALL','I.K.E','ΚΑΒΟΣ-ΛΕΥΚΙΜΜΗ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(158,'ΚΕΡΚΥΡΑΙΚΕΣ ΚΡΟΥΑΖΙΕΡΕΣ Ν.Ε.','ΝΑΥΤΙΚΗ ΕΤΑΙΡΙΑ','ΚΑΒΟΣ ΛΕΥΚΙΜΜΗΣ','-','-','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(159,'OSCAR CORFU TRAVEL','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΜΠΕΝΙΤΣΕΣ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(160,'D.T.S.','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ     ','ΚΑΖΑΝΤΖΙΔΗ & ΒΟΣΠΟΡΟΥ 13-ΗΡΑΚΛΕΙΟ ΚΡΗΤΗΣ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(161,'ΚΑΛΟΥΔΗΣ Ν. ΒΑΣΙΛΕΟΣ','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΥΠΟΚΑΤΑΣΤΗΜΑ ΑΓΙΟΥ ΓΕΩΡΓΙΟΥ-ΑΡΓΥΡΑΔΕΣ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(162,'EASY BOOK-ΚΑΒΒΑΔΙΑΣ','ΤΟΥΡΙΣΤΙΚΟ ΓΡΑΦΕΙΟ','ΑΓ.ΓΕΩΡΓΙΟΣ-ΑΡΓΥΡΑΔΕΣ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(163,'DESTINATION SERVISES','TOYΡΙΣΤΙΚΟ ΓΡΑΦΕΙΟ','ΑΚΤΗ ΚΟΝΔΥΛΗ 4,ΤΚ-18545','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(164,'TRAVEL 4 ALL','ΤΟΥΡΙΣΤΙΚΟ ΓΡΑΦΕΙΟ','ΑΧΑΡΑΒΗ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(165,'ΒΛΑΣΕΡΟΣ ΚΩΝ/ΝΟΣ-SIDARI TRV','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΣΙΔΑΡΙ-ΚΕΡΚΥΡΑ (ΚΕΝΤΡΙΚΟ ΚΑΤ/ΜΑ)','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(166,'PANDIS TRAVEL MORAITIKA','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΜΩΡΑΙΤΙΚΑ-ΚΕΡΚΥΡΑ-ΥΠΟΚ/ΜΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(167,'PAPANAGIOTOU TRAVEL','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΠΕΛΕΚΑΣ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(168,'HN TRAVEL-ΠΑΡΓΙΝΟΣ Δ ΧΑΡΙΔΗΜΟΣ','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΠΕΡΙΘΕΙΑ-ΚΕΡΚΥΡΑ ΚΕΝΤΡΙΚΟ ΚΑΤ/ΜΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(170,'TP TRAVEL-ΠΑΝΔΗΣ ΑΝΤΩΝΗΣ','ΤΟΥΡΙΣΤΙΚΟ ΓΡΑΦΕΙΟ','ΠΕΡΑΜΑ-ΚΕΡΚΥΡΑΣ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(171,'PANDIS TRAVEL ΜΠΕΝ.(ΥΠΟΚ/ΜΑ 2)','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΜΠΕΝΙΤΣΕΣ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(172,'PANDIS TRAVEL ΜΠΕΝΙΤΣΕΣ','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΜΠΕΝΙΤΣΕΣ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(173,'ΛΕΙΤΟΥΡΓΗΣ ΓΕΩΡΓ. ΝΙΚΟΛΑΟΣ','ΤΟΥΡΙΣΤΙΚΟ ΓΡΑΦΕΙΟ','ΑΥΛΙΩΤΕΣ-ΚΕΡΚΥΡΑ (ΚΕΝΤΡΙΚΟ)','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(174,'JUST IN TRAVEL','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','Μ.ΜΕΘΟΔΙΟΥ 10-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(175,'MED.BLUE-ΜΙΑΡΗΣ ΒΑΣΙΛΗΣ','ΤΟΥΡΙΣΤΙΚΟ ΓΡΑΦΕΙΟ-ΥΠΗΡ.ΛΕΩΦ.','ΚΑΒΟΣ ΚΕΡΚΥΡΑΣ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(176,'TRAVEL-CO','ΓΡΑΦΕΙΟ ΓΕΝ. ΤΟΥΡΙΣΜΟΥ','ΣΠΥΡΟΥ ΠΕΡΟΥΛΑΚΗ-ΠΟΤΑΜΟΣ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(177,'PANDIS TRAVEL-GOUVIA','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΓΟΥΒΙΑ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(178,'LEANDROS TRAVEL','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΑΧΑΡΑΒΗ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(179,'MADALENA GOUVIA TOURS','ΤΟΥΡΙΣΤΙΚΟ ΓΡΑΦΕΙΟ','ΓΟΥΒΙΑ - ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(180,'VALUE PLUS TRAVEL-ΒΛΑΣΕΡΟΥ ΣΟΦΙΑ','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΣΙΔΑΡΙ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(181,'OLYMPUS CORFU TRAVEL','ΤΟΥΡΙΣΤΙΚΕΣ ΕΠΙΧΕΙΡΙΣΕΙΣ','ΓΟΥΒΙΑ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(182,'THE TRAVEL CORNER','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΚΑΣΣΙΟΠΗ-ΚΕΡΚΥΡΑΣ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(183,'BANDOS TRAVEL','ΤΟΥΡΙΣΤΙΚΟ ΓΡΑΦΕΙΟ','ΠΕΡΑΜΑ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(184,'EXECUTIVE SOLUTIONS','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΙΩΑΝ.ΓΑΡΔΙΚΙΩΤΗ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(185,'ΧΡΥΣΙΚΟΠΟΥΛΟΣ ΧΑΡΑΛΑΜΠΟΣ','ΕΚΜ. ΤΟΥΡ. ΣΚΑΦΟΥΣ','ΚΑΒΟΣ ΛΕΥΚΙΜΜΗΣ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(186,'ΚΟΡΦΟΥ ΣΙΤΥ ΤΟΥΡΣ-ΤΟΥΡ. ΜΟΝΟΠΡΟΣΩΠΗ ΕΠΕ','ΥΠΗΡΕΣΙΕΣ ΓΡΑΦΕΙΩΝ ΟΡΓΑΝΩΜΕΝΩΝ ΤΑΞΙΔΙΩΝ','ΑΝΑΛΗΨΗ ΚΑΤΩ ΚΟΡΑΚΙΑΝΑΣ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(187,'TRADE GLOBAL','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','2nd HIGH STREET-BRISTOL','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(188,'CORFU PRIVATE TRAVEL','TOΥΡΙΣΤΙΚΟ ΓΡΑΦΕΙΟ','ΑΧΑΡΑΒΗ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(189,'PANDIS TRAVEL (ΥΠΟΚ.7- ΠΟΛΗΣ )','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','Ι.ΘΕΟΤΟΚΗ 128-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(190,'ΒΛΑΧΟΠΟΥΛΟΣ ΠΑΥΛΟΣ','ΓΡΑΦΕΙΟ ΓΕΝ. ΤΟΥΡΙΣΜΟΥ','ΜΩΡΑΪΤΙΚΑ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(191,'MARINE TRAVEL','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','Ι.ΘΕΟΤΟΚΗ 132','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(192,'ΣΥΡΙΩΤΗΣ ΣΠΥΡΙΔΩΝ','ΓΡΑΦΕΙΟ ΓΕΝ. ΤΟΥΡΙΣΜΟΥ-ΕΝΟΙΚ.ΑΥΤ/ΤΩΝ','ΑΧΑΡΑΒΗ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(193,'CORFU EXPRESS','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΒΙΤΑΛΑΔΕΣ-ΓΑΡΔΕΝΟΣ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(194,'DESTINY CORFU','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΔΟΝΑΤΟΥ ΔΗΜΟΥΛΙΤΣΑ 82-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(195,'AUGUSTA TRAVEL-ΛΙΝΟΣΠΟΡΗΣ ΧΑΡΙΛΑΟΣ','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΕΛ. ΒΕΝΙΖΕΛΟΥ 1-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(196,'A. ΠΑΝΔΗΣ & Σια Ο.Ε. - ΑΓ. ΓΟΡΔΙΟΣ','ΤΟΥΡΙΣΤΙΚΟ ΓΡΑΦΕΙΟ','ΑΓ. ΓΟΡΔΗΣ-ΚΕΡΚΥΡΑΣ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(197,'ΙΔΙΩΤΗΣ','ΙΔΙΩΤΗΣ','-','-','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(199,'TC in-Destination Tourism Hellas ΜΟΝΟΠΡΟΣΩΠΗ ΙΚΕ','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΜΗΤΡΟΠΟΛΕΩΣ 26-28, 10563 ΑΘΗΝΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(200,'LET\'S BOOK TRAVEL','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΒΕΪΚΟΥ27, ΚΟΥΚΑΚΙ,ΑΘΗΝΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(201,'LUXURY TRAVEL DMC Ε.Π.Ε.','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΔΑΝΑΙΔΩΝ 9, ΘΕΣ/ΝΙΚΗ','2310528922','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(202,'CORFU SUN TRAVEL','ΤΟΥΡΙΣΤΙΚΟ ΓΡΑΦΕΙΟ','ΤΑΡΤΑΓΙΑ-ΔΑΣΙΑΣ-ΚΑΤΩ ΚΟΡΑΚΙΑΝΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(203,'ΤΖΟΙ ΚΡΟΥΙΖΙΣ ΝΕ','ΝΑΥΤΙΚΗ ΕΤΑΙΡΕΙΑ','ΝΕΟ ΛΙΜΑΝΙ ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(204,'ΚΑΠΑ ΚΟΡΦΟΥ - ΣΙΔΑΡΙ ΤΡΑΒΕΛ Α.Ε','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','Κ ΓΕΩΡΓΑΚΗ 31','2661034019','','accounts@kappavita.gr',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(205,'ΚΑΠΑ ΚΟΡΦΟΥ - ΣΙΔΑΡΙ ΤΡΑΒΕΛ Α.Ε - ΥΠ/ΜΑ','ΓΡΕΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΥΠΟΚ/ΜΑ ΕΛ. ΒΕΝΙΖΕΛΟΥ 32Α, ΚΕΡΚΥΡΑ','2661034400, 2661024127','','kappavita@kappavita.gr',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(206,'KARDAKARI - CORFU COMPASS ΥΠ/ΜΑ 4','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΑΓ. ΓΟΡΔΙΟΣ - ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(209,'KORINA TRAVEL-TΣΟΥΚΙΑ ΚΩΝ/ΝΑ','ΤΟΥΡΙΣΤΙΚΟ ΓΡΑΦΕΙΟ','ΚΑΒΟΣ-ΛΕΥΚΙΜΜΗ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(210,'TRIDENT-ΠΑΝΔΗΣ ΣΠΥΡΟΣ','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΚΑΒΟΣ-ΛΕΥΚΙΜΜΗ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(211,'ΠΑΝΔΗΣ ΧΑΡΑΛ. ΘΕΟΔΩΡΟΣ','ΤΟΥΡΙΣΤΙΚΟ ΓΡΑΦΕΙΟ','ΚΑΒΟΣ - ΚΕΡΚΥΡΑ','2662061037','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(217,'DAYTRIP4U','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','NICOSIA-CYPRUS','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(218,'CHARITOS TRAVEL','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΕΘΝ. ΠΑΛΑΙΟΚΑΣΤΡΙΤΣΑΣ 66','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(219,'SANDY TRAVEL-ΣΤΟΥΠΑΣ ΣΟΦΟΚΛΗΣ','ΤΟΥΡΙΣΤΚΟ ΓΡΑΦΕΙΟ','ΚΑΒΟΣ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(220,'PYRGI TRAVEL-ΤΡΙΒΙΖΑΣ','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΓΟΥΒΙΑ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(221,'BIG TRAVEL-BIBLO GLOBUS','ΔΡΑΣΤΗΡΙΟΤΗΤΕΣ ΓΡΑΦΕΙΩΝ ΓΕΝ. ΤΟΥΡΙΣΜΟΥ','ΕΘΝ/ΚΗΣ ΠΑΛΑΙΟΚΑΣΤΡΙΤΣΑΣ 7-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(222,'ASK 2 TRAVEL','ΔΡΑΣΤΗΡΙΟΤΗΤΕΣ ΤΑΞΙΔΙΩΤΙΚΩΝ ΠΡΑΚΤΟΡΕΙΩΝ','ΛΕΩΦ. ΣΥΓΓΡΟΥ 188, 17671 ΚΑΛΛΙΘΕΑ-ΑΘΗΝΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(223,'GRECIAN TRAVEL TOURIST ENTERPRISES A.E.','ΤΟΥΡΙΣΤΙΚΕΣ-ΞΕΝ/ΚΕΣ ΕΠΙΧΕΙΡΗΣΕΙΣ','ΑΠΟΛΛΩΝΟΣ 34-ΑΘΗΝΑ ΤΚ 10556','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(224,'TOURIST CLUB ΜΟΝΟΠΡΟΣΩΠΗ Ε.Π.Ε.','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΟΜΗΡΟΥ 52- ΑΘΗΝΑ Τ.Κ. 10672','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(226,'DANAOS BLUE TRAVEL SERVISES S.A.','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','2ΧΛΜ Ε.Ο. ΠΕΛΕΚΑΣ-ΑΛΕΠΟΥ ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(227,'SPIN TOURS','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΠΕΡΑΜΑ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(228,'OLYMPUS CORFU TRAVEL','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΓΟΥΒΙΑ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(229,'TRAVEL POINT CORFU','ΥΠΗΡΕΣΙΕΣ ΤΟΥΡΙΣΤΙΚΟΥ ΓΡΑΦΕΙΟΥ','ΜΠΕΝΙΤΣΕΣ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(230,'MARIA\'S TOURIST SERVICES','ΕΝΟΙΚΙΑΣΕΙΣ ΑΥΤΟΚΙΝΗΤΩΝ-ΜΟΤΟΣΥΚΛΕΤΩΝ','ΑΓΙΟΣ ΓΕΩΡΓΙΟΣ ΠΑΓΩΝ-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(231,'MANO GRAIKIJA','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','GAISU G. 3A-3, ANTEZERIAI, VILNIAUS DSTR.','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(232,'CHRISTIAN TOUR-AMAZE HOLIDAYS','TOYΡΙΣΤΙΚΕΣ ΕΠΙΧΕΙΡΗΣΕΙΣ','ΕΘΝ. ΑΝΤΙΣΤΑΣΕΩΣ 18-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(233,'GRECA TRAVEL','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','ΕΛΕΥΘΕΡΙΟΥ ΒΕΝΙΖΕΛΟΥ 212, ΚΑΛΛΙΘΕΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(234,'DISCOVERY TRAVEL LTD','ΓΡΑΦΕΙΟ ΓΕΝΙΚΟΥ ΤΟΥΡΙΣΜΟΥ','Liulin 8, str 328 No 10','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(235,'AROUND CORFU-YEVGENIA RIGANA','ΤΟΥΡΙΣΤΙΚΟ ΓΡΑΦΕΙΟ','ΚΑΠΟΔΙΣΤΡΙΟΥ 106-ΚΕΡΚΥΡΑ','','','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(236,'JOHN SOURVINOS','TRAVEL AGENT','SOMEWHERE IN CORFU','+30 6312 854 954','MYSELF','johnsourvinos@hotmail.com',1,'e7e014fd-5608-4936-866e-ec11fc8c16da');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dataentrypersons`
--

DROP TABLE IF EXISTS `dataentrypersons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dataentrypersons` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ShipId` int NOT NULL,
  `FullName` varchar(128) NOT NULL,
  `Phones` varchar(128) NOT NULL,
  `Email` varchar(128) NOT NULL,
  `Fax` varchar(128) NOT NULL,
  `Address` varchar(128) NOT NULL,
  `IsPrimary` tinytext NOT NULL,
  `IsActive` tinytext NOT NULL,
  `UserId` varchar(128) NOT NULL,
  PRIMARY KEY (`Id`),
  KEY `FK_DataEntryPersons_AspNetUsers_Id` (`UserId`),
  KEY `FK_DataEntryPersons_Ship_Id` (`ShipId`),
  CONSTRAINT `FK_DataEntryPersons_AspNetUsers_Id` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_DataEntryPersons_Ship_Id` FOREIGN KEY (`ShipId`) REFERENCES `ships` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dataentrypersons`
--

LOCK TABLES `dataentrypersons` WRITE;
/*!40000 ALTER TABLE `dataentrypersons` DISABLE KEYS */;
/*!40000 ALTER TABLE `dataentrypersons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `destinations`
--

DROP TABLE IF EXISTS `destinations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `destinations` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Abbreviation` varchar(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Description` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `IsActive` tinyint NOT NULL,
  `UserId` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `FK_Destinations_AspNetUsers_Id` (`UserId`),
  CONSTRAINT `FK_Destinations_AspNetUsers_Id` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=123 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='				';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `destinations`
--

LOCK TABLES `destinations` WRITE;
/*!40000 ALTER TABLE `destinations` DISABLE KEYS */;
INSERT INTO `destinations` VALUES (2,'PA','PAXOS - ANTIPAXOS',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(3,'BL','BLUE LAGOON',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(5,'A','AQUALAND',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(9,'S','SAFARI CRUISE',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(12,'B','B.B.Q',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(15,'G','GRAND ISLAND',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(18,'G','GREEK NIGHT',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(22,'C','CORFU BY DAY',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(23,'A','ALBANIA',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(24,'C','CORFU SUNSET CRUISE',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(25,'O','OLYMPIC FLAME',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(26,'O','OLYMPIC FLAME',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(27,'C','CORFU BY NIGHT',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(28,'C','CORFU DELIGHT',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(29,'P','PARGA-PAXOS',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(30,'M','MOONLIGHT',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(31,'T','TRANSFER BLUE LAGOON',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(37,'K','KALYPSO STAR',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(39,'A','AQUALAND TRANSFER',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(40,'B','BOOZE CRUISE',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(41,'S','SCUBA DIVING',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(42,'O','OLIKH NAYLOSH',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(43,'S','SUNSET BLUE LAGOON',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(44,'P','PAXOS - ANTIPAXOS - SPACE SAFE',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(45,'BL','BLUE LAGOON-SPACE SAFE',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(74,'1','PAXOS - ANTIPAXOS',0,'e7e014fd-5608-4936-866e-ec11fc8c16da');
/*!40000 ALTER TABLE `destinations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `drivers`
--

DROP TABLE IF EXISTS `drivers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `drivers` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Phones` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `IsActive` tinyint NOT NULL,
  `UserId` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `FK_Drivers_AspNetUsers_Id` (`UserId`),
  CONSTRAINT `FK_Drivers_AspNetUsers_Id` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `drivers`
--

LOCK TABLES `drivers` WRITE;
/*!40000 ALTER TABLE `drivers` DISABLE KEYS */;
INSERT INTO `drivers` VALUES (1,'','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(2,'STAMATIS','1',1,'e7e014fd-5608-4936-866e-ec11fc8c16da');
/*!40000 ALTER TABLE `drivers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genders`
--

DROP TABLE IF EXISTS `genders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genders` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(128) NOT NULL,
  `IsActive` tinytext NOT NULL,
  `UserId` varchar(128) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `FK_Genders_AspNetUsers_Id` (`UserId`),
  CONSTRAINT `FK_Genders_AspNetUsers_Id` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genders`
--

LOCK TABLES `genders` WRITE;
/*!40000 ALTER TABLE `genders` DISABLE KEYS */;
INSERT INTO `genders` VALUES (1,'MALE','1','e7e014fd-5608-4936-866e-ec11fc8c16da'),(2,'FEMALE','1','e7e014fd-5608-4936-866e-ec11fc8c16da'),(3,'OTHER','1','e7e014fd-5608-4936-866e-ec11fc8c16da');
/*!40000 ALTER TABLE `genders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `managers`
--

DROP TABLE IF EXISTS `managers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `managers` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ShipId` int NOT NULL,
  `Name` varchar(128) NOT NULL,
  `NameForGreece` varchar(128) NOT NULL,
  `Agent` varchar(128) NOT NULL,
  `IsActive` tinytext NOT NULL,
  `UserId` varchar(128) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `FK_Managers_AspNetUsers_Id` (`UserId`),
  KEY `FK_Managers_Ship_Id` (`ShipId`),
  CONSTRAINT `FK_Managers_AspNetUsers_Id` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_Managers_Ship_Id` FOREIGN KEY (`ShipId`) REFERENCES `ships` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `managers`
--

LOCK TABLES `managers` WRITE;
/*!40000 ALTER TABLE `managers` DISABLE KEYS */;
/*!40000 ALTER TABLE `managers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nationalities`
--

DROP TABLE IF EXISTS `nationalities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nationalities` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(128) NOT NULL,
  `FlagUrl` varchar(128) NOT NULL,
  `IsActive` tinyint NOT NULL,
  `UserId` varchar(128) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `FK_Nationalities_AspNetUsers_Id` (`UserId`),
  CONSTRAINT `FK_Nationalities_AspNetUsers_Id` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nationalities`
--

LOCK TABLES `nationalities` WRITE;
/*!40000 ALTER TABLE `nationalities` DISABLE KEYS */;
INSERT INTO `nationalities` VALUES (1,'','',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(2,'GREECE!','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da');
/*!40000 ALTER TABLE `nationalities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `occupants`
--

DROP TABLE IF EXISTS `occupants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `occupants` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(128) NOT NULL,
  `IsActive` tinyint NOT NULL,
  `UserId` varchar(128) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`) /*!80000 INVISIBLE */,
  KEY `FK_Identifiers_AspNetUsers_Id` (`UserId`),
  CONSTRAINT `FK_Identifiers_AspNetUsers_Id` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `occupants`
--

LOCK TABLES `occupants` WRITE;
/*!40000 ALTER TABLE `occupants` DISABLE KEYS */;
INSERT INTO `occupants` VALUES (1,'CREW',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(2,'PASSENGER',1,'e7e014fd-5608-4936-866e-ec11fc8c16da');
/*!40000 ALTER TABLE `occupants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pickuppoints`
--

DROP TABLE IF EXISTS `pickuppoints`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pickuppoints` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `RouteId` int NOT NULL,
  `Description` varchar(128) NOT NULL,
  `ExactPoint` varchar(128) NOT NULL,
  `Time` varchar(5) NOT NULL,
  `Coordinates` varchar(128) DEFAULT NULL,
  `IsActive` tinyint NOT NULL,
  `UserId` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `FK_Users_Id` (`UserId`),
  KEY `FK_Routes_Id` (`RouteId`),
  CONSTRAINT `FK_PickupPoints_AspNetUsers_Id` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_PickupPoints_Routes_Id` FOREIGN KEY (`RouteId`) REFERENCES `routes` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1602 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pickuppoints`
--

LOCK TABLES `pickuppoints` WRITE;
/*!40000 ALTER TABLE `pickuppoints` DISABLE KEYS */;
INSERT INTO `pickuppoints` VALUES (844,28,'RESTIA SUITES','MAI ROAD','06:55','39.80549315087046,19.829987078349387',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(845,19,'ARION HOTEL','MAIN ROAD','08:10','39.6085812288308,19.92480039596558',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(848,22,'PALEO DISCO','MAIN ROAD','07:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(850,19,'SOPHIAS CORNER','MAIN ROAD','07:29','39.687623,19.838339',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(851,29,'FOUNTAIN BAR','CROSSROAD','09:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(852,19,'DASSIA PHARMACY','MAIN ROAD','07:31','-',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(853,29,'SILVERSTONE GO CARTS','MAIN ROAD','09:44','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(854,28,'ANGELINA','MAIN ROAD - KALUA BAR','07:30','39.794461727875024,19.69951315783758',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(855,22,'VILLA MIRTO','MAIN ROAD','07:15','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(856,29,'SAN MARINA','MAIN ROAD','09:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(858,29,'CAPTAINS AG.PETROS','MAIN ROAD','09:44','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(859,29,'SCRIVAS','MAIN ROAD','09:44','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(861,28,'PANORAMA','SIDARI SCONTO MARKET','07:30','39.792619046820356,19.706992786104887',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(862,28,'SPIROS S/M SIDARI','MAIN ROAD','07:37','-',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(863,28,'TZORAS S/M ACHARAVI','MAIN ROAD','06:57','39.801974147310965,19.836413940283308',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(864,29,'EKATI HOTEL','OFFICE','09:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(865,29,'ISLAND HOLIDAYS','OFFICE','09:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(866,29,'LEMON GROVE','MAIN ROAD','09:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(867,22,'LAKONES JUNCTION','JUNCTION','07:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(870,22,'ERMONES BUS STOP','BUS STOP','07:05','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(871,22,'GLYFADA BUS STOP','BUS STOP','07:15','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(872,29,'PANDIS TRAVEL','OFFICE','09:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(873,32,'AKTI ARILLAS HOTEL','AKTI ARILLAS','07:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(875,28,'SUNRISE TAVERNA','MAIN ROAD','07:20','-',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(877,20,'CATHOLIC CHURCH MESSONGHI','MAIN ROAD','09:11','39.47657250919703,19.929338693618778',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(878,19,'VIVA BAR','M.ROAD','07:31','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(880,28,'SUMMERTIME HOTEL','SAXOPHONE BAR','07:34','39.79460604810414,19.69710767269135',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(882,19,'CORFU MARE','MAIN ROAD','07:54','39.628176396384916,19.896599650383',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(883,19,'NISSAKI KATERINA\'S S/M','MAIN ROAD','07:05','39.725532641157955,19.895934462547306',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(885,22,'GR.MEDITTERANNEO','HOTEL','07:05','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(886,28,'POTAMOS','CROSSROAD','07:30','39.78477917234618,19.717969894409183',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(887,20,'STARS STDS','M.ROAD','09:40','39.43128792558272,19.952070571809013',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(889,32,'NAFSIKA SAN STEFANO','M.ROAD','07:10','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(890,19,'BRETAGNE HOTEL','M.ROAD','08:20','39.61192875069881,19.91530537605286',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(891,19,'BUTCHERS CORNER PIRGI','MAIN ROAD','07:20','39.70628284863589,19.843454360961918',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(892,28,'FIRE STATION','M.ROAD','07:05','-',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(893,19,'MARGARITA DASSIA-IPSOS','M.ROAD','07:25','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(894,29,'NIKOS APTS AG.PETROS','M.ROAD','09:44','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(895,29,'OYLA APTS','CROSSROAD','09:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(897,32,'ATHINA','ASPA S/M','07:10','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(898,19,'KOMENO BAY','e7e014fd-5608-4936-866e-ec11fc8c16da P. CROSSROAD','07:38','39.6651416,19.8542106',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(899,28,'BOSTONIA VILLAGE','TZORAS S/M','07:00','39.80197528370331,19.836239218711857',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(900,32,'MARINA ARILLAS','M.ROAD','07:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(901,22,'PHILOXENIA','BRIDGE','07:05','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(902,22,'OCEANIS','M.ROAD','07:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(903,20,'AKTI PERAMA','M.ROAD','08:30','39.482091332575834,19.923878561826196',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(905,19,'KIRKI TAVERNA','M.ROAD','07:31','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(906,19,'PRIMAVERA HOTEL','M.ROAD-OPPOSITE','07:35','39.67282123617335,19.839608073234558',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(907,28,'LAGOON','M.ROAD','07:30','-',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(908,19,'CORFU RESIDENSE','M.ROAD','07:06','39.72546250161387,19.892506599426273',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(909,28,'GIANNIS RENT A BIKE KASSIOPI','M.ROAD','06:40','39.787924419967645,19.918357729911808',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(910,22,'PALEO CAMPING','MAIN ROAD','07:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(911,29,'MORFEAS HOTEL','M.ROAD','09:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(912,28,'SIDARI MIMOZA','M.ROAD','07:30','39.79243809460396,19.70586717873374',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(913,28,'RODA BP','M.ROAD','07:06','39.78643631942038,19.79472398757935',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(914,28,'ALMYROS NATURA','HOTEL','06:55','39.8077942786189,19.83143270015717',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(915,22,'PALEO INN','HOTEL','07:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(916,32,'ROMANZA HOTEL ST.STEFANO','HOTEL','07:10','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(917,20,'PERIVOLI GAS STATION','M.ROAD','09:40','39.42508442456661,20.002015829086307',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(918,22,'ODYSSEUS','M.ROAD','07:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(919,28,'NIKOS SUPERMARKET','M.ROAD','06:40','39.782870518174946,19.92371141910553',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(920,28,'ALKION','M.ROAD','07:30','39.792050535946956,19.70179080963135',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(921,28,'ANDROMEDA HOTEL','HOTEL','07:30','39.786015853045996,19.68210875988007',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(922,20,'GOLDEN SUNSET BUKARI','M.ROAD','09:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(923,28,'RODA TAXI RANK','M.ROAD','07:09','39.78714922253394,19.789154650443518',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(924,22,'SPIROS TAVERNA','M.ROAD','07:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(925,28,'MICHELANGELO KASSIOPI','NIKOS SUPERMARKET','06:40','39.782870518174946,19.92371141910553',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(926,32,'THEO HOTEL PAGOI','HOTEL','06:50','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(927,22,'FAROS','M.ROAD','07:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(928,28,'OLGA','M.ROAD','07:30','-',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(931,28,'SUNNY CORFU SIDARI','M. ROAD','07:30','39.79102418256839,19.69811618328095',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(932,28,'SIDARI SCONTO MARKET','M. ROAD','07:30','39.79233082256098,19.704810976982117',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(933,29,'KAVOS PLAZA','M.ROAD','09:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(935,28,'PARADISE BAR','M. ROAD','07:29','39.79045535361871,19.70877528190613',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(936,32,'COSTAS GOLDEN BEACH-PAGOI','MAIN GATE','06:50','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(940,29,'YIANETTA','M. ROAD','09:44','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(941,22,'PALEO ART NOUVEAU','M. ROAD','07:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(942,19,'ARITI','M. ROAD','08:10','39.593019326693025,19.918819069862366',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(943,29,'SOCRATIS','M.ROAD','09:44','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(944,20,'MAYFLOWER','EKO-MORAITIKA','09:10','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(945,19,'BARBATI CHURCH','MAIN ROAD','07:15','39.71920329151425,19.869031906127933',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(946,19,'CORFU PALACE','M. ROAD','08:10','39.61878033392963,19.92303013801575',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(947,19,'BRETANIA HOTEL','M. ROAD','08:20','39.61190395483556,19.915230274200443',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(948,19,'IPSOS ΔΗΜΑΡΧΕΙΟ','MAIN ROAD','07:20','39.69845898670079,19.838595760498322',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(949,29,'KYANEA','MAIN ROAD','09:44','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(950,29,'SEA SIDE','MAIN ROAD','09:44','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(951,19,'EKO DASSIA','EKO DASSIA','07:20','39.6869859333045,19.838330151953524',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(952,29,'SUNRISE','M.ROAD','09:44','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(953,19,'TILEMACHOS HOTEL','MAIN ROAD','07:35','39.67331258611935,19.83937203884125',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(954,19,'TARTAYIA BAR','M.ROAD-APENANTI','07:30','39.6824163792293,19.83761787414551',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(956,20,'TSAKI','TSAKI-SPIROS BIKES','08:55','39.528816419068114,19.921752682303374',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(957,29,'CAPO DI CORFU','M.GATE','09:44','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(958,28,'MARE BLUE = BLUE BAY','HOTEL','06:50','39.81294936478792,19.865169525146484',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(959,19,'RIVIERA BARBATI','MAIN ROAD','07:15','39.719194,19.869231',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(960,20,'ALEXANDROS','M.ROAD','08:40','39.57918221119962,19.913122057914737',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(963,31,'KAVOS JETTY','-','10:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(964,31,'LEFKIMMI PORT','-','09:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(965,29,'IONIAN SEA VIEW','M.ROAD','09:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(966,29,'CHANDRIS S/M','M. ROAD','09:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(967,29,'CORFU SEA GARDENS','M. ROAD','09:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(968,29,'ASPIOTIS','OFFICE','09:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(969,29,'ASPROKAVOS S/M','M. ROAD','09:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(970,20,'ANNITA HTL','M.ROAD','08:35','39.58611971816607,19.910745620727543',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(972,20,'PERAMA KIOSK','OASIS','08:40','39.58117919290795,19.913154244422913',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(973,20,'LINIA BP','M.ROAD','09:30','39.44348812354449,19.94172946452493',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(974,20,'KAIZER BRIDGE','M.ROAD','08:50','39.563381597670364,19.910122092732188',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(975,22,'SINARADES','BUS STOP-CROSSROAD','07:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(976,22,'PALEOKASTRITSA HOTEL','MAIN ROAD','07:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(977,22,'AMPELAKI','RESTURANT LA CALM','07:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(978,19,'MAGGIOROS S/M','M.ROAD','07:28','39.69002466069578,19.83760178089142',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(981,20,'PONTIKONISI HTL','M.ROAD','08:40','39.584689275950645,19.91429150104523',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(984,22,'MICHALIS TAVERNA','M.ROAD','07:10','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(986,19,'AKTI BARBATI APPTS','M.ROAD','07:15','39.71579081310867,19.864220023155216',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(988,19,'DASSIA BEACH','JOY S/M','07:29','39.68204894778133,19.837456941604618',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(989,19,'HELLENIC OFFICE','KANALIA (NEXT TO TUI OFFICE)','08:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(990,28,'SPIROS SUPERMARKET','M.ROAD','07:04','-',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(991,20,'BELLOS BEACH HOTEL','M.ROAD','08:55','39.526031758315064,19.922761515544046',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(992,28,'SALVANOS S/M','M.ROAD','07:00','39.79468436068705,19.820086956024173',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(994,20,'COCA COLA','M.ROAD','08:35','39.59033879391593,19.894239462113735',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(995,20,'CHURCH - ST.GEORGE\'S','M. ROAD','09:40','39.42541126403798,19.95320964661165',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(997,20,'PASSAS STD','BENITSES PORT','08:50','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(998,20,'ELEANA APTS','M.ROAD','09:40','39.42969214981488,19.95028138160706',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(999,19,'e7e014fd-5608-4936-866e-ec11fc8c16da PALACE','e7e014fd-5608-4936-866e-ec11fc8c16da PALACE CROSSROAD','07:38','39.66609475822976,19.85562086105347',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1000,28,'SIDARI VILLAGE','LAGOON','07:30','39.7915064469065,19.70510601997376',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1002,19,'SAN MARCO','MINI MARKET','07:19','39.70849901476611,19.842596054077152',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1003,19,'AB VASILOPOYLOS KONTOKALI','M.ROAD','07:45','39.644354136277705,19.85363602638245',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1005,28,'PIXEL (SPORT CENTER)','M.ROAD','07:01','-',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1006,20,'GRANDE MARE = COSTA BLUE','M.ROAD','08:50','39.5608175156743,19.91074994797698',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1007,22,'LIAPADES BEACH','HOTEL - TAVERNA','07:10','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1008,20,'TZEVENOS','M.ROAD','09:40','39.42826987864351,19.948928749975035',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1009,20,'ANANIAS','BLUE SEA-MAIN ROAD','09:40','39.42551848362576,19.95121279848928',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1010,19,'VIROS CROSSROAD','M.ROAD','08:05','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1011,28,'NSK OFFICE RODA','OFFICE','07:05','39.78889311078403,19.788013100624088',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1013,20,'ST.GEORGE HTL','BARBAYIANNIS','09:40','39.423894240924085,19.960969668720505',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1015,20,'PANORAMA REST.AG.GEORGIOS','M.ROAD','09:40','39.42614522284321,19.944965243339542',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1016,20,'ARGYRADES','KIOSK','09:40','39.43618471308516,19.976422190666202',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1017,20,'ONEIRO VILLAS','M.ROAD 200m AFTER REGENCY','09:00','39.51557069777342,19.924123708979494',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1018,20,'BP MESSONGHI','CROSSROAD FOR AG.MATHEOS','09:20','39.47483287095038,19.912037522323683',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1020,19,'PARAMITHOUPOLI','M.ROAD','07:45','39.64488649273263,19.859414564067084',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1021,20,'MARATHIAS','M.ROAD BUS STOP','09:35','39.4285775,19.9951761',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1022,28,'THREE LITTLE PIGS','MAIN ROAD','07:31','39.79214138128412,19.70261528709018',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1023,19,'VILLA ANNA CASTELLO','EKO DASSIA','07:20','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1025,20,'GOLDEN SAND','M.ROAD','09:40','39.42523722609506,19.95416436261219',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1027,20,'BLUE SEA HTL','M.ROAD','09:40','39.4255728703101,19.95087065846085',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1028,28,'ALMYROS VILLAS RESORT','MAIN GATE','07:00','39.799098477448595,19.82900040229109',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1029,22,'PINK PALACE','PINK PALACE','07:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1031,19,'MARILENA HOTEL','M.ROAD','07:16','39.70827616329067,19.843803048133854',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1032,22,'BELVEDERE APPTS AG.GORDIS','M.ROAD','07:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1035,22,'AQUALAND VILLAGE','M.ROAD','07:25','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1037,28,'RODA CROSSROAD','CROSSROAD','07:07','39.786874958688365,19.78920219980073',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1038,20,'AEGLI HOTEL','PONTIKONISI','08:40','39.58571043280224,19.914393424987797',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1040,28,'ACHARAVI PUMP','M.ROAD','07:01','39.792071145295694,19.816229939460754',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1041,20,'KARINA HOTEL','M.ROAD','08:55','39.53361638654475,19.9190765619278',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1042,20,'LORD TRAVEL','M.ROAD','09:40','39.424519912995166,19.958198741255067',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1043,20,'EL GRECO','M.ROAD','08:50','39.55877858926616,19.91123296393497',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1044,20,'ALAMANOS','M. ROAD','09:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1045,19,'KOTSOVOLOS','M.ROAD','07:55','39.62444539501614,19.89109039306641',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1046,19,'HELLENIS','M.ROAD','08:10','39.59390394819019,19.916694760322574',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1047,19,'LA RIVIERA','M.ROAD','07:14','39.719223922671894,19.86914455890656',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1048,22,'PARADISE FUN CLUB','M. ROAD - KIOSK','07:30','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1049,19,'KONTOKALI - AB BASILOPOULOS','TRAFFIC LIGHTS','07:43','39.6436116,19.8529911',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1050,20,'ALKIONIS','M.ROAD','09:10','39.48439387380603,19.92499887943268',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1053,28,'SIDARI ELIN','M.ROAD','07:38','39.782685009007075,19.70827102661133',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1054,19,'AKROGIALI','RESTAURANT','07:15','39.720151,19.874266',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1055,20,'FRINIE','M.ROAD','08:45','39.57302087062317,19.91144736598792',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1056,20,'OASIS HOTEL','BUS STOP','08:40','39.58002152936207,19.913197159767154',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1057,20,'KAFESAS','RESTAURANT','09:40','39.4242551466998,19.95899271243499',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1058,20,'MALTA','RESTAURANT','09:40','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1059,20,'VERONIKA','MAIN ROAD','09:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1060,20,'TAXI MESSONGHI','TAXI STATION','09:15','39.47876291118928,19.927091002464298',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1061,20,'COOP SUPERMARKET','MAIN ROAD','09:10','39.48581810387342,19.924982786178592',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1062,20,'AG.GEORGIOS - CROSSROAD','CROSSROAD','09:40','39.442704634722325,19.95511898271196',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1063,19,'IONIAN ARCHES','POST OFFICE','07:39','39.6606665,19.8396371',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1064,28,'ANGELA  BEACH','HOTEL','07:15','39.794175112572745,19.76324116328824',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1066,28,'IONIAN PRINCESS','PUMP','07:00','39.792071145295694,19.816229939460754',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1069,19,'GOVINO BAY','PARK HTL M.ROAD','07:40','39.658337,19.8381531',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1070,19,'GEORGIA APARTMENTS','EKO DASSIA','07:20','39.68707309378835,19.83829379081726',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1071,28,'ROBOLLA BEACH','M.GATE RODA BEACH','07:10','39.795286858903985,19.78094179183245',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1072,19,'MATHRAKI DINOS','JET OIL','07:41','39.654686141761985,19.840576168701674',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1073,19,'KIOSK GOUVIA','KIOSK GOUVIA','07:42','39.652321810681244,19.841834306716922',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1074,20,'ROSSIS','M.ROAD','09:11','39.47721017587317,19.921941161155704',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1075,28,'FARMAKEIO ACHARAVI - ΔΗΜΗΤΡΑ S/M','M.ROAD','07:02','39.79115196233764,19.814513325691227',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1076,28,'BEIS BEACH','SPIROS SM','07:00','39.794787403423406,19.816036820411686',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1077,28,'CORYFO VILLAGE','SALVANOS SUPER MARKET','07:00','39.79466787383488,19.820097684860233',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1079,22,'AG.GORDIS HTL=MAYOR LA GROTTA VERDE','HOTEL','07:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1080,22,'AKROTIRI','M.ROAD','07:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1081,19,'CAPTAINS','CAPTAINS BAR','07:15','39.71983047594857,19.872652888298038',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1082,19,'PAVLOS STUDIOS','EKO DASSIA','07:20','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1083,19,'IPSOS BEACH HTL','M.ROAD','07:21','39.697073,19.838188',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1084,19,'PIRGI HOTEL','KREOPOLIO M.ROAD','07:20','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1085,19,'JET OIL','M.ROAD','07:41','39.65481229501845,19.84042882919312',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1086,19,'DIELLAS MARKET','M.ROAD','07:42','39.65208638712216,19.8421186208725',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1087,19,'PANTOKRATOR HTL','M.ROAD','07:14','39.720164696903026,19.874289035797123',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1089,19,'EYTERPE','KONTOKALI HTL M.GATE','07:45','39.64848885020234,19.859268665313724',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1090,19,'ROUVAS APTS','ROUVAS RESTAURANT','07:45','39.64450697226194,19.855030775070194',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1091,20,'BUKARI','PORT','09:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1093,20,'AQUARIUS','BUS STOP','09:11','39.475446226502356,19.93454217910767',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1094,20,'EKO MORAITIKA','M.ROAD','09:10','39.483275998379966,19.92481112480164',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1095,20,'BELLA GRECIA','M.ROAD','09:10','39.48386806056607,19.924955964088443',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1097,20,'ATTIKA BEACH','RECEPTION','09:40','39.43825078138391,20.04559137272198',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1099,20,'BLUE DIAMOND','M.ROAD','09:40','39.42581786884768,19.948360919952396',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1100,20,'SANDY BEACH','HOTEL','09:30','39.432931774203574,19.942749206121853',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1103,20,'FARMAKEIO MORAITIKA','M.ROAD','09:10','39.485346123884874,19.924886226654056',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1104,20,'THEODOROS TAVERNA(GREEN BUS ST','M.ROAD','08:55','39.524584042307886,19.922842383384708',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1106,20,'BENITSES KIOSK','M.ROAD','08:50','39.54641191968671,19.91350293159485',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1107,20,'CORFU MARIS','MAIN ROAD','08:50','39.539523702594664,19.91701051735745',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1108,20,'APOLLO PALACE','M.GATE','09:11','39.47672933847517,19.932277748108117',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1109,20,'GEMINI','HOTEL','09:11','39.477213798962595,19.932808823067127',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1110,20,'MESSONGHI BEACH','TAXI STATION','09:15','39.47839853908093,19.92753088474274',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1111,20,'MARGARITA','TAXI STATION','09:15','39.486161736411326,19.92518663406372',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1113,20,'DELFINIA','BUS STOP','09:09','39.48815673815567,19.926028106491458',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1114,20,'MIRAMARE BEACH','M.ROAD','09:09','39.49098845557718,19.92708503027048',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1115,20,'CORFU VILLAGE','M.ROAD','09:05','39.50726445376603,19.923775220735312',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1116,20,'MARBELLA','M.ROAD','09:05','39.5089075713531,19.923614271212802',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1117,20,'CORFU SENSES=MARE MONTE','M.ROAD','09:00','39.51211919529205,19.923029374979276',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1118,20,'NERAIDA ONEIRO','M.ROAD','09:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1119,20,'PRIMASOL IONIAN SUN = REGENCY','M.ROAD','09:00','39.51641544136896,19.92407619953156',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1120,20,'BELVEDERE','M.ROAD BUS STOP','08:55','39.522121459255146,19.922691608293295',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1122,20,'POTAMAKI','MAIN ROAD','08:50','39.544173492177016,19.9144249430715',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1123,20,'AEOLOS BEACH','M.ROAD','08:45','39.56843504301148,19.909188943571444',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1124,22,'AG. GORDIOS','BUS STOP','07:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1125,19,'CORFU HOLIDAY','M.GATE','08:10','39.61792074301297,19.922158907685628',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1126,19,'DIVANI','M.ROAD','08:10','39.598789831639024,19.921656847000126',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1127,19,'MON REPO HTL','HOTEL','08:10','39.60999051393664,19.92757916450501',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1128,19,'CAVALIERI','HOTEL','08:10','39.62117698821121,19.923915266990665',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1129,22,'PELEKAS BEACH','RECEPTION','07:25','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1130,19,'KERKYRA GOLF','M.ROAD BUS STOP','07:50','39.63174376889772,19.882888161158256',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1131,19,'KONTOKALI BAY','M.GATE','07:45','39.648468197900044,19.859241843223575',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1132,19,'CORFU IMPERIAL','M.GATE','07:39','39.66719730132942,19.85939204692841',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1133,19,'SPITI PRIFTI','MAIN ROAD - OPPOSITE','07:42','39.647856886958635,19.846512079238895',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1134,19,'POPI STAR','SPITI PRIFTI','07:42','39.65110751214785,19.845337271690372',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1135,19,'MOLFETA','SPITI  PRIFTI','07:42','39.652627447088236,19.844189286231998',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1136,19,'DEBONO','DIELLAS','07:42','39.64834428395679,19.84360992908478',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1137,19,'CORKYRA BEACH','JET OIL','07:41','39.65493619736881,19.84035909175873',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1138,19,'PARADISE','JET OIL','07:41','39.65478338443808,19.840461015701297',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1139,19,'PARK HOTEL','M.ROAD','07:40','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1140,28,'GELLINA MARE','M.ROAD','07:00','39.79667099744096,19.82244729995728',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1141,22,'GLYFADA VILLA','M.GATE GLYFADA HTL','07:15','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1142,22,'GLYFADA BEACH H','BUS STOP','07:15','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1143,19,'NEFELI','M.GATE DAPHNILA','07:35','39.6649971,19.8481875',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1144,19,'DAPHNILA BAY','M.GATE','07:35','39.6663103,19.8483645',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1145,28,'GELLINA VILLAGE','M.GATE','06:59','39.79765605123094,19.823487997055057',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1146,28,'ACHARAVI BEACH','SALVANOS SUPER MARKET','07:00','39.79468023897436,19.820086956024173',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1147,28,'CENTURY RESORT','PUMP','07:00','39.79200107348475,19.816224575042725',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1148,19,'MAGNA GRECIA','BUS STOP','07:32','39.67473706830992,19.839318394660953',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1149,19,'LIVADI NAFSIKA','CORFU CHANDRIS','07:31','39.67744969663652,19.83915209770203',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1150,19,'DASSIA CHANDRIS','M.ROAD','07:31','39.679534673393285,19.838470816612244',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1151,19,'CORFU CHANDRIS','M.ROAD','07:31','39.68005074703087,19.838266968727115',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1152,28,'BLUE BAY APARTMENTS','PIXEL/FB TRAVEL','07:00','-',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1154,19,'ELEA BEACH','BUS STOP','07:29','39.685351632175994,19.83789682388306',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1155,22,'BLUE PRINCESS = ELLY BEACH','HOTEL','07:10','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1156,19,'NAUTILUS','M.ROAD','07:15','39.718613237793235,19.867224097251896',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1157,19,'BARBATI BAY','M.ROAD','07:15','39.71765593710137,19.86632823944092',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1158,28,'RODA BEACH','RECEPTION','07:10','39.79548856272341,19.778484108823505',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1159,28,'MIRABELL','HOTEL','07:11','39.79630417464208,19.77344334125519',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1160,19,'NISSAKI BEACH','HOTEL','07:05','39.73142823364359,19.920149445533756',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1161,19,'SUNSHINE','M.ROAD','07:05','39.7268075180835,19.905161261558536',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1163,28,'REBECCA VILLAGE','MAIN ROAD - BRIDGE','07:26','39.77928391896437,19.7198098897934',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1167,19,'HOSPITAL','TRAFFIC LIGHTS','07:45','39.64463657116461,19.850555609924577',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1168,29,'NAOS','OFFICE','09:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1169,22,'PALEO POLICE','MAIN ROAD','07:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1171,28,'KANAL D\'AMOUR','CORFIOT OFFICE','07:30','39.79449888337257,19.699473381042484',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1173,28,'SAXOPHONE BAR','MAIN ROAD','07:34','39.79456895263904,19.697697758674625',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1174,28,'CORFIOT OFFICE KANALI','OPPOSITE ANGELINA','07:33','39.794527735432105,19.699462652206424',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1175,32,'BELLE HELENE','MAIN ROAD','06:50','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1177,19,'ROYAL BOUTIQUE','MAIN ROAD','08:10','39.59263075106277,19.917343854904175',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1178,19,'KIOSK ANALIPSI','KIOSK','07:21','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1181,22,'ERMONES BRIDGE','BRIDGE','07:05','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1182,28,'POLYXENI','MAIN ROAD','07:30','39.79224014172259,19.692907333374027',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1183,32,'ALKYON HOTEL','MAIN ROAD','06:50','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1184,32,'DIKTIA AG. GEORGIOS','MAIN ROAD','06:50','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1185,28,'KASSIOPI PUMP','PUMP','06:40','39.78881891367194,19.920648336410526',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1187,22,'ARIS SUPERMARKET','MAIN ROAD','07:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1188,20,'CORFU LIDO SUN','MAIN ROAD','08:55','39.52527919802662,19.922729730606083',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1189,28,'DAMIA HOTEL','MAIN ROAD','07:36','39.78616425323624,19.687773585319523',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1192,29,'MEDITERRANEAN BLUE','HOTEL','09:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1193,19,'ATLANTIS','MAIN ROAD','07:55','39.62563123896577,19.911378622055057',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1194,28,'AK NEW OFFICE','M.ROAD','07:32','-',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1195,28,'SUNSHINE(MELITSA)','MAIN ROAD','07:30','39.793431199479755,19.694452075132336',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1196,19,'SAN ANTONIO = ADONIS KALAMI','MAIN ROAD','06:45','39.744533703146224,19.93407011032105',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1197,20,'PANTHEON','MAIN ROAD','09:11','39.47756575532039,19.933077165266027',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1199,22,'MOUCHAS CORNER','M. ROAD','07:25','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1200,20,'VERYCOCO','MAIN ROAD','09:10','39.48048899459971,19.924998065451316',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1201,22,'GRAND HOTEL GLYFADA','MAIN GATE','07:15','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1202,32,'ASPA S/M','MAIN ROAD','07:05','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1203,22,'LIAPADES CEMETARY','MAIN ROAD','07:10','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1204,28,'GOUDELIS','MAIN ROAD','07:40','39.77446438959849,19.71227288246155',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1205,32,'ARILLAS ARKOKAL','MAIN ROAD','07:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1206,28,'ABC SWEETHOME','MAIN ROAD','07:30','39.78624257542984,19.723709821701053',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1207,28,'CHRISMOS HOTEL','MAIN ROAD - BUS STOP','06:45','39.79626295847498,19.88533437252045',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1208,32,'AGG PAGI DIKTIA','MAIN ROAD','06:50','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1209,28,'MUSEUM ACHARAVI','MAIN ROAD','07:00','39.78895488559324,19.809404685451305',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1211,32,'DIONYSSOS','MAIN ROAD','07:00','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1212,32,'GOLDEN BEACH','MAIN ROAD','06:50','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1213,29,'ISLAND BEACH','MAIN ROAD','09:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1214,28,'APRAOS HOTEL','MAIN ROAD','06:40','39.79679052354835,19.890452027320865',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1215,19,'SOFIA VRADI OFFICE IPSOS','MAIN ROAD','07:20','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1217,20,'AURORA','MAIN ROAD','09:01','39.516034713132704,19.924140572547913',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1218,19,'ARTION','BUS STOP','07:31','39.685070910145186,19.83765006065369',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1219,20,'DIMITRA SUPERMARKET LEFKIMMI','MAIN ROAD','09:40','39.4222046305038,20.044686350870037',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1220,28,'SIDARI LEGENDS','MAIN ROAD','07:28','39.787053040997776,19.708331372045382',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1221,19,'CLUB MEDITERANEE','MAIN ROAD','07:20','39.692010189255555,19.837977290153507',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1223,19,'DALIA HOTEL','MAIN ROAD','08:20','39.612060995152845,19.917107820510868',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1224,22,'LIAPADES BUS STOP','BUS STOP','07:10','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1225,28,'PALMAR HOTEL','MAIN ROAD','07:30','39.79367453370144,19.694929718971256',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1226,32,'BARRAS HOTEL','MAIN ROAD','07:10','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1227,29,'KAVOS TAXI STATION','MAIN ROAD','09:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1228,28,'HN TRAVEL RODA','OFFICE','07:08','39.78863707050628,19.788267786973577',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1230,20,'ST.STEFANO - CROSSROAD','CROSSROAD','08:45','39.55466333210965,19.912118262726246',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1231,20,'MUSES SEA VEIW','MAIN ROAD','08:50','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1232,19,'GLYFA TAVERNA','MAIN ROAD','07:10','39.72383689454385,19.88359093666077',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1233,28,'BLUE LAGOON HOTEL RODA','MAIN ROAD','07:05','39.78685408874083,19.791799763391236',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1234,28,'DIELLAS ACHARAVI','MAIN ROAD','07:00','39.79442998791759,19.819711453374',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1235,19,'DASSIA CHANDRIS, NSK OFFICE','MAIN ROAD,PHARMACY','07:31','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1242,20,'PERAMA HOTEL','OASIS','08:40','39.57939255851618,19.913115537456648',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1243,20,'BENITSES PORT','MAIN ROAD','08:50','39.54705466812339,19.913023366800815',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1244,31,'CORFU TOWN NEW PORT','-','08:30','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1245,20,'STADIUM','MAIN ROAD','08:50','39.540591030597014,19.91588963297326',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1246,19,'AKTAION','MAIN ROAD','08:10','39.6219414208258,19.925165176391605',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1254,32,'SAN GEORGE PALACE HOTEL','COSTAS RENT A CAR','06:50','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1255,19,'KONSTANTINOYPOLIS','MAIN ROAD','08:10','39.626647660462154,19.92054104804993',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1559,20,'3K S/M MESSONGHI','M.ROAD','09:11','39.47547107117025,19.93453681468964',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1565,20,'CORFU CRUISES OLD BENITSES OFFICE','MAIN ROAD','08:50','39.54136100654675,19.914790391922',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1566,28,'SHELL PETROL STATION','MAIN ROAD','06:58','39.79755301279228,19.827296733856205',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1567,28,'PIZZA VENEZIA','MAIN ROAD','07:27','39.785912797169985,19.708131551742554',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1568,28,'JOANNAS','MAIN ROAD','07:35','39.79012147356631,19.68983352184296',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1569,28,'CHRISTINAS','MAIN ROAD','07:39','-',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1574,28,'ESCAPE BAR','MAIN ROAD','07:30','39.79475030805611,19.701485037803653',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1575,28,'BLUE SKY','MAIN ROAD','07:30','39.79185268588472,19.706956744194034',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1576,28,'SAN GEORGE SIDARI','MAIN ROAD','07:30','-',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1577,29,'LEFKIMMI HOTEL','MAIN ROAD','09:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1578,20,'OSCAR BENITSES OFFICE','MAIN ROAD','08:50','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1591,29,'ALEXANDRA','MAIN ROAD','09:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1592,29,'TEX MEX','MAIN ROAD','09:45','',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1598,19,'KALYPSO CAFE IPSOS','MAIN ROAD','07:20','39.701288,19.840292',1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(1601,19,'SUNSET HOTEL ALYKES','M.ROAD OPPOSITE','07:53','39.63349377753193,19.879555005313843',1,'e7e014fd-5608-4936-866e-ec11fc8c16da');
/*!40000 ALTER TABLE `pickuppoints` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ports`
--

DROP TABLE IF EXISTS `ports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ports` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `IsActive` tinyint NOT NULL,
  `UserId` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `FK_Ports_AspNetUsers_Id` (`UserId`),
  CONSTRAINT `FK_Ports_AspNetUsers_Id` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ports`
--

LOCK TABLES `ports` WRITE;
/*!40000 ALTER TABLE `ports` DISABLE KEYS */;
INSERT INTO `ports` VALUES (1,'',0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(2,'CORFU PORT',1,'b747c76a-7612-4892-9672-b81ade1823d0'),(8,'LEFKIMMI PORT',1,'b747c76a-7612-4892-9672-b81ade1823d0');
/*!40000 ALTER TABLE `ports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `routes`
--

DROP TABLE IF EXISTS `routes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `routes` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Abbreviation` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Description` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `PortId` int NOT NULL,
  `IsActive` tinyint NOT NULL,
  `UserId` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `FK_Routes_AspNetUsers_Id` (`UserId`),
  KEY `FK_Routes_Port_Id` (`PortId`),
  CONSTRAINT `FK_Routes_AspNetUsers_Id` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_Routes_Port_Id` FOREIGN KEY (`PortId`) REFERENCES `ports` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `routes`
--

LOCK TABLES `routes` WRITE;
/*!40000 ALTER TABLE `routes` DISABLE KEYS */;
INSERT INTO `routes` VALUES (19,'NISAKI','NISAKI - KALAMI - BARBATI - DASIA - GOUVIA - CORFU PORT',1,1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(20,'SOUTH','TOWN - ΠΕΡΑΜΑ - ΜΕΣΣΟΓΓΗ - ΛΕΥΚΙΜΜΗ',2,1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(22,'WEST','PALEO - ERMONES - GLYFADA - PELEKA - AG.GORDIS - CORFU PORT',1,1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(28,'ACH-SID','ACHARAVI - RODA - SIDARI - CORFU PORT',1,1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(29,'KAVOS','KAVOS',2,1,'b747c76a-7612-4892-9672-b81ade1823d0'),(31,'L.P.-C.P.','NO TRANSFER',1,1,'b747c76a-7612-4892-9672-b81ade1823d0'),(32,'PAGOI','AG.STEFANOS - ARILLAS - PAGOI - CORFU PORT',1,1,'e7e014fd-5608-4936-866e-ec11fc8c16da');
/*!40000 ALTER TABLE `routes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `schedules`
--

DROP TABLE IF EXISTS `schedules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `schedules` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `DestinationId` int NOT NULL,
  `PortId` int NOT NULL,
  `Date` date NOT NULL,
  `MaxPersons` int NOT NULL,
  `IsActive` tinyint NOT NULL,
  `UserId` varchar(128) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `FK_Schedules_AspNetUsers_Id` (`UserId`),
  KEY `FK_Schedules_Ports_Id` (`PortId`),
  KEY `FK_Schedules_Destinations_Id` (`DestinationId`),
  CONSTRAINT `FK_Schedules_AspNetUsers_Id` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_Schedules_Destinations_Id` FOREIGN KEY (`DestinationId`) REFERENCES `destinations` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_Schedules_Ports_Id` FOREIGN KEY (`PortId`) REFERENCES `ports` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
INSERT INTO `schedules` VALUES (32,2,8,'2021-03-11',250,1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(75,2,8,'2021-04-05',55,1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(91,2,8,'2021-05-02',99,1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(92,2,8,'2021-05-09',99,1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(93,2,8,'2021-05-16',99,1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(94,2,8,'2021-05-23',99,1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(95,2,8,'2021-05-30',99,1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(96,3,2,'2021-05-03',200,1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(97,3,2,'2021-05-10',200,1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(98,3,2,'2021-05-05',200,1,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(99,3,2,'2021-05-07',200,1,'e7e014fd-5608-4936-866e-ec11fc8c16da');
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ships`
--

DROP TABLE IF EXISTS `ships`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ships` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Description` varchar(128) NOT NULL,
  `IMO` varchar(128) NOT NULL,
  `Flag` varchar(128) NOT NULL,
  `RegistryNo` varchar(128) NOT NULL,
  `MaxPersons` int NOT NULL,
  `IsActive` tinyint NOT NULL,
  `UserId` varchar(128) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Id_UNIQUE` (`Id`),
  KEY `FK_Ships_AspNetUsers_Id` (`UserId`),
  CONSTRAINT `FK_Ships_AspNetUsers_Id` FOREIGN KEY (`UserId`) REFERENCES `aspnetusers` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ships`
--

LOCK TABLES `ships` WRITE;
/*!40000 ALTER TABLE `ships` DISABLE KEYS */;
INSERT INTO `ships` VALUES (1,' ','','','',0,0,'e7e014fd-5608-4936-866e-ec11fc8c16da'),(3,'CAPTAIN BILL','-','ΕΛΛΗΝΙΚΗ','-',230,1,'e7e014fd-5608-4936-866e-ec11fc8c16da');
/*!40000 ALTER TABLE `ships` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tokens` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `ClientId` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CreatedDate` datetime(6) NOT NULL,
  `UserId` varchar(450) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `LastModifiedDate` datetime(6) NOT NULL,
  `ExpiryTime` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=17401 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens`
--

LOCK TABLES `tokens` WRITE;
/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;
INSERT INTO `tokens` VALUES (11396,'ujZZ55qcTE-1I3ObqGa5Qg','51743b510b6a413dae84c93f21865ddf','2020-05-11 05:56:10.865424','830796dc-cee0-4f08-9b11-283bdd3aaa98','0001-01-01 00:00:00.000000','2020-05-11 07:26:10.865424'),(11721,'ujZZ55qcTE-1I3ObqGa5Qg','b2b46b2034bf43f38eeb01822c134320','2020-05-27 05:25:21.924113','c7c0fbe5-7e34-4336-8ca0-3a565bf8e36b','0001-01-01 00:00:00.000000','2020-05-27 06:55:21.924188'),(14655,'2623706f-198b-4a7f-877f-ea86f3013831','fbb51b827c6b4a37af19b54e5010d9ce','2021-01-05 04:05:09.704626','0c80f04c-7109-4b2b-b87e-6a7b18107f93','0001-01-01 00:00:00.000000','2021-01-05 05:35:09.704627'),(14657,'2623706f-198b-4a7f-877f-ea86f3013831','22fca91efc1f4d03a9600097d0ae9104','2021-01-05 04:10:45.349282','4a154b2b-b773-4637-87b9-3dc8f284837c','0001-01-01 00:00:00.000000','2021-01-05 05:40:45.349285'),(16843,'2623706f-198b-4a7f-877f-ea86f3013831','37a21a3bfb994cd2bd0cd921223f36b0','2021-02-24 05:15:34.464818','b747c76a-7612-4892-9672-b81ade1823d0','0001-01-01 00:00:00.000000','2021-02-24 06:45:34.464820'),(16966,'2623706f-198b-4a7f-877f-ea86f3013831','84ecd17b37d747c3a5012f08fe23b0f7','2021-03-04 10:08:31.435403','b642cebf-d980-4f52-83bf-bc03ce410a77','0001-01-01 00:00:00.000000','2021-03-04 11:38:31.435405'),(17400,'2623706f-198b-4a7f-877f-ea86f3013831','0a8a860a8d4c4499a9db829e2d8d9f34','2021-03-12 05:26:18.066680','e7e014fd-5608-4936-866e-ec11fc8c16da','0001-01-01 00:00:00.000000','2021-03-12 06:56:18.066682');
/*!40000 ALTER TABLE `tokens` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-03-12  7:30:04
