function ExecuteMap() {
  var width = 2150,
    height = 1000;

  var svg = d3.select( "body" )
    .append( "svg" )
    .attr( "width", width )
    .attr( "height", height );

  var g = svg.append( "g" );

  var proj = d3.geo.equirectangular()
    .scale( 350 )
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
}