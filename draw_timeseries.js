dataDir = 'data/';
tweetsFilename = 'top2.csv';

let smallHeight = 300;
var x0 = 0;
var x1 = 0;
var scroll0 = 0;
var maxScroll = d3.select("#amelie_scroll").node().scrollHeight

var amelie = d3.select('#amelie_time')
  .attr('width', outerWidth)
  .attr('height', smallHeight + 2 * plotMargin); 
var ten_gop = d3.select('#ten_gop_time')
  .attr('width', outerWidth)
  .attr('height', smallHeight + 2 * plotMargin); 

let amelie_t= amelie.append('g')
  .attr('transform', `translate(${plotMargin},${plotMargin})`); 
let ten_gop_t= ten_gop.append('g')
  .attr('transform', `translate(${plotMargin},${plotMargin})`); 

var x2 = d3.scaleTime()
  .domain([new Date("2016-02-01"), new Date("2017-03-31")])
  .range([0, plotWidth]);

var y2 = d3.scaleLinear()
  .domain([0, 834])
  .range([smallHeight, 0])

/*var yAxis_t = d3.axisLeft(y2)
    .tickFormat(function(d) { return "e" + formatPower(Math.round(Math.log(d))); });

amelie_t.append("g")
    .attr("class", "axis axis--y")
    .attr("transform", "translate(-10,0)")
    .call(yAxis_t);*/

// Append the axes
amelie_t.append('g')
  .attr('transform', `translate(0,${smallHeight})`)
  .call(d3.axisBottom(x2))
  .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");
ten_gop_t.append('g')
  .attr('transform', `translate(0,${smallHeight})`)
  .call(d3.axisBottom(x2))
  .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

amelie_t.append('g')
  .call(d3.axisLeft(y2));
ten_gop_t.append('g')
  .call(d3.axisLeft(y2));


// y-axis label
amelie_t.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - plotMargin)
  .attr("x",0 - (smallHeight / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .style("font-family", font)
  .text("Tweets");  
ten_gop_t.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - plotMargin)
  .attr("x",0 - (smallHeight / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .style("font-family", font)
  .text("Tweets"); 

// Create x-axis brush
var brush = d3.brushX()
    .extent([[0, 0], [plotWidth, smallHeight]])
    .on("brush", brushed);

amelie_t.append("g")
  .attr("class", "brush")
  .call(brush) // initialize brush to 2-week range
  .call(brush.move, [x2(new Date("2016-02-01")), x2(new Date("2016-02-14"))]);

ten_gop_t.append("g")
  .attr("class", "brush")
  .call(brush) // initialize brush to 2-week range
  .call(brush.move, [x2(new Date("2016-02-01")), x2(new Date("2016-02-14"))]);

d3.selectAll('.brush>.handle').remove();
d3.selectAll('.brush>.overlay').remove();

// https://bl.ocks.org/EfratVil/5edc17dd98ece6aabc9744384e46f45b
// Initialize the brush to Feb-March 2016
//amelie_t.call(brush)
  //  .call(brush.move, [x2(new Date("2016-02-01")), x2(new Date("2016-02-07"))]);


d3.csv('data/amelie_count.csv').then(function(data) {
  amelie_t.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line_context)
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("fill", "steelblue")
    .attr("fill-opacity", .5);
});

d3.csv('data/ten_gop_count.csv').then(function(data) {
  ten_gop_t.append("path")
    .datum(data)
    .attr("class", "line")
    .attr("d", line_context)
    .attr("stroke", "steelblue")
    .attr("stroke-width", 2)
    .attr("fill", "steelblue")
    .attr("fill-opacity", .5);
});


var line_context = d3.line()
    .x(function(d) { return x2(new Date(d.date)); })
    .y(function(d) { return y2(+d.count); 
    });

// Update the scroll on brush
function brushed() {
  const selection = d3.event.selection;
  x_val = x2.invert(selection[0]); // get ths date associated with the beginning of the brush range
  console.log("start date ", x_val);

  deltax = x1-x0;
      
  //move scroller to starting scroll value + change in x
  //the Math.min is probably unneccesary since it will automatically
  //stop the scroller at the end of the div
  d3.select("#amelie_scroll").property("scrollTop",Math.min(scroll0 + deltax, maxScroll))
}
