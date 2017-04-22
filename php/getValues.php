<?php
	#!/usr/bin/env php 
    $username = "root"; 
    $password = "#Owenaug02";   
    $host = "localhost";
    $database="maritimeData";
    
    $connection = mysqli_connect($host, $username, $password, $database);
    // Check connection
    if (mysqli_connect_errno()){
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }


    /*$sql = "SELECT COUNT(*) FROM 2006tmp g1 INNER JOIN 2006tmp g2 ON g2.id = g1.id + 1 WHERE g1.`MOVE SEQUENCE` = g2.`MOVE SEQUENCE`-1;";
    $sql.= "SELECT COUNT(*) FROM 2009tmp g1 INNER JOIN 2009tmp g2 ON g2.id = g1.id + 1 WHERE g1.`MOVE SEQUENCE` = g2.`MOVE SEQUENCE`-1;";
    $sql.= "SELECT COUNT(*) FROM 2012tmp g1 INNER JOIN 2012tmp g2 ON g2.id = g1.id + 1 WHERE g1.`MOVE SEQUENCE` = g2.`MOVE SEQUENCE`-1;";*/

    $sql = "SELECT COUNT(*) FROM 2006tmp g1 INNER JOIN 2006tmp g2 ON g2.id = g1.id + 1 WHERE g1.`MOVE SEQUENCE` = g2.`MOVE SEQUENCE`-1 UNION
    	SELECT COUNT(*) FROM 2009tmp g1 INNER JOIN 2009tmp g2 ON g2.id = g1.id + 1 WHERE g1.`MOVE SEQUENCE` = g2.`MOVE SEQUENCE`-1 UNION
   	SELECT COUNT(*) FROM 2012tmp g1 INNER JOIN 2012tmp g2 ON g2.id = g1.id + 1 WHERE g1.`MOVE SEQUENCE` = g2.`MOVE SEQUENCE`-1;";
	// Execute multi query
	if (mysqli_multi_query($connection,$sql)){
		printf("[");
		$year = 2006;
	  	do{
	    	// Store first result set
	    	if ($result=mysqli_store_result($connection)) {
	      	// Fetch one and one row
	      	while ($row=mysqli_fetch_row($result)){
		  			printf("{\"year\":%d,\"frequency\":%s}", $year, $row[0]);
		  			$year = $year + 3;
		  			if($year <= 2012){
		  				printf(",");
		  			}
	      	}
	      	// Free result set
	      	mysqli_free_result($result);
	      	}

	    }while (mysqli_next_result($connection));
	    printf("]");
	}

    mysqli_close($connection);
?>
