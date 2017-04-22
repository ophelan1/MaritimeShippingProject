#!/usr/bin/env php 
<?php
    $username = "root"; 
    $password = "#Owenaug02";   
    $host = "localhost";
    $database="maritimeData";
    
    $connection = mysqli_connect($host, $username, $password, $database);
    // Check connection
    if (mysqli_connect_errno()){
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }


    $sql = "DROP TABLE IF EXISTS 2006tmp;";
    $sql.= "CREATE TABLE 2006tmp AS SELECT `MOVE SEQUENCE`, `PLACE ID` FROM 2012moves_raw WHERE `PLACE ID`=2503 OR `PLACE ID`=7598;";
    $sql.= "ALTER TABLE 2006tmp ADD id INT PRIMARY KEY AUTO_INCREMENT;";

    // Execute multi query
    if (mysqli_multi_query($connection,$sql)){
        do{
            // Store first result set
            if ($result=mysqli_store_result($connection)) {
                // Free result set
                mysqli_free_result($result);
            }
        }while (mysqli_next_result($connection));
    }

    mysqli_close($connection);
?>