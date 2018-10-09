// server.js
// where your node app starts

// We're going to use the "Product Catalog and Orders" base template:
// https://airtable.com/templates/featured/expZvMLT9L6c4yeBX/product-catalog-and-orders
var Airtable = require('airtable');
var base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID);
var tableName = 'Environments';
var viewName = 'Main View';

var express = require('express');
var app = express();

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/models", function(request, response) {
  response.sendFile(__dirname + '/views/models.html');
});

// Cache the records in case we get a lot of traffic.
// Otherwise, we'll hit Airtable's rate limit.
var cacheTimeoutMs = 5 * 1000; // Cache for 5 seconds.
var cachedResponse = null;
var cachedResponseDate = null;

app.get("/leaf", function(request, response) {
  var baseToSearch = request.query.base;
  var idOfEnv = request.query.daeId;
  //var nameOfEnv = request.query.daeName;
  
  //console.log(baseToSearch, idOfEnv);
  
  base(baseToSearch).find(idOfEnv, function(err, record) {
      if (err) { console.error(err); return; }
    
    //  console.log(record.fields);
      response.send(record.fields);
    
  });

});

app.get("/data", function(_, response) {
  
  // cachedResponse not null and more than 5 seconds has passed 
  if (cachedResponse && new Date() - cachedResponseDate < cacheTimeoutMs) { 
    response.send(cachedResponse);
  } else {
    // Select the first 10 records from the view.
    base(tableName).select({
      minRecords: 400,
      view: viewName,
    }).firstPage(function(error, records) {
      
      // if there is not an error
      if (error) { response.send({error: error}); } else {
        
        // fill 'cachedResponse' with records 
        cachedResponse = {
          records: records.map(record => {
            return {
              //  Main
              id:            record.get('ID'),
              name:          record.get('Name'),
              picture:       record.get('Picture'),
              //creatorIDs:      record.get('Creator'),
              
              //creators: deeperSearch('Creators', record.get('Creator')),
              //creators: deeperSearch('', record.get('Creator')),
              
              //  Affiliation 
              // school:        record.get('school'),
              // schoolDetail:  record.get('Dept/Lab/Studio/Group'),
              // company:       record.get('Company'),
              
              //  Date Range
              firstYear:     record.get('FirstYear'),
              lastYear:      record.get('LastYear'),
              
              //  Other
              highlight:     record.get('highlight')
              
            };
          }),
        };
        cachedResponseDate = new Date();
        
        response.send(cachedResponse);
      }
    });
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

function deeperSearch(base, IDs) {
  if (IDs == null) {return null} 
  else {
    // each ID is a name
    //console.log("----->" + IDs);
    var listOfResults = [];
    
    IDs.forEach(function(ID) {
      console.log("--->" + ID);
      base(base).find(ID, function(err, result) {
        if (err) { console.error(err); return; }
        else {
          var localName = result.fields.Name;
          //console.log(result.fields.Name);
          listOfResults.push(localName);
          return listOfResults;
        }
      });
      return listOfResults;
    });
  console.log(listOfResults);
  }
}