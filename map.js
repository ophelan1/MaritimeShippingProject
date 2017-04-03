function ExecuteMap() {
  var width = 2150,
    height = 1000;

  var svg = d3.select( "body" )
    .append( "svg" )
    .attr("width", width )
    .attr("height", height );

  var g = svg.append( "g" );

  var proj = d3.geo.equirectangular()
    .scale( 300 )
    // .rotate( [71.057,0] )
    //.center( [0, 42.313] )
    .translate( [width/2,height/2] );

  var geoPath = d3.geo.path()
      .projection(proj);

  g.selectAll( "path" )
    .data( worldgeo_json.features )
    .enter()
    .append( "path" )
    .attr( "fill", "#b7b7b7" )
    .attr( "d", geoPath );

  var ports = svg.append( "g" );

  ports.selectAll( "path" )
    .data( ports_json.features )
    .enter()
    .append( "path" )
    .attr( "fill", "#900" )
    .attr( "stroke", "#999" )
    .attr("d", geoPath);

  // var width_scale = d3.scale.linear()
  //   .range([0,5]);

  // width_scale.domain([
  //   d3.min(routes_json.features, function(d) { return d.properties.frequency; }),
  //   d3.max(routes_json.features, function(d) { return d.properties.frequency; })
  // ]);

  var routes = svg.append("g");

  routes.selectAll("path")
    .data(routes_json.features)
    .enter()
    .append("path")
    .attr("d", function(d) {
      var coords = d.geometry.coordinates;
      var com= "M" + proj(coords[0])[0] + "," + proj(coords[0])[1];
      com+= "L" + proj(coords[1])[0] + "," + proj(coords[1])[1];
      return com;
    })
    .attr( "fill", "#000000")
    .attr( "stroke", "#000000")
    .attr("stroke-width", 3)// function(d) {
      // return width_scale(d);
    // })
    .on("click", function() {
      d3.select(this)
        .attr("fill","#66cd00")
        .attr("stroke","#66cd00");
    });

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

  d3.select("#age_filter").call(BarChart().width(400).height(150).labelPadding(1).data(data));
  d3.select("#size_filter").call(BarChart().width(400).height(150).labelPadding(1).data(size));
}