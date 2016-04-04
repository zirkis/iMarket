const exec = require('child_process').exec;

module.exports = function (grunt) {
  'use strict';

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);

  //npm install grunt grunt-jscs grunt-contrib-jshint grunt-contrib-watch
  // time-grunt load-grunt-tasks jshint-stylish grunt-execute

  grunt.initConfig({
    watch: {
      options: {
        livereload: true
      },
      js: {
        files: ['app/*.js'],
        tasks: ['jshint:js', 'jscs:js']
      },
      view: {
        files: ['app/index.html', '/style.css']
      },
      viewScripts: {
        files: ['app/*.js'],
        tasks: ['jshint:js', 'jscs:js']
      }
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish'),
        jshintrc: true
      },
      js: {
        src: ['app/*.js']
      }
    },
    jscs: {
      js: {
        src: ['app/*.js']
      }
    }
  });

  grunt.registerTask('default',
    ['jshint:js', 'jscs:js', 'electron', 'watch']);

  grunt.registerTask('electron', function () {
    exec('npm start');
    grunt.log.ok('Electron Started');
  });
};
