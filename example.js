var protagonist = require('protagonist');
var fs = require('fs');

var api = fs.readFileSync('example.apib', 'utf8');
// console.log(api)

protagonist.parse(api, function (err, result) {
  if (err) {
    console.error(err);
    return;
  }

  // console.log('protagonist', result);
  if (result.warnings.length > 0) {
    result.warnings.forEach(function (item, i, a) {
      item.location.forEach(function (loc, k, b) {
        console.error(item.message + ' - line:' + api.substr(0, loc.index).split('\n').length);
      });
    });
  }
});
