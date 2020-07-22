var root = "images/";
var wordImgs = ["wordclouds/2014.png", "wordclouds/2015.png", "wordclouds/2016.png", "wordclouds/2017.png", "wordclouds/2017.png"];
var scatterImgs = ["leftband_clean.png", "leftband.png", "x-axis.png", "newsbios_clean.png", "newsbios.png", "box.png", "box.png"];
var networkImgs = ["iris_share.png", "high_mention.png", "high_mention_clusters.png", "high_mention_clusters1.png", "high_mention_clusters1.png", 
"high_mention_clusters2.png", "high_mention_clusters2.png", "high_mention_clusters3.png", "high_mention_clusters3.png",
"trolls_only.png", "trolls_only1.png", "full.png", "full.png"];
var feedImgs = ["timeseries_compare_clean.png", "timeseries_compare.png", "timeseries_compare.png", "timeseries_compare.png"];


function updateChart(index, container, stepSel, id, array) {
  const sel = container.select(`[data-index='${index}']`); //select the element currently in view. Index is what matters here
  stepSel.classed('is-active', (d, i) => i === index); //Just color change. Ignore for now
  stickyElement = document.getElementById(id);
  stickyElement.src = root + array[index];
  stickyElement.classList.add("sticky-image");
}

function init(scrollySide, step, sticky, id, array) {
  Stickyfill.add(d3.select(sticky).node());
  const container = d3.select(scrollySide);
  const stepSel = container.selectAll(step);

  enterView({
    selector: stepSel.nodes(),
    offset: 0.5,
    enter: el => {
      const index = +d3.select(el).attr('data-index');
      updateChart(index, container, stepSel, id, array);
    },
    exit: el => {
      let index = +d3.select(el).attr('data-index');
      index = Math.max(0, index - 1);
      updateChart(index, container, stepSel, id, array);
    } });

}

// Caches the images so that they load immediately when scrollama is displayed
function preloadImages(array) {
    if (!preloadImages.list) {
        preloadImages.list = [];
    }
    var list = preloadImages.list;
    for (var i = 0; i < array.length; i++) {
        var img = new Image();
        img.onload = function() {
            var index = list.indexOf(this);
            if (index !== -1) {
                // remove image from the array once it's loaded
                // for memory consumption reasons
                list.splice(index, 1);
            }
        }
        list.push(img);
        img.src = root + array[i];
    }
}

// Initializes the scrollama for each scrolly section sand their own array of image paths
preloadImages(wordImgs);
init('.word-scrolly', '.second-step', '.word-sticky', 'word-img', wordImgs);
preloadImages(scatterImgs);
init('.scatter-scrolly', '.second-step', '.scatter-sticky', 'scatter-img', scatterImgs);
preloadImages(networkImgs);
init('.network-scrolly', '.second-step', '.network-sticky', 'network-img', networkImgs);
preloadImages(feedImgs);
init('.feed-scrolly', '.second-step', '.feed-sticky', 'feed-img', feedImgs);

