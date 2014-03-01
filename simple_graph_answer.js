var width = 1000;
var height = 700;
var padding = 20;

var colorScale = d3.scale.category10();

var svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var fill = d3.scale.category10();
var committers = [
  'Scott Klein', 
  'Jeremy B. Merrill',
  'Jeff Larson',
  'Jon Schleuss',
  'Julian Burgess',
  'Sisi Wei',
  'Michael Keller',
  'mhkeller',
  'Travis Swicegood',
  'Jeremy B. Merrill'
];
var graph = 
{
  nodes:[], 
  links:[]
};

d3.json('misc/guides-commits-master.json', function(jsonMaster) 
{
  d3.json('misc/guides-commits-newexcellimit.json', function(jsonExcel) 
  {
    d3.json('misc/guides-commits-sisi.json', function(jsonSisi) 
    {

      jsonMaster.forEach(function(d) {
        d.cat = 'master';
        graph.nodes.push(d);
      });

      jsonExcel.forEach(function(d) {
        d.cat = 'excel';
        graph.nodes.push(d);
      });

      jsonSisi.forEach(function(d) {
        d.cat = 'sisi';
        graph.nodes.push(d);
      });

      graph.nodes.map(function(d, i) {
        graph.nodes.map(function(e, j) {
          if(d.sha == e.sha) {
            graph.links.push({"source": i, "target": j})
          } 
        })
      })

      var minDate = d3.min(graph.nodes, function(d) {
        return d.commit.author.date;
      });

      var maxDate = d3.max(graph.nodes, function(d) {
        return d.commit.author.date;
      });

      // Generate the force layout
      var force = d3.layout.force()
          .size([width, height])
          .charge(-100)
          .linkDistance(10)
          .on("tick", tick)
          .on("start", function(d) {})
          .on("end", function(d) {})
      
      function tick(d) {
        graphUpdate(0);
      }
      
      function randomLayout() {
        force.stop();
      
        graph.nodes.forEach(function(d, i) {
          d.x = width/4 + 2*width*Math.random()/4;
          d.y = height/4 + 2*height*Math.random()/4;
        })
        
        graphUpdate(500);
      }
      
      function forceLayout() {
        svg.selectAll('text')
          .remove();
        
        svg.selectAll('.axis')
          .remove();
      
        force
          .nodes(graph.nodes)
          .links(graph.links)
          .linkDistance([50]) 
          .start();

      }
        
      function timeLayout() {
        force.stop()

        svg.attr('width', width * 5);

        node.append('text')
          .attr('x', 0)
          .attr('y', 15)
          .attr('dx', 0)
          .attr('dy', 5)
          //.attr('fill', 'darkorange')
          //.attr('fill', 'darkorange')
          .text(function(d) {
            return d.cat;
          })

        svg.append('g')
          .attr('class', 'axis')
          .attr('transform', 'translate(' + (padding * 7) + ', 0)')
          .call(yAxis);
  
        graph.nodes.forEach(function(d, i) {
          d.y = yScale(d.commit.author.name) + (padding * 2);
          d.x = timeScale(new Date(d.commit.author.date));
        });
    
        graphUpdate(500);
      }

      function lineLayout() {
        force.stop();
    
        svg.attr('width', width * 5);

        node.append('text')
          .attr('x', 0)
          .attr('y', 15)
          .attr('dx', 0)
          .attr('dy', 5)
          //.attr('fill', 'darkorange')
          //.attr('fill', 'darkorange')
          .text(function(d) {
            return d.cat;
          })

        svg.append('g')
          .attr('class', 'axis')
          .attr('transform', 'translate(' + (padding * 7) + ', 0)')
          .call(yAxis);
      
        graph.nodes.forEach(function(d, i) {
          d.y = yScale(d.commit.author.name) + (padding * 2);
          d.x = xScale(d.x);
        })

        graphUpdate(500);
      }
      
      function lineCatLayout() {
        force.stop();
      
        graph.nodes.forEach(function(d, i) {
          d.y = height/2 + d.cat*20;
        })
      
        graphUpdate(500);
      }
      
      function radialLayout() {
      
        force.stop();
      
        var r = height/2;
      
        var arc = d3.svg.arc()
                .outerRadius(r);
      
        var pie = d3.layout.pie()
        .sort(function(a, b) { return a.cat - b.cat;})
        // equal share for each point
        .value(function(d, i) { return 1; }); 
      
        graph.nodes = pie(graph.nodes).map(function(d, i) {
          d.innerRadius = 0;
          d.outerRadius = r;
          d.data.x = arc.centroid(d)[0]+height/2;
          d.data.y = arc.centroid(d)[1]+width/2;
          d.data.endAngle = d.endAngle; 
          d.data.startAngle = d.startAngle; 
          return d.data;
        })
      
        graphUpdate(500);
      }
      
      function categoryColor() {
        d3.selectAll("circle")
          .transition()
          .duration(500)
            .style("fill", function(d) { return fill(d.cat); });
      }
      
      function categorySize() {
        d3.selectAll("circle")
          .transition()
          .duration(500)
            .attr("r", function(d) { 
              return Math.sqrt((d.cat+1)*10); 
            });
      }
      
      function graphUpdate(delay) {
      
        link
          .transition()
          .duration(delay)
            .attr("x1", function(d) { return d.target.x; })
            .attr("y1", function(d) { return d.target.y; })
            .attr("x2", function(d) { return d.source.x; })
            .attr("y2", function(d) { return d.source.y; });
      
        node
          .transition()
          .duration(delay)
            .attr("transform", function(d) { 
              return "translate(" + d.x + "," + d.y + ")"; 
            });
    
      }
      
      d3.select("input[value=\"force\"]").on("click", forceLayout);
      d3.select("input[value=\"random\"]").on("click", randomLayout);
      d3.select("input[value=\"line\"]").on("click", lineLayout);
      d3.select("input[value=\"line_cat\"]").on("click", lineCatLayout);
      d3.select("input[value=\"time\"]").on("click", timeLayout);
      d3.select("input[value=\"radial\"]").on("click", radialLayout);
      
      d3.select("input[value=\"nocolor\"]").on("click", function() {
        d3.selectAll("circle")
          .transition()
          .duration(500)
            .style("fill", "#66CC66");
      })
      
      d3.select("input[value=\"color_cat\"]").on("click", categoryColor);
      
      d3.select("input[value=\"nosize\"]").on("click", function() {
        d3.selectAll("circle")
          .transition()
          .duration(500)
            .attr("r", 5);
      })
      
      d3.select("input[value=\"size_cat\"]").on("click", categorySize);
      
//      var line = d3.svg.line()
//        .x(function(point) {
//          return point.lx;
//        })
//        .y(function(point) {
//          return point.ly;
//        });
//
//      var lineData = function(d) {
//        var points = [
//          {
//            lx: d.source.x,
//            ly: d.source.y
//          },
//          {
//            lx: d.target.x,
//            ly: d.target.y
//          },
//        ];
//      }
//
//      var link = svg.selectAll("path")
//        .data(graph.links)
//        .enter().append("path")
//          .attr('d', lineData)
//          .attr("class", "link")
//          .attr('marker-end', 'url(#end)')
//          .style('stroke', '#ccc')
//          .style('stroke-width', '3px')
//          .style('shape-rendering', 'auto')
//          .style('shape-rendering', 'auto')

      var link = svg.selectAll(".link")
        .data(graph.links)
        .enter()
          .append("line")
          .attr("class", "link")
          .attr('marker-end', 'url(#end)')
          .style('stroke', '#ccc')
          .style('stroke-width', 3)
          
      
      var node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter()
          .append("g")
          .attr("class", "node")

        
      
      node.append("circle")
          .attr("r", 5)
          .attr('fill', function(d) {
            return colorScale(d.cat);
          })


      svg.append('svg:defs').selectAll('marker')
        .data(['end'])
        .enter().append('svg:marker')
          .attr('id', String)
          .attr('viewBox', '0, -5, 10 10')
          .attr('refX', 15)
          .attr('refY', -1.5)
          .attr('markerWidth', 3)
          .attr('markerHeight', 3)
          .attr('orient', 'auto')
          .append('svg:path')
            .attr("d", "M0,-5L10,0L0,5");

      var path = svg.append('svg:g').selectAll('path')
        .data(graph.links)
        .enter().append('svg:path')
          
      forceLayout();

      var xScale = d3.scale.ordinal()
        .domain(d3.range(graph.nodes.length))
        .rangeRoundBands([(padding * 7), width * 5]);

      var yScale = d3.scale.ordinal()
        .domain(committers) 
        .rangeRoundBands([height, 0]);
      
      var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')
        
      var timeScale = d3.time.scale()
        .domain([new Date(minDate), new Date(maxDate)])
        .range([(padding * 8), width * 5])

      d3.selectAll('.node')
        .on('mouseover', function(d, i) {

          //var xPos = parseFloat(d3.select(this).attr('x')
          //console.log(d3.select(this)[0].attr('x'));
           console.log(d);
    
//          svg.append('rect')
//            .attr('class', 'tooltip')
//            .attr('x', d.x)
//            .attr('y', d.y)
//            .attr('width', function() {
//              var w = d.commit.author.name.length + 
//                d.commit.message.length * 10;
//              return w;
//            })
//            .attr('height', 30)
//            .attr('fill', '#f5f5f5')

          svg.append('text')
            .attr('class', 'tooltip')
            .attr('x', (d.x + 10)) 
            .attr('y', (d.y - 12))
            .attr('text-anchor', 'left')
            .attr('font-family', 'sans-serif')
            .attr('font-size', '12px')
            .attr('font-weight', 'bold')
            .attr('fill', 'black')
            .style('z-index', 100)
            .text(function() {
              return d.commit.message;
            })
      
        }) // end mouseover

      d3.selectAll('.node')
        .on('mouseout', function(d, i) {
          svg.selectAll('.tooltip')
            .remove();
        })

        
      
    }); // end jsonSis
  }); // end jsonExcel
}); // end jsonMaster
