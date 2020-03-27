const GRAPH_DATA = 'graph_data.json'

var width = window.innerWidth,
    height = window.innerHeight * 0.85;

var svg = d3.select("#network-container").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("svg:defs").append("svg:marker")
    .attr("id", "triangle")
    .attr("refX", 10)
    .attr("refY", 6)
    .attr("markerWidth", 30)
    .attr("markerHeight", 30)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M2,2 L2,11 L10,6 L2,2")
    .style("fill", "black");
  
function run(data) {
  
    const links = data['links'];
    const nodes = data['nodes'];

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(0).strength(1))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("center", d3.forceCenter(width / 2, height / 2)); 

    const link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line");
  
    const node = svg.append("g")
        .attr("fill", "#fff")
        .attr("stroke", "#000")
        .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
        .attr("fill", d => d.group === 'troll' ? "#F00" : "#0F0")
        .attr("stroke", "#fff")
        .attr("r", 3.5)
        // .call(drag(simulation));
    simulation.on("tick", () => {
      link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
  
      node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
    });
}

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart()
  d.fx = d.x
  d.fy = d.y
//  simulation.fix(d);
}

function dragged(d) {
  d.fx = d3.event.x
  d.fy = d3.event.y
//  simulation.fix(d, d3.event.x, d3.event.y);
}

function dragended(d) {
  d.fx = d3.event.x
  d.fy = d3.event.y
  if (!d3.event.active) simulation.alphaTarget(0);
  //simulation.unfix(d);
}
  
d3.json(DATA_DIR + GRAPH_DATA).then(function(data) {
    let trollsOnly = {'nodes': [], 'links': []};
    data['nodes'].forEach(n => {
        if (n['group'] === 'troll') {
            trollsOnly['nodes'].push(n);
        }
    })

    data['links'].forEach(n => {
        if (n['group'] === 'troll') {
            trollsOnly['links'].push(n);
        }
    })
    let graph = trollsOnly;
    run(graph)
});