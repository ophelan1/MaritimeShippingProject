function Map() {
	var width = 2150,
        height = 1000;
    var data = [];

    var updateData;

    function chart(selection) {
    	selection.each( function () {
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

    		var routes = mapSvg.append("g");
	        var ports = mapSvg.append("g");

	    	updateData = function() { // account for no data
		        var route_data = allFilters(ports_d, routes_d, vessels_d, traversals_d);

		        var opac = d3.scale.linear()
		            .range([0,1])
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
		            .trasition()
		            .duration(1000)
		            .attr("opacity", function() {
		                return opac(d3.select(this).data()[0].freq);
		            })
		            .on("click", function() {
		                var route = d3.select(this);
		                var rClass = route.attr("class");
		                if (rClass.search("selected") === -1) {
		                    route.attr("class","route selected");
		                } else {
		                    route.attr("class","route");
		                }

		                var chart_data = [];
		                var selected = d3.selectAll(".route.selected");
		                selected.each( function() {
		                    var dat = d3.select(this).data()[0];
		                    chart_data.push([
		                        { year: "2006", value: dat.freq2006 },
		                        { year: "2009", value: dat.freq2009 },
		                        { year: "2012", value: dat.freq2012 }
		                    ]);
		                });

		                linechart.data(chart_data);
		            }); 

		        update = ports.selectAll("path")
		        	.data(ports_d);

		       	update.exit()
		       		.transition()
		       		.duration(1000)
		       		.style("opacity", 0)
		       		.remove();

				update.enter()
		            .append("path");

		        update
		        	.transition()
		        	.duration(1000)
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
			};
    	});
    };

    chart.data = function(value) {
        if (!arguments.length) return data;
        data = value;
        if (typeof updateData == "function") updateData();
        return chart;
    };

}