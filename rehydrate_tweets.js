dataDir = 'data/';
tweetsFilename = 'top2.csv';

width = 800;
height = 600;
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const parser = d3.timeParse("%Y/%m/%d");

var origData;
var amelie_scroll = d3.select('#amelie_scroll')
var ten_gop_scroll = d3.select('#ten_gop_scroll')

let amelie_plot = amelie_scroll.append('g')
let ten_gop_plot = ten_gop_scroll.append('g')

d3.csv(dataDir + tweetsFilename).then(function(data) {
  data.forEach(element => {drawTweet(element)});
});

function drawTweet(row) {
  var plot;
  // Populate the username
  if (row.user_key == "ameliebaldwin") {
    amelie_plot.append('tspan')
      .attr('class', 'tweet h1')
      .text("Amelie Baldwin");
    plot = amelie_plot;
  }
  else {
    ten_gop_plot.append('tpsan')
      .attr('class', 'tweet h1')
      .text("Tennessee");
    plot = ten_gop_plot;
  }

  // Populate the rest of the tweet
  plot.append('tspan')
      .attr('class', 'tweet h2')
      .text("   @" + row.user_key + " | ");
  plot.append('tspan')
      .attr('class', 'tweet h2')
      .text(convertDate(row.created_at));
  plot.append('p')
      .attr('class', 'tweet body')
      .text(row.text);
  plot.append('tspan')
      .attr('class', 'tweet h2')
      .text("Retweets: " + getCount(row.retweet_count)); // TODO add retweet/favorite icon
  plot.append('tspan')
      .attr('class', 'tweet h2')
      .text("     Favorites: " + getCount(row.favorite_count));
  plot.append('hr')
}

// Converts a unicode time string to a date of format 'Oct 30, 2016'
  function convertDate(datestr) {
    var date = new Date(parseFloat(datestr));
    var year =  date.getFullYear();
    return monthNames[date.getMonth()] + " " + date.getDate() + ", " + year;
  }

// Handles null values for tweet and favorite count
  function getCount(count) {
    if (count == 0) return 0;
    else return count;
  }






