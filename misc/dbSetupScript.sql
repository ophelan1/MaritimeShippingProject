CREATE DATABASE testData;
USE testData;

CREATE TABLE `rawData` (
  `route_ID` int(11) DEFAULT NULL,
  `year` int(11) DEFAULT NULL,
  `start_port` varchar(255) DEFAULT NULL,
  `start_port_country` varchar(255) DEFAULT NULL,
  `end_port` varchar(255) DEFAULT NULL,
  `end_port_country` varchar(255) DEFAULT NULL,
  `ships_per_yr` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

LOAD DATA LOCAL INFILE '/Users/Owen/Desktop/16-17Classes/Sem2/DataVisualization/Final/data/SampleData.csv'
  INTO TABLE testData.rawData
    FIELDS TERMINATED BY '|' OPTIONALLY ENCLOSED BY '"'
      LINES TERMINATED BY '\n';
      
PRINT SELECT * FROM rawData;