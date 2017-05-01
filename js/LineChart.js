function LineChart() { // change to show axes even if there is no data
					// if no data, use dummy values for axes
	var margin = {top: 30, right: 20, bottom: 40, left: 80};
	var width = 2150, height = 1000;
	var chartClass = "linechart";
	var data = [];

	var updateData;
	var updateHeight;
	var updateWidth;

	function chart(selection) {
		selection.each( function () {
			// set scale ranges
			var x = d3.scale.ordinal() // x-scale
			  	.rangeRoundBands([0, width], .1);

			var y = d3.scale.linear() // y-scale
				.range([height, 0]);

			var cScale = d3.scale.category20(); // category scale

			// set scale domains 
			if (typeof data !== 'undefined' && data.length > 0) {
				x.domain(data[0].map(function(d) { return d.year; }));
	            y.domain([0, d3.max(data, function(d) { 
	            	return d3.max(d, function(d2) {
	        			return +d2.value;
	        		});
		        })]);				
			} else {
				x.domain(["2006", "2009", "2012"]);
	            y.domain([0, 100]);
			}

			var xAxis = d3.svg.axis() // build x-Axis
				.scale(x) 
				.orient("bottom");
				// .tickValues(['2006', '2009', '2012'])

			var yAxis = d3.svg.axis() // build y-Axis
				.scale(y) 
				.orient("left");

			var line = d3.svg.line()
				.x(function(d) { console.log(d.year); console.log(x(d.year)); return x(d.year); })
				.y(function(d) { return y(d.value); });

			var svg = d3.select(this)
				.append("svg")
                .attr("class", chartClass)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            var g = svg
            	.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

			// draw x-axis
			g.append("g")     
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis);

			// draw y-axis
			g.append("g")     
				.attr("class", "y axis")
				.call(yAxis);

			// draw lines
			var linesg = g.append("g")
				.attr("class", "lines");

			var lines = linesg.selectAll("path")
				.data(data)
				.enter()
				.append("path")
				.attr("d", line)
				.attr("fill","none")
				.style("stroke","black")
				.style("stroke-width", "4px")
				.attr("transform", "translate(" + x.rangeBand()/2 + ",0)");
				



			updateData = function() {
				if (typeof data !== 'undefined' && data.length > 0) {
					x.domain(data[0].map(function(d) { return d.year; }));
		            y.domain([0, d3.max(data, function(d) { 
		            	return d3.max(d, function(d2) {
		        			return +d2.value;
		        		});
			        })]);				
				} else {
					x.domain(["2006", "2009", "2012"]);
		            y.domain([0, 100]);
				}

		        g.transition()
                	.duration(1000)
                	.select(".y.axis")
                    .call(yAxis.scale(y));

                g.transition()
                	.duration(1000)
                	.select(".x.axis")
                    .call(xAxis.scale(x));

                line
					.x(function(d) { return x(d.year); })
					.y(function(d) { return y(d.value); });

				var update = linesg.selectAll("path")
					.data(data);

				update.exit()
					.transition()
                	.duration(1000)
					.style("opacity", 0)
					.remove();

				update.enter()
					.append("path");

				update
					.attr("transform", "translate(" + x.rangeBand()/2 + ",0)")
					.transition()
                	.duration(1000)
					.attr("d", line)
					.attr("fill","none")
					.style("stroke","black")
					.style("stroke-width","4px");
			};

			updateHeight = function() {
               	y = d3.scale.linear().range([0, height]);
                y.domain([0, d3.max(data, function(d) { 
	            	return d3.max(d, function(d2) {
	        			return +d2.value;
	        		});
		        })]);

                g.transition()
                	.duration(1000)
                	.select(".y.axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(yAxis.scale(y));
                
                valueline.y(function(d) { return y(d.value); });

                lines.transition()
                	.duration(1000)
                    .attr("d", function(d) { 
                    	return valueline(d); 
                    });
                
                svg.transition()
                	.duration(1000)
                	.attr("height", height + margin.top + margin.bottom);

                g.transition()
                	.duration(1000)
                	.attr("height", height);
                	// .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // TODO
   			};

			updateWidth = function() {
   				x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
                x.domain(data.map(function(d) { return d.name; })); // FIX

                g.transition()
                	.duration(1000)
                	.select(".x.axis")
                    .call(xAxis.scale(x));

                valueline.x(function(d) { return x(d.year); });

                lines.transition()
                	.duration(1000)
                    .attr("d", function(d) { 
                    	return valueline(d); 
                    });

                svg.transition()
                	.duration(1000)
                	.attr("width", width + margin.left + margin.right);

                g.transition()
                	.duration(1000)
                	.attr("width", width);
                	// .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // TODO
   			
			};

		});
	};

    chart.data = function(value) {
        if (!arguments.length) return data;
        data = value;
        if (typeof updateData == "function") updateData();
        return chart;
    };

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        if (typeof updateWidth == "function") updateWidth();
        return chart;
    };

    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        if (typeof updateHeight == "function") updateHeight();
        return chart;
    };

    return chart;
};