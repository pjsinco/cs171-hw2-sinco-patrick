var width = 900;
var height = 600;

//var checksums = []; // all sha values
var contributors = [];

var commits = 
{
  nodes: []
}

var svg = d3.select('body')
  .append('svg')
  .attr('height', height)
  .attr('width', width)

var colorScale = d3.scale.category10();

d3.json('../misc/guides-commits-master.json', function(jsonMaster) 
{
  d3.json('../misc/guides-commits-newexcellimit.json', function(jsonExcel) 
  {
    d3.json('../misc/guides-commits-sisi.json', function(jsonSisi) 
    {
      d3.json('guides-contributors.json', function(dataContrib) {
      
        /*
         * DATA SETUP
         */

        // add all master branch commits to commits.nodes
        jsonMaster.forEach(function(d) {
          d.cat = 'master';
          commits.nodes.push(d);
        });

        // add all newexcellimit branch commits to commits.nodes
        jsonMaster.forEach(function(d) {
          d.cat = 'newexcellimit';
          commits.nodes.push(d);
        });

        // add all sisi branch commits to commits.nodes
        jsonMaster.forEach(function(d) {
          d.cat = 'sisi';
          commits.nodes.push(d);
        });
        
        // add all contributors and stats to contributors array
        dataContrib.forEach(function(d) {
          var additions = 0;
          var deletions = 0;
    
          // sum up additions, deletions for each user
          d.weeks.forEach(function(d) {
            additions += parseInt(d.a);
            deletions += parseInt(d.d);
          });

          // add stats for each contributor to array 
          contributors.push(
            {
              'login': d.author.login, 
              'commits': d.total,
              'additions': additions,
              'deletions': deletions
            }
          );
        }); // end dataContrib.forEach()


        /*
         *D3 MAGIC
         */
        var maxCommits = d3.max(contributors, function(d) {
          return d.commits;
        });

        var minCommits = d3.min(contributors, function(d) {
          return d.commits;
        });

        var colorScale = d3.scale.linear()
          .domain([minCommits, maxCommits])
          .interpolate(d3.interpolateRgb)
          .range(['blue', 'darkblue'])

        var force = d3.layout.force()
          .nodes(contributors)
          .size([width, height])
          //.on('tick', tick)
          .charge(function(d) {
            // charge equation from:
            // http://vallandingham.me/bubble_charts_in_d3.html
            return -Math.pow(d.commits * 4 + 50, 2.0) / 8;
          })
          .start();

        var node = svg.selectAll('.node')
          .data(contributors)
          .enter()
            .append('g')
            .attr('class', 'node')

        node.append('circle')
          .attr('r', function(d) {
            return (d.commits * 4) + 40;
          })
          .attr('fill', function(d) {
            return colorScale(d.commits);
          })

        node.append('text')
          .text(function(d) {
            return d.login 
          })
          .attr('text-anchor', 'middle')
          .attr('fill', '#ffffff')
          .attr('font-size', '10px')
          .attr('font-family', 'sans-serif')


        //var tick = function(d) {
        force.on('tick', function() {
          svg.selectAll('.node')
            .select('circle')
            .attr('cx', function(d) {
              return d.x;
            })
            .attr('cy', function(d) {
              return d.y;
            })

          svg.selectAll('.node')
            .select('text')
            .attr('x', function(d) {
              return d.x;
            })
            .attr('y', function(d) {
              return d.y;
            })
        
        });
            
//        function graphUpdate(delay) {
//          nodes
//            .transition()
//            .duration(delay)
//              .attr('transform', function(d) {
//                //return 'translate(' + d.x + ', ' + d.y + ')';
//                //console.log(d.x, d.y);
//              });
//        }
          
        //force.on('tick', function(d) {
          //console.log(d.x);
        //}

          

        //var forceLayout = function() {
          
        //}

      }); // end dataContrib
    }); // end jsonSis
  }); // end jsonExcel
}); // end jsonMaster
