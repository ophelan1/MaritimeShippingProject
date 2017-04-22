<?php
    $username = "Owen"; 
    $password = "#Owenaug02";   
    $host = "localhost";
    $database="maritimeData";
    
    $server = mysql_connect($host, $username, $password);
    $connection = mysql_select_db($database, $server);

    $myquery = "
/*2006 Traversals*/
DROP TABLE IF EXISTS `tmp`;

CREATE TABLE tmp AS 
    SELECT `MOVE SEQUENCE`, `PLACE ID`
    FROM 2006moves_raw
    WHERE `PLACE ID`=2503 OR `PLACE ID`=7598;

ALTER TABLE tmp ADD id INT PRIMARY KEY AUTO_INCREMENT;

SELECT COUNT(*) AS count into @2006count
    FROM
            tmp g1
        INNER JOIN
            tmp g2 ON g2.id = g1.id + 1
    WHERE
        g1.`MOVE SEQUENCE` = g2.`MOVE SEQUENCE`-1;

DROP TABLE tmp;
    
    
/*2009 Traversals*/

CREATE TABLE tmp AS 
    SELECT `MOVE SEQUENCE`, `PLACE ID`
    FROM 2009moves_raw
    WHERE `PLACE ID`=2503 OR `PLACE ID`=7598;

ALTER TABLE tmp ADD id INT PRIMARY KEY AUTO_INCREMENT;

SELECT COUNT(*) AS count into @2009count
    FROM
            tmp g1
        INNER JOIN
            tmp g2 ON g2.id = g1.id + 1
    WHERE
        g1.`MOVE SEQUENCE` = g2.`MOVE SEQUENCE`-1;

DROP TABLE tmp;


/*2012 Traversals*/

CREATE TABLE tmp AS 
    SELECT `MOVE SEQUENCE`, `PLACE ID`
    FROM 2012moves_raw
    WHERE `PLACE ID`=2503 OR `PLACE ID`=7598;

ALTER TABLE tmp ADD id INT PRIMARY KEY AUTO_INCREMENT;

SELECT COUNT(*) AS count into @2012count
    FROM
            tmp g1
        INNER JOIN
            tmp g2 ON g2.id = g1.id + 1
    WHERE
        g1.`MOVE SEQUENCE` = g2.`MOVE SEQUENCE`-1;

DROP TABLE tmp;

SELECT @2006count
    UNION
SELECT @2009count
    UNION
SELECT @2012count;
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