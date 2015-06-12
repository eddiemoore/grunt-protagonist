/*
 * grunt-protagonist
 * https://github.com/eddiemoore/grunt-protagonist
 *
 * Copyright (c) 2015 Ed Moore
 * Licensed under the MIT license.
 */

'use strict';

var protagonist = require('protagonist');
var fs = require('fs');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  function parseAPI(filepath, done) {
    if (!grunt.file.exists(filepath)) {
      grunt.fail.warn('File ' + filepath + ' doesn\'t exist')
        return false;
    }

    var api = fs.readFileSync(filepath, 'utf8');

    protagonist.parse(api, function (err, result) {
      if (err) {
        grunt.fail.warn(err);
        return;
      }

      if (result.warnings.length > 0) {
        var warnings = '';
        result.warnings.forEach(function (item, i, a) {
          item.location.forEach(function (loc, k, b) {
            warnings += 'line:' + api.substr(0, loc.index).split('\n').length + ' - ' + item.message + "\n";
          });
        });
        grunt.fail.warn(warnings);
      }
      done();
    });

  }

  grunt.registerMultiTask('protagonist', 'API Blueprint parser', function() {
    if (!this.data) { return false; }

    var data = this.data,
        file = null,
        done = this.async();

    // we need to determine if this is a string or an array
    if (typeof(data) === 'string' && (data instanceof Array === false)) {
      // string
      parseAPI(data, done);
    } else if (data instanceof Array === true){
      // array, loop through it
      for (var i = 0; i < data.length; i++) {
        file = data[i];
        parseAPI(file, done);
      }
    } else {
      // something else, throw an error
      grunt.log.writeln("Protagonist accepts multiple targets, but each must use a string or array as data. E.g.:");
      grunt.log.writeln("    protagonist : {");
      grunt.log.writeln("        api : 'path/to/api',");
      grunt.log.writeln("        apis : [ 'path/to/apiTwo', 'path/to/apiThree' ]");
      grunt.log.writeln("    }");
      done();
    }
  });

};
