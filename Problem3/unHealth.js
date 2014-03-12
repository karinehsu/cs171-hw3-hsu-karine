var bbDetail, bbOverview, dataSet, svg;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 150
};

var width = 960 - margin.left - margin.right;

var height = 800 - margin.bottom - margin.top;



bbOverview = {
    x: 0,
    y: 10,
    w: width,
    h: 50
};

bbDetail = {
    x: 0,
    y: 100,
    w: width,
    h: 300
};

var x = d3.scale.linear()
    .range([0, bbOverview.w + 50]);

var y = d3.scale.linear()
    .range([bbOverview.h + 30, 0]);

var x1 = d3.scale.linear()
    .range([0, bbDetail.w]);

var y1 = d3.scale.linear()
    .range([bbDetail.h, 0]);
    
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
.x(function(d) { return x(d.date); })
.y(function(d) { return y(d.health); });


var area = d3.svg.area()
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.health); });

dataSet = [];

svg = d3.select("#visUN").append("svg").attr({
    width: width + margin.left + margin.right,
    height: height + margin.top + margin.bottom
}).append("g").attr({
        transform: "translate(" + margin.left + "," + margin.top + ")"
    });

var parseDate = d3.time.format("%Y%m%d").parse;


d3.csv("UN.csv", function(data) {


     data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.health = +d.health;
    
    });

     dataSet = data;
     console.log(dataSet);
    
  x.domain(d3.extent(dataSet, function(d) { return d.date; }));
  y.domain(d3.extent(dataSet, function(d) { return d.health; }));



  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + .1*height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Women's Health");

  svg.append("path")
      .datum(dataSet)
      .attr("class", "line")
      .attr("d", line);

  svg.append("path")
      .datum(dataSet)
      .attr("class", "area")
      .attr("d", area);

    // dataSet.forEach(function(d) {
    //   d.date = parseDate(d.date);
    // });

    

});

// var convertToInt = function(s) {
//     return parseInt(s.replace(/,/g, ""), 10);
// };

