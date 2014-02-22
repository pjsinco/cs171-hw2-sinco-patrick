
  console.log('radial');

  var height = 700;
  var width = 900;

  var svg = d3.select('body')
    .append('svg')
      .attr('width', width)
      .attr('height', height);

  var fill = d3.scale.category10();

  var graph = 
  {
    nodes: [],
    links: []
  };

  var numNodes = 100;
  var numCat = 10;

  graph.nodes = d3.range(numNodes)
    .map(function() {
      return {
        'cat': Math.floor(numCat * Math.random()) 
      };
    });

  graph.nodes.map(function(d, i) {
    graph.nodes.map(function(e, j) {
      if (Math.random() > 0.99 && i != j) {
        graph.links.push({
          source: i,
          target: j
        });
      }
    });
  });

  // generate the force layout
  var force = d3.layout.force()
    .nodes(graph.nodes)
    .links(graph.links)
    .size([width, height])
    .charge(-50)
    .linkDistance(10)
    .on('tick', tick)
    .on('start', function(d) {

    })
    .on('end', function(d) {

    })

  var tick = function(d) {
    graphUpdate(0);
  }

  var randomLayout = function() {
    force.stop();
  
    graph.nodes.forEach(function(d, i) {
      d.x = (width / 4) + ((2 * width * Math.random()) / 4);
      d.y = (height / 4) + ((2 * height * Math.random()) / 4);
    });

    graphUpdate(500);
  }

  var forceLayout = function() {
    force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();
  }

  var lineLayout = function() {
    force.stop();

    graph.nodes.forEach(function(d, i) {
      d.y = height / 2;
    })

    graphUpdate(500);
  }

  var lineCatLayout = function() {
    force.stop();

    graph.nodes.forEach(function(d, i) {
      d.y = (height / 2) + (d.cat * 20);
    });

    graphUpdate(500);
  }

  var radialLayout = function() {
    force.stop()

    var r = height / 2;
  
    var arc = d3.svg.arc()
      .outerRadius(r)

    var pie = d3.layout.pie()
      .sort(function(a, b) {
        return a.cat - b.cat;
      })
      .value(function(d, i) {
        return 1; // equal share for each point
      });

    graph.nodes = pie(graph.nodes).map(function(d, i) {
      d.innerRadius = 0;
      d.outerRadius = r;
      d.data.x = arc.centroid(d)[0] + (height / 2);
      d.data.y = arc.centroid(d)[1] + (width / 2);
      d.data.endAngle = d.endAngle;
      d.data.startAngle = d.startAngle;
      return d.data;
    });

    graphUpdate(500);
  }

  var categoryColor = function() {
    d3.selectAll('circle')
      .transition()
      .duration(500)
        .style('fill', function(d) {
          return fill(d.cat)
        });
  }

  var categorySize = function() {
    d3.selectAll('circle')
      .transition()
      .duration(500)
        .attr('r', function(d) {
          return Math.sqrt((d.dat + 1) * 10);
        });
  }

  var graphUpdate = function(delay) {
    link
      .transition()
      .duration(delay)
        .attr('x1', function(d) {
          return d.target.x;
        })
        .attr('y1', function(d) {
          return d.target.y;
        })
        .attr('x2', function(d) {
          return d.source.x;
        })
        .attr('y2', function(d) {
          return d.source.y;
        })

    node
      .transition()
      .duration(delay)
        .attr('transform', function(d) {
          return 'translate(' + d.x + ',' + d.y + ')';
        });
  } // end graphUpdate()

  d3.select('input[value="force"]')
    .on('click', forceLayout);

  d3.select('input[value="random"]')
    .on('click', randomLayout);

  d3.select('input[value="line"]')
    .on('click', lineLayout);

  d3.select('input[value="line_cat"]')
    .on('click', lineCatLayout);

  d3.select('input[value="radial"]')
    .on('click', radialLayout);

  d3.select('input[value="nocolor"]')
    .on('click', function() {
      d3.selectAll('circle')
        .transition()
        .duration(500)
          .style('fill', '#66cc66')
    });

  d3.select('input[value="nosize"]')
    .on('click', function() {
      d3.selectAll('circle')
        .transition()
        .duration(500)
          .attr('r', 5)
    });

  d3.select('input[value="size_cat"]')
    .on('click', categorySize);

  var link = svg.selectAll('.link')
    .data(graph.links)
    .enter()
      .append('line')
      .attr('class', 'link');

  var node = svg.selectAll('.node')
    .data(graph.nodes)
    .enter()
      .append('g')
      .attr('class', 'node');

  node.append('circle')
    .attr('r', 5);

  forceLayout();

    

  
