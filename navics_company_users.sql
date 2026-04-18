-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 18, 2026 at 09:15 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `navics_ai_company`
--

-- --------------------------------------------------------

--
-- Table structure for table `navics_company_users`
--

CREATE TABLE `navics_company_users` (
  `id` int(10) UNSIGNED NOT NULL,
  `company_id` int(10) UNSIGNED NOT NULL,
  `employee_id` varchar(250) NOT NULL,
  `user_name` varchar(250) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `role` varchar(100) NOT NULL,
  `company_role` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `details` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` varchar(255) DEFAULT NULL,
  `updated_at` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `navics_company_users`
--

INSERT INTO `navics_company_users` (`id`, `company_id`, `employee_id`, `user_name`, `email`, `mobile`, `role`, `company_role`, `password`, `details`, `status`, `created_at`, `updated_at`) VALUES
(1, 18, 'RAMO123', 'Raj Singh Kapoor', 'raj@kapoor.com', '6666666666', 'company', 'Sales', '$2b$10$s/MOTsyl7Nu5sORQTIFZeON1uuQG9OpHKm2FrBkqOxOmIuPCYHri2', 'raj@kapoor.com', 'active', '2026-04-11 16:28:14', NULL),
(2, 15, 'EMP001', 'Rahul Sharma', 'rahul@test.com', '9876543210', 'company', 'Sales', '$2b$10$e9qL9WkO9ti9dkY7NgxJseP5ZpN.B0Diudm218jVQ9S6TdoWYs1I6', 'Navics Admin User', 'active', '2026-04-13 20:43:14', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `navics_company_users`
--
ALTER TABLE `navics_company_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `mobile` (`mobile`),
  ADD KEY `fk_company` (`company_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `navics_company_users`
--
ALTER TABLE `navics_company_users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `navics_company_users`
--
ALTER TABLE `navics_company_users`
  ADD CONSTRAINT `fk_company` FOREIGN KEY (`company_id`) REFERENCES `navics_client_company` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
