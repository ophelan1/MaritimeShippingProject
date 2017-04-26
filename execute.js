function ExecuteMap() {
  var width = 2150,
    height = 1000;


//######################################################################
// Setup the map SVG
  var mapSvg = d3.select("#mapContainer")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  var g = mapSvg.append("g");

  proj = d3.geo.equirectangular()
    .scale(300)
    .translate([width/2,height/2]);

  geoPath = d3.geo.path()
      .projection(proj);

  g.selectAll("path")
    .data(worldgeo_json.features)
    .enter()
    .append("path")
    .attr("fill", "#b7b7b7")
    .attr("d", geoPath);

//######################################################################
// Setup the Bar Chart SVG
  var margin = {top: 30, right: 20, bottom: 40, left: 80};

 // The X & Y Scale
  var x = d3.scale.linear()
      .range([0, width])
  var y = d3.scale.linear().range([height, 0]);
  var cScale = d3.scale.category20();

  // THE X & Y Axis
  var xAxis = d3.svg.axis().scale(x)
      .orient("bottom")
      .tickValues(['2006', '2009', '2012'])
  var yAxis = d3.svg.axis().scale(y)
      .orient("left").ticks(5);


  valueline = d3.svg.line()
      .x(function(d) { return x(d.year); })
      .y(function(d) { return y(d.frequency); });

  //Global SVG Variable
  barSvg = d3.select("#chartContainer")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Scale the range of the data
  x.domain([2005, 2013]);
  y.domain([0, 1000]);

  // Add the X Axis
  barSvg.append("g")     
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  // Add the Y Axis
  barSvg.append("g")     
      .attr("class", "y axis")
      .call(yAxis);

  lineArray = {};

//######################################################################
// Setup the Filter Section
  
  // var slider = d3.select("#slider").call(d3.slider().axis(true).min(2006).max(2012).step(3));

  var data = [
      {name: "0-5", value: 14221},
      {name: "6-10", value: 5641},
      {name: "11-15", value: 2341},
      {name: "16-20", value: 3568},
      {name: "21-25", value: 1254},
      {name: "26-30", value: 8795},
      {name: "30+", value: 15227}
  ];

  var size = [
      {name: "0-3K", value: 4122},
      {name: "3K-6K", value: 5752},
      {name: "6K-9K", value: 9852},
      {name: "9K-12K", value: 7412},
      {name: "12K-15K", value: 1021},
  ];

  // d3.select("#age_filter").call(BarChart().width(400).height(150).labelPadding(1).data(data));
  // d3.select("#size_filter").call(BarChart().width(400).height(150).labelPadding(1).data(size));



    // var width_scale = d3.scale.linear()
    //   .range([0,5]);

    // width_scale.domain([
    //   d3.min(routes_json.features, function(d) { return d.properties.frequency; }),
    //   d3.max(routes_json.features, function(d) { return d.properties.frequency; })
    // ]);
  };


  function setRoutes() {
    d3.queue()
    .defer(d3.csv, "Ports.csv", function(d) {
      return {
        id: d.id,
        name: d.name,
        country: d.country,
        lat: +d.lat,
        long: +d.long
      };
    })
    .defer(d3.csv, "Routes.csv", function(d) {
      return {
        startportID: d.startportID,
        endportID: d.endportID
      };
    })
    .defer(d3.csv, "Vessels.csv", function(d) {
      return {
        id: d.id,
        flag: d.flag,
        type: d.type,
        size: d.size,
        owner: d.owner,
        operator: d.operator
      };
    })
    .defer(d3.csv, "Traversals.csv", function(d) {
      return {
        year: d.year,
        vesselID: d.vesselID,
        startportID: d.startportID,
        endportID: d.endportID,
        startdate: new Date(d.startdate),
        enddate: new Date(d.enddate)
      };
    })
    .await(ready);
  }

  function ready(error, ports_d, routes_d, vessels_d, traversals_d) {
    if (error) throw error;



    // var routeFreq = getFrequencies(routes_d);
    // console.log(routeFreq);
    // console.log(routeFreq[0]);
    // console.log(routeFreq[1]);

    var routes = mapSvg.append("g");

    routes.selectAll("path")
      .data(routes_d)
      .filter(function(d) {
        return d.startportID < 1000 & d.endportID < 1000;
        // console.log(routeFreq[i]);
        // return routeFreq[i]>2;
        // return d.startportID == 1182 | d.startportID == 238;
        // return d.startportID < 1000 & d.endportID < 500;
      })
      .enter()
      .append("path")
      .attr("d", function(d) {
        var startport = ports_d.filter(function(d2){
          return d2.id == d.startportID;
        });
        var endport = ports_d.filter(function(d2){
          return d2.id == d.endportID;
        });
        var coords = [
          [startport[0].long, startport[0].lat],
          [endport[0].long, endport[0].lat]
        ];
        return buildRoute(coords);
      })
      .attr("fill", "#000000")
      .attr("stroke", "#000000")
      .attr("stroke-width", 3)// function(d) {
        // return width_scale(d);
      // })
      .on("click", function() {
        if(d3.select(this).attr("fill") == "#000000" ){
          d3.select(this)
            .attr("fill","#66cd00")
            .attr("stroke","#66cd00");
            var idInfo = d3.select(this).datum();
            var startPortID = idInfo.startportID;
            var endPortID = idInfo.endportID;
            console.log(idInfo);
            console.log(startPortID);
            console.log(endPortID);

        // $.ajax({
        //   url: 'php/tableSetup.php',
        //   type: 'POST',
        //   data: {routeID1:startPortID, routeID2:endPortID},
        //   success: function(data) {
        //     console.log(data);
        //     $.ajax({
        //       url: 'php/getValues.php',
        //       type: 'POST',
        //       success: function(data) {
        //         console.log(data);
        //         var routeData = JSON.parse(data);
        //         console.log(routeData);
        //         routeLine = barSvg.append("path")
        //               .attr("class", "line")
        //               .attr("d", valueline(routeData));
        //       }
        //     }); // end inner ajax cal
        //   }
        // }); // end outer ajax cal

        }
        else{
          console.log("Path already highlighted");
          // routeLine.remove();
          d3.select(this)
            .attr("fill","#000000")
            .attr("stroke", "#000000");
        }
      });

    var ports = mapSvg.append("g");

    ports.selectAll("path")
      .data(ports_d)
      .enter()
      .append("path")
      .attr("fill", "#900")
      .attr("stroke", "#999")
      .attr("d", function(d) {
        var feature = {
          "type":"Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [d.long, d.lat]
          }
        };
        return geoPath(feature);
      })
      .on("click", function() {
        d3.select(this)
          .attr("fill", "#342a99")
          .attr("stroke", "#342a99");
      });

  function buildRoute(coords) {
    // var west = false;
    // if ()

    // calculate east to west if start >105 and ends up on the west coast 
    // how to define west coast of americas?(<70 if south america or <)

    var x180 = proj([180,coords[0][1]])[0];
    var xm180 = proj([-179.999,coords[0][1]])[0];
    var vert = proj(coords[1])[1] - proj(coords[0])[1]; // y of start minus y of end
    var horz1;
    var horz2;
    var slope;

    var path= "M" + proj(coords[0])[0] + "," + proj(coords[0])[1];
    if (coords[0][0]>105 & coords[1][0] < -70) {
      horz1 = x180 - proj(coords[0])[0];
      horz2 = proj(coords[1])[0] - xm180;
      slope = vert/(horz1 + horz2);
      //console.log(coords[0]); //**  
      path+= "L" + x180 + ","; path+= (proj(coords[0])[1] + slope * horz1);
      path+= "M" + xm180 + ","; path+= (proj(coords[0])[1] + slope * horz1);
    } 

    else if (coords[0][0] < -70 & coords[1][0]>105) {
      horz1 = proj(coords[0])[0] - xm180;
      horz2 = x180 - proj(coords[1])[0];
      slope = vert/(horz1 + horz2);
      //console.log(coords[0]); //**
      path+= "L" + xm180 + ","; path+= (proj(coords[0])[1] + slope * horz1);
      path+= "M" + x180 + ","; path+= (proj(coords[0])[1] + slope * horz1);
    }
    path+= "L" + proj(coords[1])[0] + "," + proj(coords[1])[1];
    return path;
  }

  // function getFrequencies(data) {
  //   var currentCompany = current.Company;
  //   if(!freq.hasOwnProperty(currentCompany)) freq[currentCompany] = 0;
  //   freq[currentCompany]++;
  //   return freq;
  // }

}
