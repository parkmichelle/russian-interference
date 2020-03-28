const GRAPH_DATA = 'graph_data.json'
let allGraphData = null;
let graphClicked = false;
let minCount = 10;
let minGraphDateFloat = null;
let maxGraphDateFloat = null;
let minGraphDate = null;
let maxGraphDate = null;
let currMinGraphDate = null;
let currMaxGraphDate = null;

var width = window.innerWidth,
    height = window.innerHeight * 0.90;

var svg = d3.select("#network")
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
    
var networkTooltip = d3.select(".tooltip");

var networkTipMouseover = function(d) {
    var html  = "<span class='tooltip-header'>" + d.id + "</span>";
    networkTooltip.html(html)
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 60) + "px")
        .transition()
        .duration(0) // ms
        .style("opacity", .9) // started as 0!
};
// tooltip mouseout event handler
var networkTipMouseout = function(d) {
    networkTooltip.transition()
        .duration(0) // ms
        .style("opacity", 0); // don't care about position!
};
  
function run(data) {
  
    const links = data['links'];
    const nodes = data['nodes'];
    svg.selectAll('circle').data([]).exit().remove();
    svg.selectAll('line').data([]).exit().remove();

    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(25).strength(0.12))
        .force("charge", d3.forceManyBody().strength(-120))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("center", d3.forceCenter(width / 2, height / 2)); 

    const link = svg.append("g")
        .attr("stroke-opacity", 0.4)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.sqrt(parseInt(d.weight)))
      .attr("stroke", "#000");
  
    const node = svg.append("g")
        .attr("fill", "#fff")
        .attr("stroke", "#000")
        .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(nodes, d => d.id)
      .enter()
        .append('circle')
        .attr("fill", d => d.type === 'troll' ? "#F00" : "#0F0")
        .attr("stroke", "#fff")
        .attr("r", 3.5)
        .on("mouseover", networkTipMouseover)
        .on("mouseout", networkTipMouseout);
        // .call(drag(simulation));
    simulation.on("tick", () => {
      link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
      node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
          .on("mouseover", networkTipMouseover)
          .on("mouseout", networkTipMouseout);
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

function updateDatePickers() {
    document.getElementById("network-start-date").value = minGraphDate.toISOString().slice(0,10);
    document.getElementById("network-start-date").min = minGraphDate.toISOString().slice(0,10);
    document.getElementById("network-start-date").max = maxGraphDate.toISOString().slice(0,10);
    document.getElementById("network-end-date").value = maxGraphDate.toISOString().slice(0,10);
    document.getElementById("network-end-date").min = minGraphDate.toISOString().slice(0,10);
    document.getElementById("network-end-date").max = maxGraphDate.toISOString().slice(0,10);
}
  
d3.json(DATA_DIR + GRAPH_DATA).then(function(data) {
    allGraphData = data;

    let trollsOnly = {'nodes': [], 'links': []};
    data['nodes'].forEach(n => {
        if (parseInt(n['count']) >= minCount) {
            trollsOnly['nodes'].push(n);
        }

        if (minGraphDateFloat === null || parseInt(n['start_date']) < minGraphDateFloat) {
            minGraphDateFloat = parseInt(n['start_date']);
            currMinGraphDate = minGraphDateFloat;
            minGraphDate = new Date(minGraphDateFloat);
        }

        if (maxGraphDateFloat === null || parseInt(n['end_date']) > maxGraphDateFloat) {
            maxGraphDateFloat = parseInt(n['end_date']);
            currMaxGraphDate = maxGraphDateFloat;
            maxGraphDate = new Date(maxGraphDateFloat);
        }
    })

    updateDatePickers();
    
    data['links'].forEach(n => {
        if (parseInt(n['count']) >= minCount) {
            trollsOnly['links'].push(n);
        }
    })

    let graph = trollsOnly;
    run(graph)
});

function drawGraph(data) {
    run(data);
}

function applyFiltersOnData(fullData) {
    let resultData = {'nodes': [], 'links': []};
    fullData['nodes'].forEach(n => {
        if (parseInt(n['count']) >= minCount &&
            (!graphClicked || n['type'] === 'troll') &&
            ((currMinGraphDate <= parseInt(n['start_date']) && parseInt(n['start_date']) <= currMaxGraphDate) ||
             (currMinGraphDate <= parseInt(n['end_date']) && parseInt(n['end_date']) <= currMaxGraphDate))) {

            resultData['nodes'].push(n);
        }
    })


    fullData['links'].forEach(n => {
        let dates = JSON.parse(n['dates']);
        
        let passDate = false;
        for (let date of dates) {
            let dateFloat = parseFloat(date);
            if (currMinGraphDate <= dateFloat && dateFloat <= currMaxGraphDate) {
                passDate = true;
                break;
            }
        }
        if (parseInt(n['count']) >= minCount &&
            (!graphClicked || n['type'] === 'troll') && passDate) {
            resultData['links'].push(n);
        }
    })

    return resultData;
}


let trollsToggle = document.querySelectorAll('#network-trolls');
trollsToggle.forEach(function(item) {
    item.addEventListener('change', function() {
        graphClicked = !graphClicked;
        let data = applyFiltersOnData(allGraphData);
        drawGraph(data);
    });
});

document.getElementById("network-count").value = minCount;
document.getElementById("network-count").addEventListener("input", (val) => filterCount(val));

document.getElementById("network-start-date").addEventListener("change", (val) => filterStart(val));
document.getElementById("network-end-date").addEventListener("change", (val) => filterEnd(val));

function filterStart(val) {
    currMinGraphDate = (new Date(val.target.value)).getTime();
    let data = applyFiltersOnData(allGraphData);
    drawGraph(data);
}

function filterEnd(val) {
    currMaxGraphDate = (new Date(val.target.value)).getTime();
    let data = applyFiltersOnData(allGraphData);
    drawGraph(data);
}

function filterCount(val) {
    if (parseInt(val.target.value) < 10) return;
    minCount = parseInt(val.target.value);
    let data = applyFiltersOnData(allGraphData);
    drawGraph(data);
}