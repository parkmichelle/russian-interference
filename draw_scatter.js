// Set size of the plot and spacing around it (for axes!)
let plotWidth = 500;
let plotHeight = 500;
let plotMargin = 75;
let subtitleHeight = 0 - (plotMargin / 6);
let outerWidth = plotWidth + 2 * plotMargin;
let outerHeight = plotHeight + 2 * plotMargin; 
let zoomK = 1;
var allUserData;
var new_xScale;
var new_yScale;

const font = "Work Sans";
const newsNames = ["darknally", "DailySanFran", "ChicagoDailyNew", "OnlineMemphis", 
"DetroitDailyNew", "KansasDailyNews", "TodayPittsburgh", "PhiladelphiaON", "DailyLosAngeles", 
"WashingtOnline", "TodayNYCity", "OnlineCleveland", "PhoenixDailyNew", "SanAntoTopNews", "Baltimore0nline", 
"StLouisOnline", "RichmondVoice", "NewarkVoice", "BatonRougeVoice", "blackmattersus", "NewOrleansON", "ElPasoTopNews", 
"TodayCincinnati", "TodayBostonMA", "Seattle_Post", "HoustonTopNews", "DailySanDiego", "DallasTopNews", "Atlanta_Online", 
"TodayMiami", "OaklandOnline", "nj_blacknews", "riafanru", "PigeonToday"]
var clicked = false;


let wholeChart = d3.select('#users-overview'); 
// Create a `g` element to our SVG
let plot = wholeChart.append('g')
  .attr('transform', `translate(${plotMargin},${plotMargin})`); 

var tooltip = d3.select(".tooltip");

var tipMouseover = function(d) {
    d3.select(this).style("cursor", "pointer"); 
    var html  = "<span class='tooltip-header'>" + "@" + d.screen_name + "</span>" + 
    "<br/>" + "Followers: " + "<span class='tooltip-text'>" + 
    d.followers_count + "</span>"+ "<br/>" + "Favorites: " + "<span class='tooltip-text'>"
    + d.favourites_count + "</span>" + "<br/>" + "Tweets: " + "<span class='tooltip-text'>"
    + d.statuses_count + "</span>";
    tooltip.html(html)
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 60) + "px")
      .transition()
        .duration(0) // ms
        .style("opacity", .9) // started as 0!
};
// tooltip mouseout event handler
var tipMouseout = function(d) {
    d3.select(this).style("cursor", "default"); 
    tooltip.transition()
        .duration(0) // ms
        .style("opacity", 0); // don't care about position!
};

// Create our scales, each of which will map data to the size of our plot
let xScale = d3.scaleLinear()
  .domain([0, 100000])
  .range([0, plotWidth])
let yScale = d3.scaleLinear()
  .domain([0, 27200])
  .range([plotHeight, 0]); 

// Draw our axes based on xScale and yScale
let xAxis = plot.append('g')
  .attr('transform', `translate(0,${plotHeight})`)
  .call(d3.axisBottom(xScale));
let yAxis = plot.append('g')
  .call(d3.axisLeft(yScale));

var zoom = d3.zoom().on("zoom", (d) => {
            // Transform the axes
            new_xScale = d3.event.transform.rescaleX(xScale);
            new_yScale = d3.event.transform.rescaleY(yScale);
            xAxis.call(d3.axisBottom(new_xScale));
            yAxis.call(d3.axisLeft(new_yScale));
            d3.selectAll('circle').data(allData)
              .attr('cx', function(d) {return new_xScale(d.followers_count);})
              .attr('cy', function(d) {return new_yScale(d.favourites_count);})
              .attr('r', function(d) {
                // Doesn't draw dots that are now out of bounds
                var new_x = new_xScale(d.followers_count);
                var new_y = new_yScale(d.favourites_count);
                if (new_x < 0 || new_x > plotWidth) return 0;
                if (new_y > plotHeight || new_y < 0) return 0;
                return 1.5/(Math.pow(d3.event.transform.k, .1)) * getRadius(d);
              })
              .style('stroke-width', function() {
                if (this.style.strokeWidth && this.style.strokeWidth !== "0") return 1.5/(Math.sqrt(d3.event.transform.k*0.5));
                return 0;
              });
              // Replace "Scroll to Zoom" with "Reset Zoom"
              subtitle.remove();
              reset_btn = plot.append("text")
                .attr("x", (plotWidth / 2))             
                .attr("y", subtitleHeight)
                .attr("text-anchor", "middle")  
                .style("font-size", "16px") 
                .style("font-style", "italic")
                .style("fill", "steelblue")
                .style("font-family", font)  
                .text("Reset Zoom")
                .on("click", () => {
                plot.transition()
                  .duration(750)
                  .call(zoom.transform, d3.zoomIdentity);
                });

        })
        .scaleExtent([0, 5]);
        //.translateExtent([-plotWidth, -plotHeight], [outerWidth, outerHeight])); 

wholeChart
  .attr('width', outerWidth)
  .attr('height', outerHeight)
  .call(zoom);

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
  .attr("x", (plotWidth / 2))             
  .attr("y", 0 - (plotMargin / 2))
  .attr("text-anchor", "middle")  
  .style("font-size", "24px") 
  .style("font-family", font)  
  .text("Popularity of Troll Profiles");

// Add subtitle
var subtitle = plot.append("text")
  .attr("x", (plotWidth / 2))             
  .attr("y", subtitleHeight)
  .attr("text-anchor", "middle")  
  .style("font-size", "16px") 
  .style("font-style", "italic")
  .style("fill", "gray")
  .style("font-family", font)  
  .text("Scroll to zoom");

d3.csv('data/users.csv').then(function(data){
    window.allData = data;
    data.forEach(element => {
      parseInputRow(element);
    });
    drawScatterPlot(data);
}); 

d3.csv('data/filteredNews.csv').then(function(data){
    window.newsNames = data;
    data.forEach(element => {
      parseInputRow(element);
    });
}); 

var scroll = d3.select('#fakenews_scroll');
var bio_label = d3.select('#bio_label');

let scroll_plot = scroll.append('g');
var bio_plot = bio_label.append('g');

  scroll_plot.append('div')
      .attr('class', 'tweet body')
      .text("Click a user to see their Twitter bio.");

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
    allUserData = userData;
    let circles = plot.selectAll('circle'); 
    let updatedCircles = circles.data(userData, d => d.id); 
    let enterSelection = updatedCircles.enter();
    let newCircles = enterSelection.append('circle')
      // Uses an exponent because # statuses scales exponentially
      .attr('r', function (d) { return getRadius(d); })
      .attr('cx', function (d) { return xScale(d.followers_count); })
      .attr('cy', function (d) { return yScale(d.favourites_count); })
      .attr("fill-opacity","0")
      .style("stroke","steelblue")
      .style("stroke-width","2px")
      .on("mouseover", tipMouseover)
      .on("mouseout", tipMouseout)
      .on("click", showBio);
    if (clicked) {
      updatedCircles.exit()
        .attr("stroke-opacity",".2")
        .on("mouseover", null)
        .on("mouseout", null)
        .on("click", null);
    }
  else {
    plot.selectAll('circle')
      .attr("stroke-opacity", "1")
      .on("mouseover", tipMouseover)
      .on("mouseout", tipMouseout)
      .on("click", showBio);
    }
};

  let newsToggle = document.querySelectorAll('#news');
  newsToggle.forEach(function(item) {
    item.addEventListener('change', function() {
      if (!clicked) {
         clicked = true;
         let newData = allData;
         newData = allData.filter(function(d) {
           if (newsNames.includes(d.screen_name)) {
           }
           return newsNames.includes(d.screen_name);
         });
         drawScatterPlot(newData);
       }
      else {
        clicked = false;
        drawScatterPlot(allData);
      }
    });
  });

// Given an entry d, returns the radius of the point representing d
function getRadius(d) {
  if (d.statuses_count == null) return 0;
  return Math.pow(d.statuses_count, .85)*.001;
}
// Displays the bio of the clicked account
var showBio = function(d) {
  scroll_plot.selectAll('div').remove();
  bio_plot.select('span').remove();

  bio_plot.append('span')
    .text(": @" + d.screen_name);

  scroll_plot.append('div')
    .attr('class', 'tweet-header')
    .text(d.name);
  scroll_plot.append('div')
      .attr('class', 'handle')
      .text("@" + d.screen_name);
  scroll_plot.append('div')
      .attr('class', 'tweet body')
      .text(d.description);
};


