/*
 * grunt-protagonist
 * https://github.com/eddiemoore/grunt-protagonist
 *
 * Copyright (c) 2015 Ed Moore
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  var fs = require('fs');
  var protagonist = require('protagonist');

  function parseAPI(filepath) {
    if (!grunt.file.exists(filepath)) {
      return false;
    }

    var api = fs.readFileSync(filepath, 'utf8');
    console.log(typeof api)

    protagonist.parse(api, function (err, result) {
      if (err) {
        grunt.log.error(err);
        return;
      }

      console.log('protagonist', result);
      if (result.warnings.length > 0) {
        for (var i = 0, len = result.warnings.length; i < len; i++) {
          var item = result.warnings[i];
          for (var k = 0; k < item.location.length; k++) {
            grunt.log.error(item.message + ' ' + item.location[k].index + ':' + item.location[k].length)
          }
        }
      }
    });
  }

  grunt.registerMultiTask('protagonist', 'API Blueprint parser', function() {
    if (!this.data) { return false; }

    var data = this.data,
        file = null;

    // we need to determine if this is a string or an array
    if (typeof(data) === 'string' && (data instanceof Array === false)) {
      // string
      parseAPI(data);
    } else if (data instanceof Array === true){
      // array, loop through it
      for (var i = 0; i < data.length; i++) {
        file = data[i];
        parseAPI(file);
      }
    } else {
      // something else, throw an error
      grunt.log.writeln("Protagonist accepts multiple targets, but each must use a string or array as data. E.g.:");
      grunt.log.writeln("    protagonist : {");
      grunt.log.writeln("        api : 'path/to/api',");
      grunt.log.writeln("        apis : [ 'path/to/apiTwo', 'path/to/apiThree' ]");
      grunt.log.writeln("    }");
    }
  });

};
