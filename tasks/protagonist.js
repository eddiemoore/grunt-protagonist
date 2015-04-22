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

  function pro(filepath) {
  	console.log(filepath)
  	if (!grunt.file.exists(filepath)) {
    	return false;
    }

    var protagonist = require('protagonist');

    protagonist.parse(filepath, function (err, result) {
    	if (err) {
    		console.log(err);
    		return;
    	}

    	console.log(result.ast);
    })
  }

  grunt.registerMultiTask('protagonist', 'API Blueprint parser', function() {
		if (!this.data) { return false; }

    var data = this.data,
        file = null;

    // we need to determine if this is a string or an array
    if (typeof(data) === 'string' && (data instanceof Array === false)) {
      // string
      file = grunt.template.process(this.data);
      console.log('API File:', file);
      pro(file);
    } else if (data instanceof Array === true){
      // array, loop through it
      for (var i = 0; i < data.length; i++) {
        file = grunt.template.process(data[i]);
        pro(file);
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
