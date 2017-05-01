function CheckBoxFilter(fClass, title) {
	var labels = [];
	var functions = [];
	var filterClass = fClass;

	var updateData;

	function chart(selection) {
		selection.each( function() {
			var g = d3.select(this).append("g");

			g.append("text")
				.text(title)
				.attr("class", "filter-title")

			g.append("br");

			var len = labels.length;
			for(var ii=0; ii<len; ii++) {
				g.data(labels[ii])
					.append("input")
					.attr("class", "checkbox " + filterClass)
					.attr("type", "checkbox")
					.attr("id", function(d,i) {
						return "f" + ii;
					})
					.attr("d", function(d) {
						return functions[ii]; 
					})
					.property("checked", true);

				g.append("span")
					.attr("class","checkboxtext")
					.text(" " + labels[ii]);

				g.append("br");
			}

			updateData = function() {
				g.selectAll("checkbox " + filterClass).remove();

				var len = labels.length;
				for(var ii=0; ii<len; ii++) {
					g.data(labels[ii])
						.append("input")
						.attr("class", "checkbox " + filterClass)
						.attr("type", "checkbox")
						.attr("d", function(d) {
							return functions[ii]; 
						})
						.property("checked", true);

					g.append("span")
						.attr("class","checkboxtext")
						.text(labels[ii]);

					g.append("br");
				}
			};
		
			filterData = function(newData, selection) {
				var filters = selection.selectAll("input.checkbox:checked");
				var returnData = [];

				// get data that should be included and concat to previous data
				var len = filters.length;
				for (var ii=0; ii<len; ii++) {
					returnData = returnData.concat(newData.filter( function(d) {
						return functions[ii](d);
					}));
				}

				return returnData;
			};
		});
	};

    chart.data = function(value) {
	    if (!arguments.length) return labels;
	 	
	 	labels = [];
	    functions = [];
	    
	    var len = value.length;
	    for (var i=0; i<len; i++) {
			labels.push(value[i].name);
	      	functions.push(value[i].func);
	    }
	    
	    if (typeof updateData == "function") updateData();
	    return chart;
	};

    chart.filter = function(value, selection) {
    	return filterData(value, selection);
    };

    return chart;
};