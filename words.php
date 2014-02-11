<?php
//http://stackoverflow.com/questions/4329396/mysql-select-10-random-rows-from-600k-rows-fast
$difficulty = htmlentities($_GET['difficulty']);
$wordcount = (int) $_GET['wordcount'];

//$sql = "SELECT word FROM words WHERE"
/*
switch ($difficulty) {
	case 'easy':
		$sql .= "length < 10";
		break;
	case 'medium':
		$sql .= "length < 15";
		break;
	case 'hard':
		$sql .= "length < 20";
		break;
	default:
		break;
}*/

$sql = "
SELECT word
	FROM random AS r1 JOIN
		(SELECT (RAND() *
			(SELECT MAX(id)
			FROM random)) AS id)
		AS r2
	WHERE r1.id >= r2.id
	ORDER BY r1.id ASC
	LIMIT 10";

$words = array("One", "Two", "Three", "Four", "Five");

echo json_encode($words);

?>
