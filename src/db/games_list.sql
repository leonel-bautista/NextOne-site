-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 12-10-2024 a las 06:15:29
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `games_list`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `developers`
--

CREATE TABLE `developers` (
  `developer_id` int(11) NOT NULL,
  `developer_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `developers`
--

INSERT INTO `developers` (`developer_id`, `developer_name`) VALUES
(1, 'Team17'),
(2, 'Valve'),
(3, 'Mediatonic'),
(4, 'Codemasters'),
(5, 'Psyonix'),
(6, 'Saber Interactive');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `games`
--

CREATE TABLE `games` (
  `game_id` int(11) NOT NULL,
  `image` varchar(100) DEFAULT NULL,
  `game_name` varchar(100) NOT NULL,
  `launch_date` date DEFAULT NULL,
  `developer_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `games`
--

INSERT INTO `games` (`game_id`, `image`, `game_name`, `launch_date`, `developer_id`) VALUES
(1, 'imagen1', 'Counter-Strike 2', '2023-09-27', 2),
(2, 'imagen2', 'Rocket League', '2015-07-07', 5),
(3, 'imagen3', 'World War: Z', '2019-04-16', 6),
(4, 'imagen4', 'Fall Guys', '2020-08-04', 3),
(5, 'imagen5', 'Worms W.M.D.', '2016-08-23', 1),
(6, 'imagen6', 'F1 24', '2024-05-28', 4),
(7, 'imagen7', 'los globos', '3082-02-28', 4),
(9, 'a', 'aa', '1111-11-11', 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `games_platforms`
--

CREATE TABLE `games_platforms` (
  `game_platforms_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `platform_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `games_platforms`
--

INSERT INTO `games_platforms` (`game_platforms_id`, `game_id`, `platform_id`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 2, 3),
(4, 3, 1),
(5, 3, 2),
(6, 3, 7),
(7, 4, 2),
(8, 5, 1),
(9, 5, 4),
(10, 5, 5),
(11, 6, 5),
(12, 6, 7),
(13, 7, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `games_tags`
--

CREATE TABLE `games_tags` (
  `game_tags_id` int(11) NOT NULL,
  `game_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `games_tags`
--

INSERT INTO `games_tags` (`game_tags_id`, `game_id`, `tag_id`) VALUES
(1, 1, 1),
(2, 1, 4),
(3, 2, 2),
(4, 2, 7),
(5, 3, 3),
(6, 3, 5),
(7, 4, 4),
(8, 5, 2),
(9, 5, 6),
(10, 6, 7),
(11, 7, 1),
(12, 7, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `platforms`
--

CREATE TABLE `platforms` (
  `platform_id` int(11) NOT NULL,
  `platform_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `platforms`
--

INSERT INTO `platforms` (`platform_id`, `platform_name`) VALUES
(1, 'Steam'),
(2, 'EpicGames'),
(3, 'Xbox'),
(4, 'GOG.com'),
(5, 'Battle.net'),
(6, 'Ubisoft Connect'),
(7, 'EA app');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tags`
--

CREATE TABLE `tags` (
  `tag_id` int(11) NOT NULL,
  `tag_name` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `tags`
--

INSERT INTO `tags` (`tag_id`, `tag_name`) VALUES
(1, 'Disparos'),
(2, 'Multijugador'),
(3, 'Zombies'),
(4, 'Free to Play'),
(5, 'Acción'),
(6, 'Estrategia'),
(7, 'Deportes');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `developers`
--
ALTER TABLE `developers`
  ADD PRIMARY KEY (`developer_id`);

--
-- Indices de la tabla `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`game_id`),
  ADD KEY `fk_developer_idx` (`developer_id`);

--
-- Indices de la tabla `games_platforms`
--
ALTER TABLE `games_platforms`
  ADD PRIMARY KEY (`game_platforms_id`),
  ADD KEY `fk_game_idx` (`game_id`),
  ADD KEY `fk_platform_idx` (`platform_id`);

--
-- Indices de la tabla `games_tags`
--
ALTER TABLE `games_tags`
  ADD PRIMARY KEY (`game_tags_id`),
  ADD KEY `fk_game_idx` (`game_id`),
  ADD KEY `fk_tag_idx` (`tag_id`);

--
-- Indices de la tabla `platforms`
--
ALTER TABLE `platforms`
  ADD PRIMARY KEY (`platform_id`);

--
-- Indices de la tabla `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`tag_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `developers`
--
ALTER TABLE `developers`
  MODIFY `developer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `games`
--
ALTER TABLE `games`
  MODIFY `game_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `games_platforms`
--
ALTER TABLE `games_platforms`
  MODIFY `game_platforms_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `games_tags`
--
ALTER TABLE `games_tags`
  MODIFY `game_tags_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `platforms`
--
ALTER TABLE `platforms`
  MODIFY `platform_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `tags`
--
ALTER TABLE `tags`
  MODIFY `tag_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `games`
--
ALTER TABLE `games`
  ADD CONSTRAINT `fk_developer` FOREIGN KEY (`developer_id`) REFERENCES `developers` (`developer_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `games_platforms`
--
ALTER TABLE `games_platforms`
  ADD CONSTRAINT `fk_gp_game` FOREIGN KEY (`game_id`) REFERENCES `games` (`game_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_gp_platform` FOREIGN KEY (`platform_id`) REFERENCES `platforms` (`platform_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `games_tags`
--
ALTER TABLE `games_tags`
  ADD CONSTRAINT `fk_gt_game` FOREIGN KEY (`game_id`) REFERENCES `games` (`game_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_gt_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`tag_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
