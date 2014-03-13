var bbDetail, bbOverview, dataSet, svg;

var margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 100
};

var width = 960 - margin.left - margin.right;

var height = 900 - margin.bottom - margin.top;

bbOverview = {
    x: 0,
    y: 10,
    w: width,
    h: 50
};

bbDetail = {
    x: bbOverview.x,
    y: 100,
    w: width,
    h: 300
};
dataSet = [];
var color = d3.scale.category10();


var ranks = [];

d3.csv("UN.csv", function(data) {


  var parseDate = d3.time.format("%Y%d%m").parse;

     data.forEach(function(d) {
      d.date = parseDate(d.date);
      d.health = +d.health;
    
    });

     dataSet = data;
     console.log(dataSet);


  var min_year = d3.min(dataSet,function(d){return d.date;});
  var max_year = d3.max(dataSet,function(d){return d.date;});
  var min_health = d3.min(dataSet,function(d){return d.health;});
  var max_health = d3.max(dataSet,function(d){return d.health;});

  var chart1 = d3.select("#linegraph")
    .append("svg")
    .append("g")
    .attr({transform: "translate(" + margin.left + "," + margin.top + ")"});

  var chart2 = chart1
    .append("svg")
    .append("g");

//sets x scale and y scale
var x = d3.time.scale()
    .domain([min_year,max_year])
    .range([bbOverview.x, bbOverview.w]);


var y = d3.scale.linear()
    .domain([0, max_health])
    .range([bbOverview.h, bbOverview.y]);

//set x1 and y1 scale for area graph
var x1 = d3.time.scale()
    .domain([min_year,max_year])
    .range([bbDetail.x, bbDetail.w]);

var y1 = d3.scale.linear()
  .domain([0, max_health])  
  .range([bbDetail.h, bbDetail.y]);
    
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(d3.time.months,3);

// sets xAxis for area chart   
var xAxis1 = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .ticks(d3.time.months,3);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(3);

var yAxis1 = d3.svg.axis()
    .scale(y1)
    .orient("left");


var line = d3.svg.line()
.x(function(d) { return x(d.date); })
.y(function(d) { return y(d.health); });

// add area chart
var area = d3.svg.area()
    .x(function(d) { return x1(d.date); })
    .y0(bbDetail.h)
    .y1(function(d) { return y1(d.health); });

  chart1.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + bbOverview.h + ")")
      .call(xAxis);

  chart1.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  chart1.append("path")
      .datum(dataSet)
      .attr("class", "line")
      .attr("d", line);

  var point = chart1.append("g")
      .attr("class", "line-point");

      point.selectAll('circle')
      .data(dataSet)
        .enter().append('circle')
        .attr("cx", function(d) { return x(d.date) })
        .attr("cy", function(d) { return y(d.health) })
        .attr("r", 2)
        .style("fill", "blue");


  chart2.append("path")
      .datum(dataSet)
      .attr("class", "area")
      .attr("d", area);

  // add points to lines
  var point = chart2.append("g")
      .attr("class", "line-point");

      point.selectAll('circle')
      .data(dataSet)
        .enter().append('circle')
        .attr("cx", function(d) { return x(d.date) })
        .attr("cy", function(d) { return y1(d.health) })
        .attr("r", 2)
        .style("fill", "blue");

      chart2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + bbDetail.h + ")")
        .call(xAxis1);

      chart1.append("g")
        .attr("class", "y axis")
        .call(yAxis1);

      chart1.append("defs").append("clipPath")
        .attr("id", "clip")
      .append("rect")
        .attr("width", width)
        .attr("height", height);

// add brushed function
  function brushed() {
    x1.domain(brush.empty() ? x.domain() : brush.extent());
    chart1.select(".area").attr("d", area);
    point.selectAll('circle')
      .attr("cx", function(d) { return x1(d.date) })
      .attr("cy", function(d) { return y1(d.health) })
    d3.select(".x axis").call(xAxis);
    }


  var brush = d3.svg.brush().x(x).on("brush", brushed);
  
  // calls brush functionality
  chart1.append("g").attr("class", "brush").call(brush)
  .selectAll("rect").attr({
  height: bbOverview.h,
  transform: "translate(0,0)"
  });



});



