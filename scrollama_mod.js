var root = "images/";
var scatterImgs = ["leftband.png", "x-axis.png", "newsbios.png", "newsbios.png", "newsbios.png"];

function updateChart(index, container, stepSel, id) {
  const sel = container.select(`[data-index='${index}']`); //select the element currently in view. Index is what matters here
  stepSel.classed('is-active', (d, i) => i === index); //Just color change. Ignore for now
  document.getElementById(id).src = root + scatterImgs[index]; //What needs to be on the sticky side
}

function init(scrollySide, step, sticky, id) {
  Stickyfill.add(d3.select(sticky).node());
  const container = d3.select(scrollySide);
  const stepSel = container.selectAll(step);

  enterView({
    selector: stepSel.nodes(),
    offset: 0.5,
    enter: el => {
      const index = +d3.select(el).attr('data-index');
      updateChart(index, container, stepSel, id);
    },
    exit: el => {
      let index = +d3.select(el).attr('data-index');
      index = Math.max(0, index - 1);
      updateChart(index, container, stepSel, id);
    } });

}

init('.scatter-scrolly', '.second-step', '.second-sticky', 'second-img');