dataDir = 'data/';
tweetsFilename = 'top2.csv';

width = 800;
height = 600;

amelie_dates = [];
ten_gop_dates = [];
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const parser = d3.timeParse("%Y/%m/%d");

var origData;
var amelie_scroll = d3.select('#amelie_scroll')
var ten_gop_scroll = d3.select('#ten_gop_scroll')

let amelie_plot = amelie_scroll.append('g')
let ten_gop_plot = ten_gop_scroll.append('g')

// Creates an array of ordered dates of posts for ameliebaldwin
d3.csv('data/amelie_only.csv').then(function(data) {
  data.forEach(element => {
    d = new Date(element.date);
    d.setUTCHours(0, 0, 0, 0);
    amelie_dates.push(d);
  });
});

// Creates an array of ordered dates of posts for ten_gop
d3.csv('data/ten_gop_only.csv').then(function(data) {
  data.forEach(element => {
    d = new Date(element.date);
    d.setUTCHours(0, 0, 0, 0);
    ten_gop_dates.push(d);
  });
});


/*d3.csv(dataDir + 'small_top2.csv', function(data) {
  d3.csv(dataDir + 'small_top2.csv', function(data) {
    d3.csv(dataDir + 'small_top2.csv', function(data) {
      drawTweet(data);
    });
    drawTweet(data);
  });
  drawTweet(data);
});*/

// Draws all tweets for both users
d3.csv(dataDir + tweetsFilename, function(data) {
    drawTweet(data);
});

amelie_scroll.on("scroll.scroller", function() { updateDotA(); });
ten_gop_scroll.on("scroll.scroller", function() { updateDotT(); });


function drawTweet(row) {
  var plot;
  // Populate the username
  //console.log("scroll top amelie: ", amelie_scroll.node().scrollTop);

  if (row.user_key == "ameliebaldwin") {
    amelie_plot.append('tspan')
      .attr('class', 'tweet h1')
      .attr('loading', 'lazy')
      .text("Amelie Baldwin");
    plot = amelie_plot;
  }
  else {
    ten_gop_plot.append('tpsan')
      .attr('class', 'tweet h1')
      .attr('loading', 'lazy')
      .text("Tennessee");
    plot = ten_gop_plot;
  }

  // Populate the rest of the tweet
  plot.append('tspan')
      .attr('class', 'tweet h2')
      .attr('loading', 'lazy')
      .text("   @" + row.user_key + " | ");
  plot.append('tspan')
      .attr('class', 'tweet h2')
      .attr('loading', 'lazy')
      .text(convertDate(row.created_at));
  plot.append('p')
      .attr('class', 'tweet body')
      .attr('loading', 'lazy')
      .text(row.text);
  plot.append('tspan')
      .attr('class', 'tweet h2')
      .attr('loading', 'lazy')
      .text("Retweets: " + getCount(row.retweet_count));
  plot.append('tspan')
      .attr('class', 'tweet h2')
      .attr('loading', 'lazy')
      .text("     Favorites: " + getCount(row.favorite_count));
  plot.append('hr')
      .attr('loading', 'lazy');
}

// Converts a unicode time string to a date of format 'Oct 30, 2016'
  function convertDate(datestr) {
    var date = new Date(parseFloat(datestr));
    var year =  date.getFullYear();
    return monthNames[date.getMonth()] + " " + date.getDate() + ", " + year;
  }

// Handles null values for tweet and favorite count
  function getCount(count) {
    if (count == 0 || count == null || count == undefined) return 0;
    else return count;
  }

// Redraws position of the floating dot when user scrolls through tweets
function updateDotA() {
  // Calculates which date should be top based on average pixels per tweet (height)
  index = Math.floor(amelie_scroll.node().scrollTop / (amelie_scroll.node().scrollHeight/amelie_dates.length));
  topdate = amelie_dates[index];

  amelie_t.selectAll('circle').remove();
  amelie_t.append("svg")
    .append('circle')
    .attr('cx', function() {return x2(topdate);})
    .attr('cy', function() {return y2(amelie_counts[topdate])})
    .attr('r', dotRadius)
    .style('fill', 'gold')
    .style('stroke', 'goldenrod')
    .style('opacity', .7);
}

function updateDotT() {
  // Calculates which date should be top based on average pixels per tweet (height)
  index = Math.floor(ten_gop_scroll.node().scrollTop / (ten_gop_scroll.node().scrollHeight/ten_gop_dates.length));
  topdate = ten_gop_dates[index];

  ten_gop_t.selectAll('circle').remove();
  ten_gop_t.append("svg")
    .append('circle')
    .attr('cx', function() {return x2(topdate);})
    .attr('cy', function() {return y2(ten_gop_counts[topdate]);})
    .attr('r', dotRadius)
    .style('fill', 'gold')
    .style('stroke', 'goldenrod')
    .style('opacity', .7);
}






