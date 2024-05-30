-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 20, 2023 at 12:43 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `login-system`
--

-- --------------------------------------------------------

--
-- Table structure for table `breakfast`
--

CREATE TABLE `breakfast` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` int(100) NOT NULL,
  `img` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `breakfast`
--

INSERT INTO `breakfast` (`id`, `name`, `description`, `price`, `img`) VALUES
(1, 'Egg Breakfast', 'Start your day with a protein-packed delight – our signature egg breakfast offers a perfect harmony of fluffy scrambled eggs, crispy bacon, and a medley of fresh vegetables, ensuring a hearty and energizing morning.', 3, 'images/breakfast.png'),
(2, 'Cappuccino Coffee', 'Indulge in the velvety richness of our expertly crafted cappuccino, where the bold intensity of premium espresso meets the frothy elegance of steamed milk, creating a sophisticated coffee experience to awaken your senses.', 2, 'images/coffee.png'),
(3, 'Green Tea', 'Immerse yourself in tranquility with our soothing green tea, a delicate blend of aromatic leaves offering a refreshing and antioxidant-rich sip, perfect for a mindful and health-conscious start to your day.', 1, 'images/tea.png'),
(4, 'Honey & Pancakes', 'Delight in the perfect pairing of fluffy pancakes drizzled with golden honey, creating a symphony of sweetness and warmth that transforms a classic breakfast into a decadent and comforting culinary experience.', 3, 'images/pancakes.png');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` int(100) NOT NULL,
  `img` varchar(255) NOT NULL,
  `rating` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `img`, `rating`) VALUES
(1, 'Steak', 'Indulge in the extraordinary tenderness of expertly grilled beef, seasoned with a symphony of spices, promising a succulent and flavorful dining experience.', 3, 'images/steak2.png', 4),
(2, 'Spaghetti', 'Twirl your fork into a world of delight with our perfectly cooked pasta, generously coated in a rich and savory tomato sauce, creating a classic and comforting Italian masterpiece.', 2, 'images/spaghetti.png', 3),
(3, 'Salad', 'Elevate your senses with a refreshing ensemble of crisp greens, vibrant vegetables, and mouthwatering dressings, offering a burst of colors and flavors in every wholesome bite.', 2, 'images/salad.png', 4),
(4, 'Pasta', 'Immerse yourself in the exquisite world of al dente pasta, artfully paired with an array of delectable sauces and toppings, crafting a symphony of tastes that dance on your palate.', 3, 'images/pasta2.png', 5),
(5, 'French Fries', 'Savor the golden perfection of our crispy French fries, expertly seasoned and served as the ideal crunchy companion or standalone delight for the ultimate snacking experience.', 1, 'images/fries.png', 4),
(6, 'Crispy Burger', 'Delight in the satisfying contrast of juicy burger patties encased in a golden, crispy exterior, providing a textural symphony that takes the classic burger experience to new heights.', 3, 'images/burger.png', 4),
(7, 'Shawarma', 'Embark on a culinary journey with our meticulously crafted shawarma, featuring layers of perfectly seasoned meat, slow-cooked to perfection, and embraced by a warm, fluffy flatbread for an authentic and savory taste adventure.', 2, 'images/shawarma.png', 5);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `gender` varchar(100) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `gender`, `username`, `email`, `password`) VALUES
(1, 'John', 'male', 'test', 'example@email.com', '$2a$08$Nhy7YjFm8OVM9MuMtDdtxu1xjcc74bNLroIzT5BckJtXQj9xWmzve');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `breakfast`
--
ALTER TABLE `breakfast`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `breakfast`
--
ALTER TABLE `breakfast`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
