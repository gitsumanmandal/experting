-- phpMyAdmin SQL Dump
-- version 3.3.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jun 19, 2018 at 06:57 PM
-- Server version: 5.1.53
-- PHP Version: 5.3.4

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `experting`
--

-- --------------------------------------------------------

--
-- Table structure for table `learned`
--

CREATE TABLE IF NOT EXISTS `learned` (
  `ID` int(100) NOT NULL AUTO_INCREMENT,
  `USERID` varchar(100) NOT NULL,
  `SET1` longtext NOT NULL,
  `SET2` longtext NOT NULL,
  `SET3` longtext NOT NULL,
  `SET4` longtext NOT NULL,
  `SET5` longtext NOT NULL,
  `SET6` longtext NOT NULL,
  `SET7` longtext NOT NULL,
  `SET8` longtext NOT NULL,
  PRIMARY KEY (`ID`)
);

--
-- Table structure for table `service`
--

CREATE TABLE IF NOT EXISTS `service` (
  `ID` int(100) NOT NULL AUTO_INCREMENT,
  `USERID` varchar(255) NOT NULL,
  `DESCRIPTION` varchar(255) NOT NULL,
  `STATUS` varchar(255) NOT NULL,
  PRIMARY KEY (`ID`)
);

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `ID` int(100) NOT NULL AUTO_INCREMENT,
  `USERID` varchar(100) NOT NULL,
  `PASSWORD` varchar(100) NOT NULL,
  `EMAIL` varchar(100) NOT NULL,
  `NAME` varchar(100) NOT NULL,
  `PHONE` varchar(100) NOT NULL,
  `SESSIONID` varchar(1000) NOT NULL,
  PRIMARY KEY (`ID`)
);

--
-- Table structure for table `wordbase`
--

CREATE TABLE IF NOT EXISTS `wordbase` (
  `ID` int(255) NOT NULL AUTO_INCREMENT,
  `WORD` longtext NOT NULL,
  `PART` longtext NOT NULL,
  `MEAN1` longtext NOT NULL,
  `MEAN2` longtext NOT NULL,
  `MEAN3` longtext NOT NULL,
  `MEAN4` longtext NOT NULL,
  `MEAN5` longtext NOT NULL,
  `MEAN6` longtext NOT NULL,
  `MEAN7` longtext NOT NULL,
  `MEAN8` longtext NOT NULL,
  `MEAN9` longtext NOT NULL,
  `MEAN10` longtext NOT NULL,
  PRIMARY KEY (`ID`)
);