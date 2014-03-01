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
        jsonExcel.forEach(function(d) {
          d.cat = 'newexcellimit';
          commits.nodes.push(d);
        });

        // add all sisi branch commits to commits.nodes
        jsonSisi.forEach(function(d) {
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
              'deletions': deletions,
              'changes': additions + deletions
            }
          );
        }); // end dataContrib.forEach()

        commits.nodes.forEach(function(d) {
          //console.log(d);
        });

        /*
         *D3 MAGIC
         */

        var node;
        var radius;

        var maxCommits = d3.max(contributors, function(d) {
          return d.commits;
        });

        var minCommits = d3.min(contributors, function(d) {
          return d.commits;
        });

        var maxChanges = d3.max(contributors, function(d) {
          return d.changes;
        });

        var minChanges = d3.min(contributors, function(d) {
          return d.changes;
        });

        var colorScale = d3.scale.linear()
          .interpolate(d3.interpolateRgb)
          .range(['blue', 'darkblue'])

        // make a force layout
        var force = d3.layout.force()
          .size([width, height])
          .on('tick', tick)
          //.start();

        function tick() {
          graphUpdate(0);
        }

//        force.on('tick', function() {
//          svg.selectAll('.node')
//            .select('circle')
//            .attr('cx', function(d) {
//              return d.x;
//            })
//            .attr('cy', function(d) {
//              return d.y;
//            })

          node = svg.selectAll('.node')
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

          //svg.selectAll('.node')
          node
            .select('text')
            .attr('x', function(d) {
              return d.x;
            })
            .attr('y', function(d) {
              return d.y;
            })
        
        //});
            
        function graphUpdate(delay) {
          svg.selectAll('.node')
            .transition()
            .duration(delay)
              .attr('transform', function(d) {
                return 'translate(' + d.x + ', ' + d.y + ')';
                //console.log(d.x, d.y);
              });
        }
          
        function contribViewByCommits() {
          // update colorScale
          colorScale
            .domain([minCommits, maxCommits])

          force
            .nodes(contributors)
            .charge(function(d) {
              // set radius for this view
              radius = d.commits * 4 + 40;

              // charge equation from:
              // http://vallandingham.me/bubble_charts_in_d3.html
              return -Math.pow(radius, 2.0) / 8;
            })

          svg.selectAll('circle')
            .transition()
            .duration(500)
              .style('fill', function(d) {
                return colorScale(d.commits); 
              })
            .attr('r', function(d) {
              return (d.commits * 4) + 40;
            })
            .attr('fill', function(d) {
              return colorScale(d.changes);
            })

          force
            .start();
        }  

        function contribViewByChanges() {
          // update colorScale
          colorScale
            .domain([minChanges, maxChanges])
          
          force
            .nodes(contributors)
            .charge(function(d) {
              // set radius for this view
              radius = d.changes + 50;

              // charge equation from:
              // http://vallandingham.me/bubble_charts_in_d3.html
              return -Math.pow(radius, 2.0) / 8;
            })


          svg.selectAll('circle')
            .transition()
            .duration(500)
              .style('fill', function(d) {
                return colorScale(d.changes); 
              })
            .attr('r', function(d) {
              return d.changes + 50;
            })
            .attr('fill', function(d) {
              return colorScale(d.changes);
            })
        
          force
            .start();
        } // end contribViewByChanges()

        function commitViewByBranch() {
          //force
            //.stop()
          svg.selectAll('.node')
            .remove();

          colorScale = d3.scale.category10();

          force.stop(); // stop ticks so we can update force.nodes()

          force
            .nodes(commits.nodes)
            .charge(-40)

          force.start();

          //console.log(commits.nodes);

          //svg.selectAll('.node')
          node
            .data(commits.nodes)
            .enter()
              .append('g')
                .attr('class', 'node')
                .append('circle')
                  .attr('r', 10)
                  .attr('fill', function(d) {
                    return colorScale(d.cat);
                  })

          force
            .on('tick', tick)
//              svg.selectAll('.node')
//                .transition()
//                .duration(500)
//                .attr('transform', function(d) {
//                  //console.log(d);
//                  return 'translate(' + d.x + ', ' + d.y + ')';
//                })
            //});

      
//          svg.selectAll('.node')
//            .data(commits.nodes)
//            .enter()
//              .append('g')
//              .attr('class', 'node')
//              .append('circle')

          //svg.selectAll('.node')
            //.append('circle')
            //.attr('r', 5)
            //.attr('fill', 'darkorange')

          //graphUpdate(500);
        
        } // end commitViewByBranch()

          

        /*
         *EVENT LISTENERS
         */

        d3.select('input[value=\"commits\"]')
          .on('click', contribViewByCommits)

        d3.select('input[value=\"changes\"]')
          .on('click', contribViewByChanges)

        d3.select('input[value=\"branch\"]')
          .on('click', commitViewByBranch)

        /*
         *GIDDYUP
         */
        contribViewByCommits();

      }); // end dataContrib
    }); // end jsonSis
  }); // end jsonExcel
}); // end jsonMaster
