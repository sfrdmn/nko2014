var exec = require('child_process').exec

module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      files: ['lib/**/*.js'],
      tasks: ['make']
    }
  })

  grunt.registerTask('make', function() {
      exec('make')
      console.log('[' + new Date() + '] Updated bundle!')
  })

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch'])
}
