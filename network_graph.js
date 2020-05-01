const GRAPH_DATA = 'graph_data.json'
let allGraphData = null;
let graphClicked = false;
let minCount = 20;
let minGraphDateFloat = null;
let maxGraphDateFloat = null;
let minGraphDate = null;
let maxGraphDate = null;
let currMinGraphDate = null;
let currMaxGraphDate = null;
let opacity_scale = null;
let colors_reset = true;
let node_locked = false;
let highlighted_nodes = [];
let clicked_nodes = [];
let shift_down = false;

let active_network = null;

var network_width = window.innerWidth,
    network_height = window.innerHeight * 0.90;

var svg = d3.select("#network").on("click", () => {
    if (shift_down) return;
    highlighted_nodes = [];
    clicked_nodes = [];
    resetGraphColors();
    node_locked = false;
    colors_reset = true;
});

svg.append("svg:defs").append("svg:marker")
    .attr("id", "triangle")
    .attr("refX", 0)
    .attr("refY", 0)
    .attr("markerWidth", 20)
    .attr("markerHeight", 20)
    .attr("orient", "auto")
    .append("path")
    .attr("d", "M 2,2 2,8 7,5 Z")
    .style("fill", "blue")
    .style("opacity", 0.5);
    
var networkTooltip = d3.select(".tooltip");

var networkTipMouseover = function(d) {
    let start_date = new Date(parseInt(d['start_date']));
    let end_date = new Date(parseInt(d['end_date']));

    let start_date_str = (start_date.getMonth() + 1) + '/' + start_date.getDate() + '/' + start_date.getFullYear();
    let end_date_str = (end_date.getMonth() + 1) + '/' + end_date.getDate() + '/' + end_date.getFullYear();

    let mentioners_list = active_network
    .links
    .filter(x => x.target == d.id);
    let high_count = Number.NEGATIVE_INFINITY;
    let top_fan = null;
    for (let i=mentioners_list.length-1; i>=0; i--) {
        let tmp = mentioners_list[i].weight;
        if (tmp > high_count) {
            high_count = tmp;
            top_fan = mentioners_list[i].source;
        }
    }

    let mentionees_list = active_network
    .links
    .filter(x => x.source == d.id);
    high_count = Number.NEGATIVE_INFINITY;
    let top_mentionee = null;
    for (let i=mentionees_list.length-1; i>=0; i--) {
        let tmp = mentionees_list[i].weight;
        if (tmp > high_count) {
            high_count = tmp;
            top_mentionee = mentionees_list[i].target;
        }
    }

    var html = `<div class="graph_tooltip"><div class='tooltip-header'>@${d.id}</div><div>Date of first mention: ${start_date_str}</div><div>Date of last mention: ${end_date_str}</div><div>Total mentions: ${d.count}</div><div>Tyoe of user: ${d.type === "troll" ? "Troll" : "Real"}</div><div>Most mentions by: @${top_fan ? top_fan : "N/A"}</div><div>Most mentions of: @${top_mentionee ? top_mentionee : "N/A"}</div></div>`
    networkTooltip.html(html)
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 60) + "px")
        .transition()
        .duration(0) // ms
        .style("opacity", .9); // started as 0!
    
    if (node_locked) return;
    var connectedNodeIds = active_network
    .links
    .filter(x => x.source == d.id || x.target == d.id)
    .map(x => x.source == d.id ? x.target : x.source);

    d3.selectAll("circle")
    .attr("opacity", function(c) {
        if (!c || !d) return "white";
        if (connectedNodeIds.indexOf(c.id) > -1 || c.id == d.id) return 1;
        else return 0.3;
    });

    d3.selectAll(".edges").style('opacity', function(l) {
        if (!l.source || !l.target) return 0;
        if (l.source.id == d.id || l.target.id == d.id) return 0.6;
        else return 0.03;
    });
};
// tooltip mouseout event handler
var networkTipMouseout = function(d) {
    networkTooltip.transition()
        .duration(0) // ms
        .style("opacity", 0); // don't care about position!

    if (node_locked) return;
    d3.selectAll("circle")
    .attr("opacity", 1)

    d3.selectAll(".edges")
    .style("opacity", d => opacity_scale(d.weight))
};

var resetGraphColors = () => {
    d3.selectAll("circle")
    .attr("opacity", 1)

    d3.selectAll(".edges")
    .style("opacity", d => opacity_scale(d.weight))
}

var highlightConnections = d => {
    var connectedNodeIds = active_network
    .links
    .filter(x => x.source == d.id || x.target == d.id)
    .map(x => x.source == d.id ? x.target : x.source);

    if (shift_down) {
        connectedNodeIds.forEach(c => highlighted_nodes.push(c));
    } else {
        resetGraphColors();
        highlighted_nodes = connectedNodeIds;
        clicked_nodes = [];
    }
    clicked_nodes.push(d.id);
    highlighted_nodes.push(d.id);
    node_locked = true;
    colors_reset = false;

    d3.selectAll("circle")
    .attr("opacity", function(c) {
        if (!c || !d) return "white";
        if (highlighted_nodes.indexOf(c.id) > -1) return 1;
        else return 0.3;
    });

    d3.selectAll(".edges").style('opacity', function(l) {
        if (!l.source || !l.target) return 0;
        if (clicked_nodes.indexOf(l.source.id) > -1 || clicked_nodes.indexOf(l.target.id) > -1) return 0.6;
        else return 0.03;
    });
    d3.event.stopPropagation();
}

var simulation;
var node;
var link;
  
function setup() {

    simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id).distance(20).strength(0.12))
        .force("charge", d3.forceManyBody().strength(-120))
        .force("x", d3.forceX())
        .force("y", d3.forceY())
        .force("center", d3.forceCenter(network_width / 2, network_height / 2));

    link = svg.append("g")
      .selectAll("line")
      
  
    node = svg.append("g")
        .attr("fill", "#fff")
        .attr("stroke", "#000")
        .attr("stroke-width", 1.5)
      .selectAll("circle");

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
          .on("mouseout", networkTipMouseout)
          .on("click", highlightConnections)
    });
}

function updateNetwork(nodes, links) {
    // Make a shallow copy to protect against mutation, while
    // recycling old nodes to preserve position and velocity.
    active_network = {'nodes': nodes, 'links': links};
    const old = new Map(node.data().map(d => [d.id, d]));
    nodes = nodes.map(d => Object.assign(old.get(d.id) || {}, d));
    links = links.map(d => Object.assign({}, d));

    node = node
    .data(nodes, d => d.id)
    .join(enter => enter.append("circle")
        .attr("fill", d => d.type === 'troll' ? "#F00" : "#0F0")
        .attr("stroke", "#fff")
        .attr("r", 3.5)
        .on("mouseover", networkTipMouseover)
        .on("mouseout", networkTipMouseout)
        .on("click", highlightConnections));

    link = link
        .data(links, d => [d.source, d.target])
        .join("line")
        .classed("edges", true)
        .style('stroke', 'black')
        .style("opacity", d => opacity_scale(d.weight))
        .on("click", () => {
            if (shift_down) return;
            highlighted_nodes = [];
            clicked_nodes = [];
            resetGraphColors();
            node_locked = false;
            colors_reset = true;
        });
        // .attr('marker-end','url(#triangle)');

    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();
    resetGraphColors();
    highlighted_nodes = [];
    clicked_nodes = [];
    colors_reset = true;
    node_locked = false;
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

    var lowest = Number.POSITIVE_INFINITY;
    var highest = Number.NEGATIVE_INFINITY;
    var tmp;
    for (var i=data.links.length-1; i>=0; i--) {
        tmp = data.links[i].weight;
        if (tmp < lowest) lowest = tmp;
        if (tmp > highest) highest = tmp;
    }
    opacity_scale = d3.scaleLog()
    .domain([lowest, highest])
    .range([0.05, 0.65]);

    setup();
    updateNetwork(graph.nodes, graph.links)
});

function drawGraph(data) {
    updateNetwork(data.nodes, data.links);
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
    if (!val.target.value || parseInt(val.target.value) < 10) return;
    minCount = parseInt(val.target.value);
    let data = applyFiltersOnData(allGraphData);
    drawGraph(data);
}

let e = document.getElementById('network-container');

$(window).on("scroll", function(){
    if (this.window.scrollY + this.window.innerHeight < e.offsetTop || this.window.scrollY > e.offsetTop + this.window.innerHeight) {
        if (!colors_reset) {
            resetGraphColors();
            colors_reset = true;
            node_locked = false;
            highlighted_nodes = [];
            clicked_nodes = [];
        }
    }
    this.window.scrollY;
});

document.addEventListener('keyup', (e) => {
    if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        shift_down = false;
    }
});

document.addEventListener('keydown', (e) => {
    if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
        shift_down = true;
    }
});