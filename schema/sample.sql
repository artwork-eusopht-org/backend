-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Mar 05, 2024 at 08:21 AM
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
-- Database: `sample`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` text NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES
(1, 'nabeel', 'nabeeleusopht@yopmail.com', 'nabeeleusopht'),
(2, 'nabeel 1', 'nabeel1@yopmail.com', '$2b$10$hgcM/pzbT.NWSgYjPa2BOetFtA7kLO0J1kuqMFKiX2ASztk.sq2Y6'),
(3, 'nabeel 1', 'nabeel1@yopmail.com', '$2b$10$CdW1sOyw5PxCWGEPQDKH5uDiOwTkK89YJWJF32QU6khpL9kknPT9u'),
(4, 'nabeel 1', 'nabeel1@yopmail.com', '$2b$10$Prni9ew/nhMpdy6hUdWwreTjwjNcQU48mj4yZGa1R7HYGDWhgKOFu'),
(5, 'nabeel 1', 'nabeel1@yopmail.com', '$2b$10$dOXfxm7OnqxLLBYDAxY9oe/YSrAKoE0PO5bL3hvgIxtHF504i3.Sm');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
