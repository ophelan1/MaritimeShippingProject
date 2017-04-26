function ExecuteMap(ports_dt, routes_dt, vessels_dt, traversals_dt) {
    var ports_d = ports_dt;
    var routes_d = routes_dt;
    var vessels_d = vessels_dt;
    var traversals_d = traversals_dt;

    var width = 2150,
        height = 1000;

    var mapSvg = d3.select("#mapContainer")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    var g = mapSvg.append("g");

    var proj = d3.geo.equirectangular()
        .scale(300)
        .translate([width/2,height/2]);

    var geoPath = d3.geo.path()   
        .projection(proj);

    g.selectAll("path")
        .data(worldgeo_json.features)
        .enter()
        .append("path")
        .attr("fill", "#b7b7b7")
        .attr("d", geoPath);

  
  // var slider = d3.select("#slider").call(d3.slider().axis(true).min(2006).max(2012).step(3));

    var age = [
        {name: "0-5", func: function(datum, checked) {
            return datum.age == "0-5" && checked == true;
        }},
        {name: "6-10", func: function(datum, checked) {
            return datum.age == "6-10" && checked == true;
        }},
        {name: "11-15", func: function(datum, checked) {
            return datum.age == "11-15" && checked == true;
        }},
        {name: "16-20", func: function(datum, checked) {
            return datum.age == "16-20" && checked == true;
        }},
        {name: "21-25", func: function(datum, checked) {
            return datum.age == "21-25" && checked == true;
        }},
        {name: "26-30", func: function(datum, checked) {
            return datum.age == "26-30" && checked == true;
        }},
        {name: "30+", func: function(datum, checked) {
            return datum.age == "31+" && checked == true;
        }},
    ];

    var age_filter = CheckBoxFilter("age").data(age);
    d3.select("#age_filter").call(age_filter);

    var type = [
        {name: "Bulk", func: function(datum, checked) {
            return datum.type == "Bulk" && checked == true;
        }},
        {name: "Container", func: function(datum, checked) {
            return datum.type == "Container" && checked == true;
        }}
    ];

    var type_filter = CheckBoxFilter("type").data(type);
    d3.select("#type_filter").call(type_filter);

    var button = d3.select("div.button")
        .append("button")
        .attr("class","generate-button")
        .text("Generate Routes")
        .on("click", drawRoutes);

    var linechart = LineChart();
    d3.select("#chartContainer").call(linechart);

    function drawRoutes() {

        var routes = mapSvg.append("g");

        var route_data = allFilters(ports_d, routes_d, vessels_d, traversals_d);

        routes.selectAll("path")
            .data(route_data)
            // .filter(function(d) {
            //     console.log(route_data)
            //     console.log(route_data.routeID);
            //     console.log(d.routeID);
            //     console.log(route_data.routeID.indexOf(d.routeID));
            //     console.log(route_data.routeID.indexOf(d.routeID) === -1);
            //     // return route_data.routeID.indexOf(d.routeID) === -1;
            //     return true;
            // })
            .enter()
            .append("path")
            .attr("class", "route unselected")
            .attr("id", function(d) {
                return d.routeID;
            })
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
                d3.select(this)
                .attr("fill","#66cd00")
                .attr("stroke","#66cd00");
            }); 

        var ports = mapSvg.append("g");

        ports.selectAll("path")
            .data(ports_d)
            .enter()
            .append("path")
            .attr("class","port")
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

        // var width_scale = d3.scale.linear()
        //   .range([0,5]);

        // width_scale.domain([
        //   d3.min(routes_json.features, function(d) { return d.properties.frequency; }),
        //   d3.max(routes_json.features, function(d) { return d.properties.frequency; })
        // ]);
    };

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
            path+= "L" + x180 + ","; path+= (proj(coords[0])[1] + slope * horz1);
            path+= "M" + xm180 + ","; path+= (proj(coords[0])[1] + slope * horz1);
        } 

        else if (coords[0][0] < -70 & coords[1][0]>105) {
            horz1 = proj(coords[0])[0] - xm180;
            horz2 = x180 - proj(coords[1])[0];
            slope = vert/(horz1 + horz2);
            path+= "L" + xm180 + ","; path+= (proj(coords[0])[1] + slope * horz1);
            path+= "M" + x180 + ","; path+= (proj(coords[0])[1] + slope * horz1);
        }
        path+= "L" + proj(coords[1])[0] + "," + proj(coords[1])[1];
        return path;
    }

    function allFilters(ports_d, routes_d, vessels_d, traversals_d) {
        // filter all this data
        // produce array of route ids, port ids and frequencies
        
        // filter vessels
        vessels_d = age_filter.filter(vessels_d, d3.select("#type_filter"));

        var vessels = vessels_d.map(function(d) { return d.id; });
        var routes = routes_d.map(function(d) { return d.routeID; });
        traversals_d.filter(function(d) {
            return !(routes.indexOf(d.vesselID) === -1) && !(vessels.indexOf(d.vesselID) === -1);
        });

        // calculate frequencies by route
        // TODO
        return getFrequencies(routes_d, traversals_d);


        // var routes = [
        //     { routeID: "1", startportID: "3", endportID: "2567", frequency: "334" },
        //     { routeID: "2", startportID: "7", endportID: "289", frequency: "123" },
        //     { routeID: "3", startportID: "7", endportID: "1602", frequency: "2199" } 
        // ];

        // return routes;
    }

    function getFrequencies(routes_d, traversals_d) {
        // var trav2006 = traversals_d.filter(function(d) {
        //     return d.year === 2006;
        // });
        // var trav2009 = traversals_d.filter(function(d) {
        //     return d.year === 2009;
        // });
        // var trav2012 = traversals_d.filter(function(d) {
        //     return d.year === 2012;
        // });

        var routeIDs = []; 
        var route_data = [];

        var len = traversals_d.length;
        for (var i=0; i<len; i++) {
            var ti = traversals_d[i];
            var index = routeIDs.indexOf(ti.routeID);
            
            if (index === -1) {
                routeIDs.push(ti.routeID);
                route_data.push({
                    routeID: ti.routeID,
                    startportID: ti.startportID,
                    endportID: ti.endportID,
                    freq2006: 0,
                    freq2009: 0,
                    freq2012: 0
                });
            };

            index = routeIDs.indexOf(ti.routeID);
            switch(ti.year) {
                case "2006":
                    route_data[index].freq2006 = route_data[index].freq2006 + 1;
                    break;
                case "2009":
                    route_data[index].freq2009++;
                    break;
                case "2012":
                    route_data[index].freq2012++;
                    break;
            }

        }

        console.log(route_data);
        return route_data;
    }

    // function getFrequencies(data) {
    //   var currentCompany = current.Company;
    //   if(!freq.hasOwnProperty(currentCompany)) freq[currentCompany] = 0;
    //   freq[currentCompany]++;
    //   return freq;
    // }

}