<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>
<?php
$host = "localhost";
$user = "root";
$password = "";
//connecting to server
$connection = mysql_connect($host,$user,$password);
//check connection
if (! $connection)
{
	die('could not connect' . mysql_error());
};

mysql_select_db("flashcards", $connection);

$query = "SELECT * FROM basiccards";

$flashcards_data = mysql_query($query);

while($row = mysqli_fetch_array($flashcards_data, MYSQL_ASSOC))
{
	$front = $row['front'];
	$back = $row['back'];
	echo "
	<div>
		front: $front<br/>
		back: $back
	</div>
	";
}
mysql_close($connection);
?>
</body>
</html>