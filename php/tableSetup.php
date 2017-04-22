<?php
    //#!/usr/bin/env php 
    $username = "root"; 
    $password = "#Owenaug02";   
    $host = "localhost";
    $database="maritimeData";

    $id1 = $_POST['routeID1'];
    $id2 = $_POST['routeID2'];

    echo $id1;
    echo "\n";
    echo $id2;
    echo "\n";

    $connection = mysqli_connect($host, $username, $password, $database);
    // Check connection
    if (mysqli_connect_errno()){
        echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }


    $sql = "DROP TABLE IF EXISTS 2006tmp;";
    $sql.= "CREATE TABLE 2006tmp AS SELECT `MOVE SEQUENCE`, `PLACE ID` FROM 2006moves_raw WHERE `PLACE ID`=".$id1." OR `PLACE ID`=".$id2.";";
    $sql.= "ALTER TABLE 2006tmp ADD id INT PRIMARY KEY AUTO_INCREMENT;";
    $sql.= "DROP TABLE IF EXISTS 2009tmp;";
    $sql.= "CREATE TABLE 2009tmp AS SELECT `MOVE SEQUENCE`, `PLACE ID` FROM 2009moves_raw WHERE `PLACE ID`=".$id1." OR `PLACE ID`=".$id2.";";
    $sql.= "ALTER TABLE 2009tmp ADD id INT PRIMARY KEY AUTO_INCREMENT;";
    $sql.= "DROP TABLE IF EXISTS 2012tmp;";
    $sql.= "CREATE TABLE 2012tmp AS SELECT `MOVE SEQUENCE`, `PLACE ID` FROM 2012moves_raw WHERE `PLACE ID`=".$id1." OR `PLACE ID`=".$id2.";";
    $sql.= "ALTER TABLE 2012tmp ADD id INT PRIMARY KEY AUTO_INCREMENT;";

    echo $sql;
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