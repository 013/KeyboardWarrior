<?php
try {
	$db = new PDO('mysql:host=localhost;dbname=words', 'username', 'password');
} catch (PDOException $exception) {
	die();
}

$st = $db->prepare('INSERT INTO words (word, length) VALUES (:word, :length)');
$st->bindParam(':word', $word);
$st->bindParam(':length', $length);

$file = './words.txt';
$lines = file($file);
foreach($lines as $line) {
	//echo strlen($line) . "  " . $line;
	$word = trim($line);
	$length = strlen($line);
	$st->execute();
} 

?>

