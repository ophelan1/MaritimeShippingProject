//############################# GLOBAL VARIABLES #########################################
    var width = 2150;
    var height = 1000;

//############################# FUNCTIONS #########################################
function ExecuteMap(ports_dt, routes_dt, vessels_dt, traversals_dt) {
    var ports_d = ports_dt;
    var routes_d = routes_dt;
    var vessels_d = vessels_dt;
    var traversals_d = traversals_dt;

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

    d3.select("#mapContainer").append("br");

    var highlight_label = d3.select("#mapContainer")
    	.append("text")
    	.attr("class","highlight-label")
    	.text("filler");

    var linechart = LineChart();
    d3.select("#chartContainer").call(linechart);

    var filters = d3.select("#filterContainer");

//############################# AGE FILTER #########################################
    var age = [
        {name: "0-5", func: function(datum) {
            return datum.age == "0-5";
        }},
        {name: "5-10", func: function(datum) {
            return datum.age == "5-10";
        }},
        {name: "10-15", func: function(datum) {
            return datum.age == "10-15";
        }},
        {name: "15-20", func: function(datum) {
            return datum.age == "15-20";
        }},
        {name: "20-25", func: function(datum) {
            return datum.age == "20-25";
        }},
        {name: "25-30", func: function(datum) {
            return datum.age == "25-30";
        }},
        {name: ">30", func: function(datum) {
            return datum.age == ">30";
        }},
    ];

    var age_filter = CheckBoxFilter("age","Ship Age").data(age);
    filters.append("div")
    	.attr("id", "age-filter")
    	.attr("class", "filter")
    	.call(age_filter);


//############################# SHIP-TYPE FILTER #########################################
    var type = [
        {name: "Bulk", func: function(datum) {
            return datum.type == "Bulk";
        }},
        {name: "Container", func: function(datum) {
            return datum.type == "Container";
        }}
    ];

    var type_filter = CheckBoxFilter("type","Ship Type").data(type);
    filters.append("div")
    	.attr("id", "type-filter")
    	.attr("class", "filter")
    	.call(type_filter);

//############################# YEAR FILTER #########################################

    var year = [
        {name: "2006", func: function(datum) {
            return datum.year == "2006";
        }},
        {name: "2009", func: function(datum) {
            return datum.year == "2009";
        }},
        {name: "2012", func: function(datum) {
    		return datum.year == "2012";
        }}

    ];

    var year_filter = CheckBoxFilter("year","Year").data(year);
    filters.append("div")
    	.attr("id", "year-filter")
    	.attr("class", "filter")
    	.call(year_filter);

//############################# GENERATE-MAP BUTTON #########################################
    var gen_button = filters
    	.append("div")
    	.attr("class","button-cont")
        .append("button")
        .attr("class","generate-button")
        .text("Generate Routes")
        .on("click", drawRoutes);

    d3.select("div.button-cont").append("br");

    var clear_selection_button = d3.select("div.button-cont")
		.append("button")
        .attr("class","clear-button")
        .text("Clear Selection")
        .on("click", resetSelection);

    d3.select("div.button-cont").append("br");

    var clear_filters_button = d3.select("div.button-cont")
		.append("button")
        .attr("class","clear-button")
        .text("Reset Filters")
        .on("click", resetFilters);

	var routes = mapSvg.append("g");
    var ports = mapSvg.append("g");


    function drawRoutes() {
		var route_data = allFilters(ports_d, routes_d, vessels_d, traversals_d);

        var opac = d3.scale.linear()
            .range([0.1,1])
            .domain([0, d3.max(route_data, function(d) { 
                return d.freq;
            })]);   

        var update = routes.selectAll("path")
            .data(route_data);

        update.exit()
        	.transition()
        	.duration(1000)
        	.style("opacity", 0)
        	.remove();

        update.enter()
            .append("path");
            
        update
            .attr("class", "route")
            .attr("id", function(d) {
                return "r" + d.routeID;
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
            .attr("stroke-width", 3)
            .transition()
            .duration(1000)
            .attr("opacity", function() {
            	var freq = d3.select(this).data()[0].freq;
            	if (freq === 0) return 0;
                return opac(d3.select(this).data()[0].freq);
            });

        update.on("click", function() {
            var route = d3.select(this);
            var rClass = route.attr("class");
            if (rClass.search("selected") === -1) {
                route.attr("class","route selected");
            } 
            else {
                route.attr("class","route");
            }

            var chart_data = [], label_data = [];
            var selected = d3.selectAll(".route.selected");
            selected.each( function() {
                var dat = d3.select(this).data()[0];
                chart_data.push([
                    { year: "2006", value: dat.freq2006 },
                    { year: "2009", value: dat.freq2009 },
                    { year: "2012", value: dat.freq2012 }
                ]);

                var startport = ports_d.filter(function(d2){
                    return d2.id == dat.startportID;
                });

                var endport = ports_d.filter(function(d2){
                    return d2.id == dat.endportID;
                });

                label_data.push(
                   	{ 
                   		startport: startport[0].name + ", " + startport[0].country, 
                   	  	endport: endport[0].name + ", " + endport[0].country
                   	}
                );
            });

            linechart.data(chart_data, label_data);

        }); 

        update.on("mouseover", function() {
            d3.select(this)
                .attr("stroke", "#FFFF00")
                .attr("fill", "#FFFF00")
                .attr("opacity", 1)
                .attr("stroke-width", 6);

                var dat = d3.select(this).data()[0];

                var startport = ports_d.filter(function(d2){
                    return d2.id == dat.startportID;
                });

                var endport = ports_d.filter(function(d2){
                    return d2.id == dat.endportID;
                });

                highlight_label
	                .text(
	                	"            " +
	                	startport[0].name + ", " + startport[0].country + 
	                	" to " + 
	                	endport[0].name + ", " + endport[0].country
	                )
	                .attr("class","highlight-label visible");
	                // .attr("opacity",1);

                //Bring path to front
                this.parentNode.appendChild(this);
        });

        update.on("mouseout", function(d, i) {
            d3.select(this)
                .attr("fill", "#000000")
                .attr("stroke", "#000000")
                .attr("stroke-width", 3)
                .attr("opacity", function() {
                    var freq = d3.select(this).data()[0].freq;
                    if (freq === 0) return 0;
                    return opac(d3.select(this).data()[0].freq);
                });

            highlight_label
            	// .attr("opacity",0)
            	.attr("class","highlight-label")
            	.text("filler");
        });


        update = ports.selectAll("path")
        	.data(ports_d);

       	update.exit()
       		.transition()
       		.duration(1000)
       		.style("opacity", 0)
       		.remove();

		update.enter()
            .append("path")
            .attr("opacity", 0);

        update
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
            });

        update
            .on("click", function() {
                d3.select(this)
                    .attr("fill", "#342a99")
                    .attr("stroke", "#342a99");
            })
        	.transition()
        	.duration(1000)
        	.attr("opacity", 1);

       	// linechart.data([]);

    };

    function buildRoute(coords) {
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
        
        var vessels = age_filter.filter(vessels_d, d3.select("#type_filter"));
        var vesselIDs = vessels_d.map(function(d) { return d.id; });

        var routeIDs = routes_d.map(function(d) { return d.routeID; });

        var traversals = traversals_d.filter(function(d) {
            return !(routeIDs.indexOf(d.routeID) === -1) && !(vesselIDs.indexOf(d.vesselID) === -1);
        });

        return getFrequencies(traversals);
    }

    function resetFilters() {
    	d3.selectAll(".checkbox").property("checked",true);
    }

    function resetSelection() {
    	d3.selectAll(".route.selected").attr("class","route");
    	linechart.data([],[]);
    }

    function getFrequencies(traversals_d) {
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
                    freq2012: 0,
                    freq: 0
                });
            };

            index = routeIDs.indexOf(ti.routeID);
            switch(ti.year) {
                case "2006":
                    route_data[index].freq2006++;
                    break;
                case "2009":
                    route_data[index].freq2009++;
                    break;
                case "2012":
                    route_data[index].freq2012++;
                    break;
            }
            route_data[index].freq++; // if filtered first by year, line chart will not work
        							// if not, freq will be wrong

        	// fix route_data[index].freq by summing appropriate years
        }

        return route_data;
    }

}