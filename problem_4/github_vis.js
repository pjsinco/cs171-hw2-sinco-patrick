console.log('blue');

//var checksums = []; // all sha values
var contributors = [];

d3.json('../misc/guides-commits-master.json', function(jsonMaster) 
{
  d3.json('../misc/guides-commits-newexcellimit.json', function(jsonExcel) 
  {
    d3.json('../misc/guides-commits-sisi.json', function(jsonSisi) 
    {
      d3.json('guides-contributors.json', function(dataContrib) {

        //jsonMaster.forEach(function(d) {
          //checksums.push(d.sha);
        //});

        //jsonExcel.forEach(function(d) {
          //checksums.push(d.sha);
        //});

        //jsonSisi.forEach(function(d) {
          //checksums.push(d.sha);
        //});

        //contribs.map(function(d, i) {
          //console.log(i);
        //});
        
        dataContrib.forEach(function(d) {
          var additions = 0;
          var deletions = 0;
    
          // total additions, deletions for each user
          d.weeks.forEach(function(d) {
            additions += parseInt(d.a);
            deletions += parseInt(d.d);
          });

          contributors.push(
            {
              'login': d.author.login, 
              'commits': d.total,
              'additions': additions,
              'deletions': deletions
            }
          );
        }); // end dataContrib.forEach()




      }); // end dataContrib
    }); // end jsonSis
  }); // end jsonExcel
}); // end jsonMaster
