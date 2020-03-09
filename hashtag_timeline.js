dataDir = 'data/';
tweetsFilename = 'tweets.csv';
hashtagFilename = 'hashtags_by_day.json'

timelineWidth = 800;
timelineHeight = 600;
const FONT_SIZE_MAX = 100;

var frequency_list = [{"text":"study","size":40},{"text":"motion","size":15}];

var grayscaleFill = d3.scaleLinear()
              .domain([0,1,2,3,4,5,6,10,15,20,100])
              .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

var fill = d3.scaleOrdinal(d3.schemeCategory10);

var origData;
var svg = d3.select('#hashtag-timeline-container').append('svg')
            .attr('width', timelineWidth)
            .attr('height', timelineHeight);

/*d3.csv(dataDir + tweetsFilename, function(d) {
  return {
    tweetID: d.tweet_id,
    text: d.text,
    retweeted: d.retweeted
    //preprocessed_text: +d.preprocessed_text
  };
}).then(function(data) {
  origData = data;
  
  drawHashtagTimeline(origData);
});*/

d3.json(dataDir + hashtagFilename).then(function(data) {
  console.log(data);
  origData = data;
  const defaultData = origData["2015-07-17"];
  drawHashtagTimeline(defaultData);
});

function getFontSize(d) {
  //return Math.sqrt(d.size * 100);
  return FONT_SIZE_MAX * d.norm_size;
}

function drawHashtagTimeline(data) {
  d3.layout.cloud().size([timelineWidth, timelineHeight])
    .words(data)
    .rotate(0)
    .padding(10)
    .fontSize(function(d) { return getFontSize(d); })
    .on("end", draw)
    .start();
}

// Generate wordcloud credits: http://using-d3js.com/07_01_word_clouds.html
function draw(words) {
  svg.attr("class", "wordcloud")
     .append("g")
     // without the transform, words words would get cutoff to the left and top, they would
     // appear outside of the SVG area
     .attr("transform", "translate(" + d3.layout.cloud().size()[0] + "," + d3.layout.cloud().size()[1] + ")")
     .selectAll("text")
     .data(words)
     .attr("text-anchor", "middle")
     .enter().append("text")
     .style("font-size", function(d) { return getFontSize(d) - 10 + "px"; })
     .style("font-family", "Avenir")
     .style("fill", function(d, i) { return fill(i); })
     .attr("transform", function(d) {
         return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
     })
     .text(function(d) { return d.text; });
}

