-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 09, 2022 at 01:36 AM
-- Server version: 5.7.24
-- PHP Version: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `test2`
--

-- --------------------------------------------------------

--
-- Table structure for table `markers`
--

CREATE TABLE `markers` (
  `path` int(1) NOT NULL,
  `address` varchar(255) NOT NULL,
  `spot` int(64) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `markers`
--

INSERT INTO `markers` (`path`, `address`, `spot`) VALUES
(1, '2835 60th Ave SE, Mercer Island, WA 98040', 1),
(1, 'Island Crest Way & 68th Street, Mercer Island, WA 98040', 2),
(1, '7740 SE 58th St, Mercer Island, WA 98040', 3),
(1, 'E Mercer Way and SE 76th St, Mercer Island, WA 98040', 4),
(1, '2750 77th Ave SE, Mercer Island, WA 98040', 5),
(1, '2040 84th Ave SE, Mercer Island, WA 98040', 6),
(1, '2448 76th Ave SE #108, Mercer Island, WA 98040', 7),
(1, '2707 76th Ave SE, Mercer Island, WA 98040', 8);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
