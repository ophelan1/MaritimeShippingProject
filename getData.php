#!/usr/bin/env php
<?php
    $username = "root"; 
    $password = "#Owenaug02";   
    $host = "127.0.0.1";
    $database="testData";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

    $myquery = "
SELECT  `ships_per_yr`, `year` FROM  `rawData` WHERE `route_ID`=1
";
    $query = mysql_query($myquery);
    
    if ( ! $query ) {
        echo mysql_error();
        die;
    }
    
    $data = array();
    
    for ($x = 0; $x < mysql_num_rows($query); $x++) {
        $data[] = mysql_fetch_assoc($query);
    }
    
    echo json_encode($data);     
     
    mysql_close($server);
?>