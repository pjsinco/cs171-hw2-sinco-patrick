console.log('blue');

var master = [];
var excel = [];
var sisi = [];

d3.json('../misc/guides-commits-master.json', function(jsonMaster) 
{
  d3.json('../misc/guides-commits-newexcellimit.json', function(jsonExcel) 
  {
    d3.json('../misc/guides-commits-sisi.json', function(jsonSisi) 
    {
      
    }); // end jsonSis
  }); // end jsonExcel
}); // end jsonMaster
