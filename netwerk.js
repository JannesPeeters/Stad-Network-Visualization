const svg = d3.select("svg")
            .attr("class", "my_dataviz")
            .attr("width", 5000)
            .attr("height", 5000);

const height = +svg.attr("height");
const width = +svg.attr("width");
const margin = {top: 10, right: 10, bottom: 10, left: 10};
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink()
          .id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody().strength(-100))
    .force("collide", d3.forceCollide(20))
    .force("center", d3.forceCenter(width / 2, height / 2));

var g = svg.append("g")
  .attr("class", "network-area");

d3.json("stad.json").then(function(data) {

  const links = data.links.map(d => Object.create(d));
  const nodes = data.nodes.map(d => Object.create(d));
  const radius = 20;

  var link = g.append("g").attr("class", "links")
                          .selectAll("line")
                          .data(links)
                          .enter()
                          .append("line")
                            .style("stroke", "#aaa");

  var node = g.append("g").attr("class", "nodes")
                          .selectAll("circle")
                          .data(nodes)
                          .enter()
                          .append("circle")
                            .attr("r", radius)
                            .style("fill", d => colorScale(d.Gender))
                            .call(d3.drag()
                                    .on("start", dragstarted)
                                    .on("drag", dragged)
                                    .on("end", dragended))
                            .on('mouseover.fade', fade(0.1))
                            .on('mouseout.fade', fade(1));

  var names = g.append("g").attr("class", "node-names")
                            .selectAll("text")
                            .data(nodes)
                            .enter()
                            .append("text")
                              .text(d => d.Label)
                              .attr('font-size',50)
                              .call(d3.drag()
                                      .on("start", dragstarted)
                                      .on("drag", dragged)
                                      .on("end", dragended))
                              .on('mouseover.fade', fade(0.1))
                              .on('mouseout.fade', fade(1));

  simulation.nodes(nodes).on("tick", ticked)
            .force("link").links(links);

  var zoom_handler = d3.zoom()
      .on("zoom", zoom_actions);

  zoom_handler(svg);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("cx", function(d) { return d.x = Math.max((radius+1), Math.min(width - (radius+1), d.x)); })
        .attr("cy", function(d) { return d.y = Math.max((radius+1), Math.min(height - (radius+1), d.y)); });
    names
        .attr("x", d => d.x + 30)
        .attr("y", d => d.y + 15)
        .attr("visibility", "hidden");
  };

  function fade(opacity) {
    return d => {
      node.style('opacity', function (o) { return isConnected(d, o) ? 1 : opacity });
      names.style('visibility', function (o) { return isConnected(d, o) ? "visible" : "hidden" });
      link.style('stroke-opacity', o => (o.source === d || o.target === d ? 1 : opacity));
      if(opacity === 1){
        node.style('opacity', 1)
        names.style('visibility', 'hidden')
        link.style('stroke-opacity', 0.3)
      }
    };
  };

  const linkedByIndex = {};
  links.forEach(d => {
    linkedByIndex[`${d.source.index},${d.target.index}`] = 1;
  });

  function isConnected(a, b) {
    return linkedByIndex[`${a.index},${b.index}`] || linkedByIndex[`${b.index},${a.index}`] || a.index === b.index;
  };

});

function zoom_actions(){
    g.attr("transform", d3.event.transform)
    }

function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
