console.log('blue');

var hashes = []; // all sha values

d3.json('../misc/guides-commits-master.json', function(jsonMaster) 
{
  d3.json('../misc/guides-commits-newexcellimit.json', function(jsonExcel) 
  {
    d3.json('../misc/guides-commits-sisi.json', function(jsonSisi) 
    {
      jsonMaster.forEach(function(d) {
        hashes.push(d.sha);
      });

      jsonExcel.forEach(function(d) {
        hashes.push(d.sha);
      });

      jsonSisi.forEach(function(d) {
        hashes.push(d.sha);
      });

      console.log(hashes);
    }); // end jsonSis
  }); // end jsonExcel
}); // end jsonMaster
