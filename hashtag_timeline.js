const NUM_WORDS_IN_CLOUD = 100;
const FONT_SIZE_MAX = 84;

const FIRST_TWEET_DATE = "2014-07-14";
const LAST_TWEET_DATE = "2017-09-26";
const ELECTION_DATE = "2016-11-08";

const DEFAULT_TWEET_DATE_MIN = "2016-04-04";
const DEFAULT_TWEET_DATE_MAX = ELECTION_DATE;

var fontScale = d3.scaleLinear().range([0, FONT_SIZE_MAX]);

const DATA_DIR = 'data/';
const HASHTAG_COUNTS_FILENAME = 'hashtags_by_day.json'

const TRANSLATE_X = 340;
const TRANSLATE_Y = 300;

const SCALE = 1;
const WORDCLOUD_WIDTH = 600 * SCALE;
const WORDCLOUD_HEIGHT = 500 * SCALE;
const WORDCLOUD_CONTAINER_WIDTH = 720 * SCALE;
const WORDCLOUD_CONTAINER_HEIGHT = 600 * SCALE;

const SLIDER_ID = 'wordcloud-slider'

$("#" + SLIDER_ID).dateRangeSlider({
  bounds:{
    min: new Date(FIRST_TWEET_DATE),
    max: new Date(LAST_TWEET_DATE)
  },
  defaultValues:{
    min: new Date(DEFAULT_TWEET_DATE_MIN),
    max: new Date(DEFAULT_TWEET_DATE_MAX)
  },
  range: false,
});

var dateRangeSliderElem = document.getElementById(SLIDER_ID);

dateRangeSliderElem.addEventListener('mouseup', function() {
  var values = $("#" + SLIDER_ID).dateRangeSlider('values');
  var startDate = values.min;
  var endDate = values.max;
  updateWordRange(startDate, endDate)
});

var fill = d3.scaleOrdinal(d3.schemeCategory10);

var dateHashtagsMap;
var hashtagWordCloud;

d3.json(DATA_DIR + HASHTAG_COUNTS_FILENAME).then(function(data) {
  dateHashtagsMap = data;

  // Initialize wordcloud
  hashtagWordCloud = wordCloud('#hashtag-timeline-container');

  // Update wordcloud with default range
  const startDate = new Date(DEFAULT_TWEET_DATE_MIN);
  const endDate = new Date(DEFAULT_TWEET_DATE_MAX);
  var dateRange = $("#" + SLIDER_ID).dateRangeSlider("values");
  updateWordRange(dateRange.min, dateRange.max);
});

function squashHashtagCounts(hashtagBatch) {
  var hashtagCountMap = {};
  for (var i = 0; i < hashtagBatch.length; i++) {
    var currHashtagCount = hashtagBatch[i];
    if (currHashtagCount.text in hashtagCountMap) {
      hashtagCountMap[currHashtagCount.text] += currHashtagCount.size;
    } else {
      hashtagCountMap[currHashtagCount.text] = currHashtagCount.size;
    }
  }
  // for each key
  // make new object
  var result = []
  for (const [hashtag, size] of Object.entries(hashtagCountMap)) {
    result.push({text: hashtag, size: size});
  }
  return result;

  /*return hashtagBatch.reduce((mergedList, curr) => {
    var found = mergedList.find(mergedItem => mergedItem.text === curr.text);
    if (found) {
        found.size += curr.size;
    } else {
        mergedList.push(curr);
    }
    return mergedList;
  }, []);
  */
}

// TODO: speed up
function updateWordRange(startDate, endDate) {
  // Get new word counts
  var hashtagBatch = [];
  //console.time('date iter');
  for (var d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    var dateStr = d.toISOString().split('T')[0];
    hashtagBatch = hashtagBatch.concat(dateHashtagsMap[dateStr]);
  }
  //console.timeEnd('date iter');

  // Join new hashtag counts
  // Reduce examples credits: https://stackoverflow.com/questions/46664213/how-to-group-or-merge-this-array-of-objects-in-javascript
  var results = squashHashtagCounts(hashtagBatch);

  results.sort((a, b) => (a.size < b.size) ? 1 : -1)
  results = results.slice(0, NUM_WORDS_IN_CLOUD);

  // Update normalized sizes
  normalizeSize(results);

  // Update wordcloud
  hashtagWordCloud.update(results);
}

// Updates normalized size of given hashtag objects in place
function normalizeSize(hashtagObjs) {
  const sum = hashtagObjs.reduce(function(total, cur) {
    return total + cur.size;
  }, 0);
  hashtagObjs.map(function(hashtagObj) {
    if (hashtagObj.size !== 0) {
      hashtagObj.norm_size = hashtagObj.size / sum;
    }
  });
}

// Wordcloud credits to http://bl.ocks.org/joews/9697914
function wordCloud(selector) {
  var fill = d3.scaleOrdinal(d3.schemeCategory10);

  //Construct the word cloud's SVG element
  var svg = d3.select(selector).append("svg")
    .attr("width", WORDCLOUD_CONTAINER_WIDTH)
    .attr("height", WORDCLOUD_CONTAINER_HEIGHT)
    .append("g")
    .attr("transform", "translate(" + TRANSLATE_X + ", " + TRANSLATE_Y + ")");

  //Draw the word cloud
  function draw(words) {
    fontScale.domain([
      d3.min(words, function(d) {
        return d.size
      }),
      d3.max(words, function(d) {
        return d.size
      }),
    ]);

    var cloud = svg.selectAll("g text").data(words)

    //Entering words
    cloud.enter()
      .append("text")
      .style("font-family", "Impact")
      .style("fill", function(d, i) { return fill(i); })
      .attr("text-anchor", "middle")
      .attr("font-size", function(d) { return fontScale(d.size) + "px"; })
      .attr("transform", function(d) {
        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
      })
      .text(function(d) { return d.text; });

    //Entering and existing words
    cloud
      .transition()
        .duration(600)
        .text(function(d) { return d.text; })
        .style("font-size", function(d) { return fontScale(d.size) + "px"; })
        .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .style("fill-opacity", 1);

    //Exiting words
    cloud.exit()
      .text(function(d) { return d.text; })
      .transition()
        .duration(200)
        .style('fill-opacity', 1e-6)
        .attr('font-size', 1)
        .remove();
  }

  //Use the module pattern to encapsulate the visualisation code. We'll
  // expose only the parts that need to be public.
  return {
    //Recompute the word cloud for a new set of words. This method will
    // asycnhronously call draw when the layout has been computed.
    //The outside world will need to call this function, so make it part
    // of the wordCloud return value.
    update: function(words) {
      fontScale.domain([
        d3.min(words, function(d) {
          return d.size
        }),
        d3.max(words, function(d) {
          return d.size
        }),
      ]);

      d3.layout.cloud().size([WORDCLOUD_WIDTH, WORDCLOUD_HEIGHT])
          .words(words)
          .font("Impact")
          .text(function(d) { return d.text; })
          .padding(4)
          .rotate(function() {return 0; })
          .fontSize(function(d) { return fontScale(d.size); })
          .on("end", draw)
          .start();
    }
  }
}
