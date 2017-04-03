function BarChart() {
    var margin = {top: 20, right: 20, bottom: 30, left: 100};
    var chartClass = "BarChart";
    var width = 1000, height = 500;
    var labelPadding = 2;
    var labelSize = "NA"; // replaced with y.rangeBand()/labelSizeScale later
    var labelSizeScale = 4;
    var xAxisLabel = "";
    var data = [];

    var updateWidth;
    var updateHeight;
    var updateLabelPadding;
    var updateMarginLeft;
    var updateMarginRight;
    var updateMarginTop;
    var updateMarginBottom;
    var updateMargin;
    var updateLabelSize;
    var updateLabelSizeScale;
    var updateData;

    function chart(selection) {
        selection.each( function () {
            var x = d3.scale.ordinal() // y-scale
                .rangeRoundBands([0, width], .1);

            var y = d3.scale.linear() // x-scale
                .range([height, 0]);

            var xAxis = d3.svg.axis() // build x-Axis
                .scale(x)
                .orient("bottom")
                .tickSize(0);

            var yAxis = d3.svg.axis() // build y-Axis
                .scale(y)
                .ticks(5)
                .orient("left");

            var full_svg = d3.select(this).append("svg") // creates svg element with margins
                .attr("class", chartClass)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            var svg = full_svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // set scale domains
            x.domain(data.map(function(d) { return d.name; }));
            y.domain([0, d3.max(data, function(d) { return +d.value; })]);

            var axisElements = svg.append("g") // draw x-axis
                .attr("class", "x axis")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);
            // axisElements.selectAll("text").remove();

            svg.append("g") // draw y-axis
                .attr("class", "y axis")
                .call(yAxis);
                // .append("text") // add labels

            var bar_color = new Array(data.length).fill(false);
            var bars = svg.selectAll(".bar") // draw bars
                .data(data)
                .enter().append("g")
                .attr("class", "bar")
                .append("rect")
                .attr({
                    "width": x.rangeBand(),
                    "height": function(d) { return y(d.value); },
                    "y": function(d) { return height - y(d.value); },
                    "x": function(d) { return x(d.name); },
                    "fill": "#794044"
                })
                .on("click", function(d, i) { 
                    if (bar_color[i]) {
                        d3.select(this).attr("fill","#794044");
                        bar_color[i] = false;
                    } else {
                        d3.select(this).attr("fill","#a3a3a3");
                        bar_color[i] = true;
                    }
                });

            var xlabel = svg.append("text")
                .attr("class","x axis label")
                .attr("transform",
                    "translate(" + (width/2) + " ," + 
                                   (height + margin.top + 20) + ")")
                .style("text-anchor", "middle")
                .text(xAxisLabel);

            // var labels = svg.selectAll(".text") // draw bar labels
            //     .data(data)
            //     .enter()
            //     .append("text")
            //     .text(function(d) { return d.value; })
            //     .attr({
            //         "id": function(d) { return d.name; },
            //         "class": "bar-label",
            //         "opacity": 0
            //     })
            //     .attr("font-size", function() {
            //         if (labelSize == "NA") {
            //             return x.rangeBand()/labelSizeScale + "px";
            //         } else {
            //             return labelSize;
            //         }
            //     })
            //     .attr("y", function(d) { // inside if long bar, outside if short
            //         if (d.value > 3) {
            //             return y(d.value) - y(labelPadding);
            //         } else {
            //             return y(d.value) + y(labelPadding);
            //         }
            //     })
            //     .attr("x", function(d) { return x(d.name) + x.rangeBand()/2; } );

            // Update functions
            updateHeight = function() {
                y = d3.scale.linear().range([0, height]);
                y.domain([0, d3.max(data, function(d) { return +d.value; })]);

                svg.transition().duration(1000).select(".y.axis")
                    .attr("transform", "translate(0," + height + ")")
                    .call(yAxis.scale(y));
                bars.transition().duration(1000)
                    .attr("height", function(d) { return y(d.value); });
                full_svg.transition().duration(1000).attr("height", height + margin.top + margin.bottom);
                labels.transition().duration(1000).attr("y", function(d) { // inside if long bar, outside if short
                    if (d.value > 3) {
                        return y(d.value) - y(labelPadding);
                    } else {
                        return y(d.value) + y(labelPadding);
                    }
                });
            };

            updateWidth = function() {
                x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
                x.domain(data.map(function(d) { return d.name; }));

                svg.transition().duration(1000).select(".x.axis")
                    .call(yAxis.scale(y));
                bars.transition().duration(1000)
                    .attr("x", function(d) { return x(d.name); })
                    .attr("width", x.rangeBand());
                full_svg.transition().duration(1000).attr("width", width + margin.left + margin.right);
                labels.transition.duration(1000).attr("x", function(d) { return x(d.name) + x.rangeBand()/2; } );
            };

            updateLabelPadding = function() {
                labels.attr("y", function(d) { // inside if long bar, outside if short
                    if (d.value > 3) {
                        return y(d.value) - y(labelPadding);
                    } else {
                        return y(d.value) + y(labelPadding);
                    }
                });
            }

            updateMarginLeft = function() {
                full_svg.attr("width", width + margin.left + margin.right);
            }

            updateMarginRight = function() {
                full_svg.attr("width", width + margin.left + margin.right);
            }

            updateMarginTop = function() {
                full_svg.attr("height", height + margin.top + margin.bottom);
            }

            updateMarginBottom = function() {
                full_svg.attr("height", height + margin.top + margin.bottom);
            }

            updateMargin = function() {
                full_svg.attr("width", width + margin.left + margin.right);
                full_svg.attr("height", height + margin.top + margin.bottom);
            }

            updateLabelSize = function() {
                labels.attr("font-size", labelSize + "px");
            }

            updateLabelSizeScale = function() {
                labelSize = x.rangeBand()/labelSizeScale;
                labels.attr("font-size", x.rangeBand()/labelSizeScale + "px");
            }

            updateXAxisLabel = function() {
                xlabel.text(xAxisLabel);
                // d3.select(".x.axis.label").call(xAxis);
            }

            updateData = function() {
                // Update scales
                y.domain([0, d3.max(data, function(d) { return +d.value; })]);
                x.domain(data.map(function(d) { return d.name; }));

                // Transition axes
                svg.transition().duration(1000).select(".x.axis").call(xAxis.scale(x));
                svg.transition().duration(1000).select(".y.axis").call(yAxis.scale(y));

                // Transition bars
                var update = bars.data(data);

                update // updating data
                    .transition()
                    .duration(1000)
                    .attr({
                        "y": 0,
                        "x": function(d) { return x(d.name); },
                        "width": x.rangeBand(),
                        "height": function(d) { return y(d.value); }
                    });

                update.enter() // enter data
                    .append("rect")
                    .attr({
                        "class": "bar",
                        "x": function(d) { return x(d.name); },
                        "width": x.rangeBand(),
                        "y": 0,
                        "height": 0
                    })
                    .style("opacity", 0)
                    .transition()
                    .duration(1000)
                    .delay(function(d, i) { return (data.length - i) * 40; })
                    .attr("height", function(d) { return y(d.value); })
                    .style("opacity", 1);

                update.exit() // exiting data
                    .transition()
                    .duration(650)
                    .delay(function(d, i) { return (data.length - i) * 20; })
                    .style("opacity", 0)
                    .attr("height", 0)
                    .attr("x", 0)
                    .attr("width", 0)
                    .remove();

                // Transition labels
                var update2 = labels.data(data);

                update2
                    .transition()
                    .duration(1000)
                    .text(function(d) { return d.value; })
                    .attr("id", function(d) { return "id" + d.name; })
                    .attr("font-size", function() {
                        if (labelSize == "NA") {
                            return x.rangeBand()/labelSizeScale + "px";
                        } else {
                            return labelSize;
                        }
                    })
                    .attr("y", function(d) { // inside if long bar, outside if short
                        if (d.value > 3) {
                            return y(d.value) - y(labelPadding);
                        } else {
                            return y(d.value) + y(labelPadding);
                        }
                    })
                    .attr("x", function(d) { return x(d.name) + x.rangeBand()/2; });

                update2.enter() // enter data
                    .append("text")
                    .attr({
                        "id": function(d) { return "id" + d.name; },
                        "opacity": 0,
                        "class": "bar-label"
                    })
                    .transition()
                    .duration(1000)
                    .delay(function(d, i) { return (data.length - i) * 40; })
                    .text(function(d) { return d.value; })
                    .attr("font-size", function() {
                        if (labelSize == "NA") {
                            return x.rangeBand()/labelSizeScale + "px";
                        } else {
                            return labelSize;
                        }
                    })
                    .attr("y", function(d) { // inside if long bar, outside if short
                        if (d.value > 3) {
                            return y(d.value) - y(labelPadding);
                        } else {
                            return y(d.value) + y(labelPadding);
                        }
                    })
                    .attr("x", function(d) { return x(d.name) + x.rangeBand()/2; } );

                update2.exit()
                    .transition()
                    .duration(650)
                    .style("opacity", 0)
                    .remove();
            }
        });
    }

    // Setters and Getters
    // data, width, height, labelPadding, margin, labelSize, labelSizeScale

    chart.data = function(value) {
        if (!arguments.length) return data;
        data = value;
        if (typeof updateData == "function") updateData();
        return chart;
    }

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

    chart.labelPadding = function(value) {
        if (!arguments.length) return labelPadding;
        labelPadding = value;
        if (typeof updateLabelPadding == "function") updateLabelPadding();
        return chart;
    }

    chart.xAxisLabel = function(value) {
        if (!arguments.length) return xAxisLabel;
        xAxisLabel = value;
        if (typeof updateXAxisLabel == "function") updateXAxisLabel();
        return chart;
    }

    chart.margin = function(value) {
        if (!argument.length) return margin;
        margin.left = value.left;
        margin.right = value.right;
        margin.top = value.top;
        margin.bottom = value.bottom;
        if (typeof updateMargin == "function") updateMargin();
        return chart();
    }

    chart.margin.left = function(value) {
        if (!arguments.length) return margin.left;
        margin.left = value;
        if (typeof updateMarginLeft == "function") updateMarginLeft();
        return chart;
    }

    chart.margin.right = function(value) {
        if (!arguments.length) return margin.right;
        margin.right = value;
        if (typeof updateMarginRight == "function") updateMarginRight();
        return chart;
    }

    chart.margin.top = function(value) {
        if (!arguments.length) return margin.top;
        margin.top = value;
        if (typeof updateMarginTop == "function") updateMarginTop();
        return chart;
    }

    chart.margin.bottom = function(value) {
        if (!arguments.length) return margin.bottom;
        margin.bottom = value;
        if (typeof updateMarginBottom == "function") updateMarginBottom();
        return chart;
    }

    chart.labelSize = function(value) {
        if (!arguments.length) return labelSize;
        labelSize = value;
        labelSizeScale = "NA";
        if (typeof updateLabelSize == "function") updateLabelSize();
        return chart;
    }

    chart.labelSizeScale = function(value) {
        if (!arguments.length) return labelSizeScale;
        labelSizeScale = value;
        if (typeof updateLabelSizeScale == "function") updateLabelSizeScale();
        return chart;
    }

    return chart;
};
