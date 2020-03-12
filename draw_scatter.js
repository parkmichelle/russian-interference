// Set size of the plot and spacing around it (for axes!)
let plotWidth = 500;
let plotHeight = 500;
let plotMargin = 75;
let outerWidth = plotWidth + 2 * plotMargin;
let outerHeight = plotHeight + 2 * plotMargin; 

const font = "Work Sans";

let wholeChart = d3.select('#users-overview'); 
wholeChart
  .attr('width', outerWidth)
  .attr('height', outerHeight); 
// Create a `g` element to our SVG
let plot = wholeChart.append('g')
  .attr('transform', `translate(${plotMargin},${plotMargin})`); 

var tooltip = d3.select(".tooltip");

var tipMouseover = function(d) {
    var html  = "<span class='tooltip-header'>" + "@" + d.screen_name + "</span>" + 
    "<br/>" + "Followers: " + "<span class='tooltip-text'>" + 
    d.followers_count + "</span>"+ "<br/>" + "Favorites: " + "<span class='tooltip-text'>"
    + d.favourites_count + "</span>";
    tooltip.html(html)
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 60) + "px")
      .transition()
        .duration(0) // ms
        .style("opacity", .9) // started as 0!
};
// tooltip mouseout event handler
var tipMouseout = function(d) {
    tooltip.transition()
        .duration(0) // ms
        .style("opacity", 0); // don't care about position!
};

// Create our scales, each of which will map data to the size of our plot
let xScale = d3.scaleLinear()
  .domain([0, 100000])
  .range([0, plotWidth])
let yScale = d3.scaleLinear()
  .domain([0, 25000])
  .range([plotHeight, 0]); 

// Draw our axes based on xScale and yScale
let xAxis = plot.append('g')
  .attr('transform', `translate(0,${plotHeight})`)
  .call(d3.axisBottom(xScale));
let yAxis = plot.append('g')
  .call(d3.axisLeft(yScale)); 

// label the axes
plot.append("text")             
.attr("transform", `translate(${plotWidth/2}, ${plotHeight + 35})`)
.style("text-anchor", "middle")
.style("font-family", font)
.text("Followers"); 
plot.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - plotMargin)
  .attr("x",0 - (plotHeight / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .style("font-family", font)
  .text("Favorites on Tweets");     

// Add title
plot.append("text")
  .attr("x", (width / 3))             
  .attr("y", 0 - (plotMargin / 2))
  .attr("text-anchor", "middle")  
  .style("font-size", "24px") 
  .style("font-family", font)  
  .text("Popularity of Troll Profiles");

d3.csv('data/users.csv').then(function(data){
    window.allData = data;
    data.forEach(element => {
      parseInputRow(element);
    });
    drawScatterPlot(data);
}); 

// Convert values from strings to numbers
function parseInputRow(d) {
  return {
    id: +d.id,
    followers_count: +d.followers_count,
    statuses_count: +d.statuses_count,
    favourites_count: +d.favourites_count,
    screen_name: d.screen_name
  };
};

function drawScatterPlot(userData) {
  let circles = plot.selectAll('circle'); 
  let updatedCircles = circles.data(userData, d => d.id); 
  let enterSelection = updatedCircles.enter();
  let newCircles = enterSelection.append('circle')
    // Uses an exponent because # statuses scales exponentially
    .attr('r', function (d) { return Math.pow(d.statuses_count, .9)*.0005; })
    .attr('cx', function (d) { return xScale(d.followers_count); })
    .attr('cy', function (d) { return yScale(d.favourites_count); })
    .attr("fill-opacity","0")
    .style("stroke","steelblue")
    .style("stroke-width","2px")
    .on("mouseover", tipMouseover)
    .on("mouseout", tipMouseout);
  updatedCircles.exit().remove();

};
