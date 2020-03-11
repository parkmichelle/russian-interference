dataDir = 'data/';
tweetsFilename = 'top2.csv';

width = 800;
height = 600;

var origData;
var amelie_scroll = d3.select('#amelie_scroll')
var ten_gop_scroll = d3.select('#ten_gop_scroll')

let amelie_plot = amelie_scroll.append('g')
let ten_gop_plot = ten_gop_scroll.append('g')

d3.csv(dataDir + tweetsFilename).then(function(data) {
  amelieData = [];
  tenGopData = [];
  data.forEach(element => {
    //if (element.user_key == "ameliebaldwin") amelieData.append(element);
    //else tenGopData.append(element);
    drawTweet(element)
  });
  
  //drawTweets(origData);
});

// Generate wordcloud credits: http://using-d3js.com/07_01_word_clouds.html
function drawTweet(row) {
  var id = "#";
  var plot;
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
  plot.append('tspan')
      .attr('class', 'tweet h2')
      .text("   @" + row.user_key + " | ");
  plot.append('tspan')
      .attr('class', 'tweet h2')
      .text(row.created_str);
  plot.append('p')
      .attr('class', 'tweet body')
      .text(row.text);
  plot.append('tspan')
      .attr('class', 'tweet h2')
      .text("Retweets: " + row.retweet_count);
  plot.append('tspan')
      .attr('class', 'tweet h2')
      .text("     Favorites: " + row.favorite_count);
  plot.append('hr')

  /*let text = plot.selectAll('text');
  let updatedText = text.data(tweetData, d => d.text);

  let enterSelection = updatedText.enter();
  let newText = enterSelection.append('text')
          .attr('x', 50)
          .attr('y', 50)
          .style('font-size', 12);
  updatedText.exit().remove();*/
}






