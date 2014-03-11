/**
 * Created by hen on 2/20/14.
 */
    var bbVis, brush, createVis, dataSet, handle, height, margin, svg, svg2, width;

    margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 150
    };

    width = 960 - margin.left - margin.right;

    height = 300 - margin.bottom - margin.top;

    bbVis = {
        x: 0 + 100,
        y: 10,
        w: width - 100,
        h: 100
    };

    dataSet = [];

    svg = d3.select("#vis").append("svg").attr({
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom
    }).append("g").attr({
            transform: "translate(" + margin.left + "," + margin.top + ")"
        });


    d3.csv("data.csv", function(data) {

        dataSet = data;
        console.log(dataSet);// convert your csv data and add it to dataSet

        return createVis();
    });

    createVis = function() {
        var xAxis, xScale, yAxis,  yScale, line;

        var visFrame = svg.append("g").attr({
              "transform": "translate(" + bbVis.x + "," + (bbVis.y + bbVis.h) + ")",
              //....

          });

          visFrame.append("rect");

        xScale = d3.scale.linear().range([0, bbVis.w]);  // define the right domain generically
        yScale = d3.scale.linear().range([height,0]) // define the right y domain and range -- use bbVis

        xScale.domain(d3.extent(dataSet, function(d,i) { return d.year; }));
        yScale.domain(d3.extent(dataSet, function(d,i) { return d.USCensus; }));

        //form axes
        xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");
       
        yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");

        line = d3.svg.line()
        .x(function(d,i) { return xScale(d.year); })
        .y(function(d,i) { return yScale(d.USCensus); });

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("World Population Estimate");

        svg.append("path")
        .datum(dataSet)
        .attr("class", "line")
        .attr("d", line);
        //.attr("fill", "none");

        //d3.select('line').style('fill','none');
    };
