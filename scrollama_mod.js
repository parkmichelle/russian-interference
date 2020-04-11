var root = "images/";
var wordImgs = ["wordclouds/2014.png", "wordclouds/2015.png", "wordclouds/2016.png", "wordclouds/2017.png"];
var scatterImgs = ["leftband_clean.png", "leftband.png", "x-axis.png", "newsbios_clean.png", "newsbios.png"];
var networkImgs = ["iris.png", "high_mention.png", "high_mention_clusters.png", "high_mention_clusters.png", 
"high_mention_clusters.png","high_mention_accounts.png", "trolls_only.png", "full.png"];
var feedImgs = ["timeseries_compare_clean.png", "timeseries_compare.png", "timeseries_compare.png"];


function updateChart(index, container, stepSel, id, array) {
  const sel = container.select(`[data-index='${index}']`); //select the element currently in view. Index is what matters here
  stepSel.classed('is-active', (d, i) => i === index); //Just color change. Ignore for now
  stickyElement = document.getElementById(id);
  stickyElement.src = root + array[index]; //What needs to be on the sticky side
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

// Initializes the scrollama for each scrolly section and their own array of image paths
init('.word-scrolly', '.second-step', '.word-sticky', 'word-img', wordImgs);
init('.scatter-scrolly', '.second-step', '.scatter-sticky', 'scatter-img', scatterImgs);
init('.network-scrolly', '.second-step', '.network-sticky', 'network-img', networkImgs);
init('.feed-scrolly', '.second-step', '.feed-sticky', 'feed-img', feedImgs);
