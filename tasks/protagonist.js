/*
 * grunt-protagonist
 * https://github.com/eddiemoore/grunt-protagonist
 *
 * Copyright (c) 2015 Ed Moore
 * Licensed under the MIT license.
 */

'use strict';

var protagonist = require('protagonist');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  function parseAPI(filepath) {
    if (!grunt.file.exists(filepath)) {
      return false;
    }

    var api = grunt.file.read(filepath)
    // console.log(api);

    protagonist.parse(api, function (err, result) {
      if (err) {
        grunt.log.error(err);
        return;
      }

      console.log('protagonist', result);
      if (result.warnings.length > 0) {
        result.warnings.forEach(function (item, i, a) {
          item.location.forEach(function (loc, k, b) {
            grunt.log.error(item.message + ' ' + loc.index + ':' + loc.length);
          });
        });
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
