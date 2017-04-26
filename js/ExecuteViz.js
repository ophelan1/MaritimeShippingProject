function ExecuteViz() {
    d3.queue()
        .defer(d3.csv, "../data/Ports.csv", function(d) {
            return {
                id: d.id,
                name: d.name,
                country: d.country,
                lat: +d.lat,
                long: +d.long
            };    
        })
        .defer(d3.csv, "../data/Routes.csv", function(d) {
            return {
                routeID: d.routeID,
                startportID: d.startportID,
                endportID: d.endportID
            };
        })
        .defer(d3.csv, "../data/Vessels.csv", function(d) {
            return {
                id: d.id,
                flag: d.flag,
                type: d.type,
                size: d.size,
                owner: d.owner,
                operator: d.operator
            };
        })
        .defer(d3.csv, "../data/Traversals.csv", function(d) {
            return {
                year: d.Year,
                vesselID: d.vesselid,
                routeID: d.routeID,
                startportID: d.startportID,
                endportID: d.endportID,
                startdate: new Date(d.sailingdate),
                enddate: new Date(d.arrivaldate)
            };
        })
        .await(ready);

    function ready(error, ports_d, routes_d, vessels_d, traversals_d) {
        if (error) throw error;

        ExecuteMap(ports_d, routes_d, vessels_d, traversals_d);
    }
}