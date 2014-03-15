/**
 * Created by hen on 2/20/14.
 */
    var bbVis, brush, createVis, dataSet, handle, height, margin, svg, svg2, width;
    var color = d3.scale.category10();


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

    bbDetail = {
        x: bbVis.x,
        y: 100,
        w: width,
        h: 100
    };

    var dataSet = [];
    var studies =[];


    svg = d3.select("#vis").append("svg").attr({
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom
    }).append("g").attr({
            transform: "translate(" + margin.left + "," + margin.top + ")"
        });

     var chart2 = d3.select("#linegraph")
        .append("svg")
        .attr({
        width: width + margin.left + margin.right,
        height: height + margin.top + margin.bottom
    }).append("g").attr({
            transform: "translate(" + margin.left + "," + margin.top + ")"
        });


    d3.csv("data.csv", function(data) {

        dataSet = data;
        //console.log(dataSet);
        color.domain(d3.keys(dataSet[0]).filter(function(key) { return key !== "year"; }));
          studies = color.domain().map(function(name) {
            return {
              name: name,
              values: dataSet.map(function(d) {
                return {year: +d.year, estimate: +d[name], interpolated: 0};
              })
            };
          });

          //console.log(studies);

        // goes through studies data and creates known year and estimate arrays
        studies.forEach(function(d){
            var knownYears = [];
            var knownEstimates = [];
            var standardDeviations = [];
            var average = [];
            var sum = [];
            d.values.map(function(e,i){
                if (e.estimate){
                    //console.log(e.estimate);
                    knownYears.push(e.year);
                    knownEstimates.push(e.estimate);
                    //sum += knownEstimates[i];
                   
                }
                console.log(sum);
                // for (var i =0; i <knownEstimates.length; i ++){
                //     sum += knownEstimates[i];
                // };
                // average.push(sum/knownEstimates.length);
            //console.log(knownEstimates[i].length);

            });
            console.log(knownEstimates);
            
            // calculates average estimate per year
            


            var min_year = d3.min(knownYears);
            var max_year = d3.max(knownYears);
            //console.log(max_year);

            //interpolates missing data points
             var interpolate = d3.scale.linear().domain(knownYears).range(knownEstimates);
             d.values.forEach(function(e,i){
                if ((e.estimate == 0) && (e.year > min_year && e.year < max_year)) {
                    //console.log(e.estimate);
                    e.estimate = interpolate(e.year);
                    e.interpolated = 1;
                    
                } 

                // checks if values are within range
                var a = d.values.length;
                for (j = 0; j < a; j++){
                    if (d.values[j].year < min_year || d.values[j].year > max_year){
                        d.values.splice(j,1);
                        a --; 
                        j --;
                    }
                }

               //console.log(min_year,max_year);

            });

        });

        //studies
        
        

       
            //console.log(studies);
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
        yScale.domain([
        d3.min(studies, function(c) { return d3.min(c.values, function(v) { return v.estimate; }); }),
        d3.max(studies, function(c) { return d3.max(c.values, function(v) { return v.estimate; }); })
        ]);

        //form axes
        xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom");
       
        yAxis = d3.svg.axis()
        .scale(yScale)
        .orient("left");



        var line = d3.svg.line()
        //.interpolate("linear")
        .x(function(d) { return xScale(d.year); })
        .y(function(d) { return yScale(d.estimate); });

        

        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .text("Year")
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

        chart2.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        chart2.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Standard Deviations");

        
        //.attr("fill", "none");
        var study = svg.selectAll(".study")
        .data(studies)
        .enter().append("g")
        .attr("class", "study");

        study.append("path")
        .attr("class", "line")
        
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); });

        study.append("text")
        .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + xScale(d.value.year) + "," + yScale(d.value.estimate) + ")"; })
        .attr("x", 3)
        .attr("dy", ".35em")
        .text(function(d) { return d.name; });

        //adds points to line
        var point = study.append("g")
        .attr("class", "line-point");

        point.selectAll('circle')
        .data(function(d){ return d.values})
        .enter().append('circle')
        .attr("cx", function(d) { return xScale(d.year) })
        .attr("cy", function(d) { return yScale(d.estimate) })
        .attr("r", function(d){ return 2;})

        .style("fill", function(d) { return color(this.parentNode.__data__.name);})
        .style("stroke", function(d) { return color(this.parentNode.__data__.name); })



        var std_dev = function (arr) {

        // std_dev = 0 if only one element
        if (arr.length == 1) {
        return 0;
        }

        // sum
        var sum = 0;
        arr.forEach(function (d, i) {
        sum += d;
        });

        // ave
        var ave = sum / arr.length;

        // variance
        var variance = 0;
        arr.forEach(function (d, i) {
        variance += Math.pow(d - ave, 2);
        });

        variance = variance / (arr.length - 1);

        // std dev
        return Math.sqrt(variance);

        };
        var stats = new Object;
        stats.ave = [];
        stats.years = [];
        stats.numbers = [];
        stats.count = [];
        stats.sum = [];
        stats.stddev = [];

        // grab elements_array
        data.forEach(function (d, i) {
        stats.years.push(d.year);
        stats.numbers.push([]);
        stats.count.push(0);
        stats.sum.push(0);
        stats.stddev.push(0);
        });
       
                
        
    };
