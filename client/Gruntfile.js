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
      var done = this.async()
      exec('make browserify', function(err, stdout, stderr) {
        //console.log('[' + new Date() + '] Updated bundle!')
        console.log(stdout)
        console.log(stderr)
        done()
      })
  })

  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['watch'])
}
