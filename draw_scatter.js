// Set size of the plot and spacing around it (for axes!)
let plotWidth = 500;
let plotHeight = 500;
let plotMargin = 75;
let outerWidth = plotWidth + 2 * plotMargin;
let outerHeight = plotHeight + 2 * plotMargin; 
// Select the `<svg id="animal-viz"></svg>` DOM node
let wholeChart = d3.select('#users-overview'); 
wholeChart
  .attr('width', outerWidth)
  .attr('height', outerHeight); 
// Create a `g` element to our SVG: we'll work with this for our plot
let plot = wholeChart.append('g')
  .attr('transform', `translate(${plotMargin},${plotMargin})`); 
// Create our scales, each of which will map data from 0-10 to the size of our plot
let xScale = d3.scaleLinear()
  .domain([0, 100000])
  .range([0, plotWidth]);
let yScale = d3.scaleLinear()
  .domain([0, 25000])
  .range([plotHeight, 0]); // SVG has its origin in the top left, so we need to be careful here! 
// xScale and yScale are functions:
// xScale(0) => 0; xScale(10) => 500; xScale(2) => 100
// yScale(0) => 500; yScale(10) => 0; yScale(2) => 400 
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
.text("Followers"); 
plot.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - plotMargin)
  .attr("x",0 - (plotHeight / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Favorites on Tweets");     

d3.csv('data/users.csv').then(function(data){
    window.allData = data;
    data.forEach(element => {
      parseInputRow(element);
    });
    drawScatterPlot(data);
}); 

// Convert weight and height from strings to numbers
function parseInputRow(d) {
  //console.log(d);
  return {
    id: +d.id,
    followers_count: +d.followers_count,
    statuses_count: +d.statuses_count,
    favourites_count: +d.favourites_count,
    screen_name: d.screen_name
  };
};

function drawScatterPlot(userData) {
  // Create a selection of circles in our plot (empty to start)
  let circles = plot.selectAll('circle'); 
  // Bind our animal data to the circles
  let updatedCircles = circles.data(userData, d => d.id); 
  // Can also set the id to "name"! The key for each datapoint can be anything.
  // Ideally, this key should be unique.
  // By default, D3 uses the index in the data array, in our example that won't work.
  // let updatedCircles = circles.data(animalData, d => d.name); 
  // We'll use "enter" to make circles for new datapoints (in this case, all datapoints)
  // From https://github.com/d3/d3-selection#selection_enter :
  // "The enter selection is typically used to create 'missing' elements corresponding to new data."
  // "[The selection comprises] placeholder nodes for each datum that had no corresponding DOM elementin the selection."
  // "Conceptually, the enter selection’s placeholders are pointers to the parent element"
  let enterSelection = updatedCircles.enter();
  let newCircles = enterSelection.append('circle')
    .attr('r', function (d) { return d.statuses_count * .0005; })
    .attr('cx', function (d) { return xScale(d.followers_count); })
    .attr('cy', function (d) { return yScale(d.favourites_count); })
    //.attr("fill-opacity","0.5")
    .style("stroke","midnightblue")
    .style("stroke-width",".5px")
    .style('fill', 'steelblue');
  updatedCircles.exit().remove();

};

  /*let buttons = document.querySelectorAll('button');
  for (let b of buttons) {
    b.addEventListener('click', function() {
      let newData = allData;
      if (b.dataset.filter !== 'both') {
        newData = allData.filter(d => d.animal === b.dataset.filter);
      }    
      drawScatterPlot(newData);
       });*/