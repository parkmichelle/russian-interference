const FONT_SIZE_MAX = 120;
const FIRST_TWEET_DATE = "2014-07-14";
const LAST_TWEET_DATE = "2017-09-26";
const ELECTION_DATE = "2016-11-08";
const TEST_DATE_EMOJI = "2015-07-17";
const TEST_DATE = "2015-12-08";
const DEFAULT_TWEET_DATE = TEST_DATE;
const BUF = 1000;

dataDir = 'data/';
tweetsFilename = 'tweets.csv';
hashtagFilename = 'hashtags_by_day.json'

timelineWidth = 600;
timelineHeight = 600;

var grayscaleFill = d3.scaleLinear()
              .domain([0,1,2,3,4,5,6,10,15,20,100])
              .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

var fill = d3.scaleOrdinal(d3.schemeCategory10);

var dateHashtagsMap;
var svg = d3.select('#hashtag-timeline-container').append('svg')
            .attr('width', timelineWidth + BUF)
            .attr('height', timelineHeight + BUF);

/*d3.csv(dataDir + tweetsFilename, function(d) {
  return {
    tweetID: d.tweet_id,
    text: d.text,
    retweeted: d.retweeted
    //preprocessed_text: +d.preprocessed_text
  };
}).then(function(data) {
  dateHashtagsMap = data;
  
  drawHashtagTimeline(dateHashtagsMap);
});*/

d3.json(dataDir + hashtagFilename).then(function(data) {
  dateHashtagsMap = data;
  const lowData = dateHashtagsMap['2015-11-11'];
  //drawHashtagTimeline(lowData);
  const mediumData = dateHashtagsMap[DEFAULT_TWEET_DATE];
  drawHashtagTimeline(mediumData);
  setTimeout(function(){
    //do what you need here
  drawHashtagTimeline(highData);
}, 2000);
  const highData = dateHashtagsMap[ELECTION_DATE];
});

function getFontSize(data, d) {
/*  const minFont = 6;
  const maxFont = 120;
  var fontSizeScale = d3.scalePow().exponent(5).domain([0,1]).range([ minFont, maxFont]);
  var maxSize = d3.max(data, function (d) {return d.size;});
  return fontSizeScale(d.size/maxSize);*/

  return Math.sqrt(d.size * 30);
  //return FONT_SIZE_MAX * d.norm_size;
}

// Wordcloud sample code credit: https://kapilddatascience.wordpress.com/2015/05/26/how-to-make-a-word-cloud-using-d3-library/
function drawHashtagTimeline(data) {
  d3.layout.cloud()
    .size([timelineWidth, timelineHeight])
    .words(data.map(function(d) {
            return {text: d.text, size: d.norm_size * 100};}))
    .padding(5)
    .rotate(function() { return ~~(Math.random() * 0) * 90; })
    .font("Avenir")
    .fontSize(function(d) { return d.size; })
    .on("end", draw)
    .start();
}

function draw(words) {
    svg.attr("width", timelineWidth)
      .attr("height", timelineHeight)
      .append("g")
        .attr("transform", "translate(300,300)")
      .selectAll("text")
        .data(words)
        .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Avenir")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
}

$("#slider").dateRangeSlider({
  bounds:{
    min: Date.parse(FIRST_TWEET_DATE),
    max: Date.parse(LAST_TWEET_DATE)
  },
  defaultValues:{
    min: Date.parse(TEST_DATE),
    max: Date.parse(ELECTION_DATE)
  }
});

$("#slider").on("valuesChanging", function (e, data) {
  var startDate = data.values.min;
  var endDate = data.values.max;

  // Get new word counts
  var now = new Date();
  var hashtagBatch = [];
  for (var d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    var dateStr = d.toISOString().split('T')[0];
    hashtagBatch = hashtagBatch.concat(dateHashtagsMap[dateStr]);
  }

  // Reduce example credits: https://stackoverflow.com/questions/46664213/
  // how-to-group-or-merge-this-array-of-objects-in-javascript
  var squashedHashtagBatch = hashtagBatch.reduce((m, o) => {
      var found = m.find(p => p.text === o.text);
      if (found) {
          found.size += o.size;
          found.norm_size += o.norm_size;
      } else {
          m.push(o);
      }
      return m;
  }, []);

  // Updates normalized size of given hashtag objects in place
  function normalizeSize(hashtagObjs) {
    const sum = hashtagObjs.reduce(function(prev, cur) {
      return prev + cur.size;
    }, 0);
    hashtagObjs.map(function(hashtagObj) {
      if (hashtagObj.size !== 0) {
        hashtagObj.norm_size /= sum;
      }
    });
  }
  normalizeSize(squashedHashtagBatch);

  wordcloud('#hashtag-timeline-container');
  // Squash counts
  // Update wordcloud
});

