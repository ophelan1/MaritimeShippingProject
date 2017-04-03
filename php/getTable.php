#!/usr/bin/env php
<?php
//Step1
 $db = mysqli_connect("127.0.0.1","root","#Owenaug02","testData")
 or die('Error connecting to MySQL server.');
?>

<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>D3: Demo of linear easing</title>
		<script type="text/javascript" src="../d3/d3.js"></script>
		<style type="text/css">
			/* No style rules here yet */		
		</style>
	</head>
	<body>

	<?php
//Step2
$query = "SELECT * FROM rawData";
mysqli_query($db, $query) or die('Error querying database.');


$result = mysqli_query($db, $query);
$row = mysqli_fetch_array($result);

while ($row = mysqli_fetch_array($result)) {
 echo $row['route_ID'] . ' ' . $row['year'] . ' ' . $row['start_port'] . ' ' . $row['start_port_country'] .' ' . $row['end_port'] .' ' . $row['end_port_country'] .' ' . $row['ships_per_yr'] .'<br />';
}
?>
		<p>hello there</p>

	</body>
</html>