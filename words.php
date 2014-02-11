<?php
$difficulty = ((int) $_GET['difficulty']) * 5;
try {
	$db = new PDO('mysql:host=localhost;dbname=words', 'username', 'password');
} catch (PDOException $exception) {
	die();
}

$st = $db->query('SELECT count(*) FROM words;');
$row = $st->fetch(PDO::FETCH_NUM);
$num_of_words = $row[0];
$ids = array();

for ($i=0;$i<50;$i++) {
	array_push($ids, mt_rand(0, $num_of_words));
}
$id = implode(',', $ids);
$query = "SELECT word FROM words WHERE id IN ($id) AND length <= :difficulty LIMIT 10";
$st = $db->prepare($query);
$st->bindParam(':difficulty', $difficulty, PDO::PARAM_INT);
$st->execute();

$words = array();
while ($row = $st->fetch(PDO::FETCH_ASSOC)) {
	array_push($words, $row["word"]);
}
echo json_encode($words);

?>
