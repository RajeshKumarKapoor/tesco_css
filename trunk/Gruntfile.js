module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({

    // Store your Package file so you can reference its specific data whenever necessary
    pkg: grunt.file.readJSON('package.json'),

    bless: {
      css: {
        options: {},
        files: {
          'css/desktop.css':'css/desktop.css', 
          'css/mobile.css':'css/mobile.css',
          'css/tablet.css':'css/tablet.css',
          'css/old-ie.css':'css/old-ie.css',
        }
      }
    },

    compass: {
      dist: {
        options: {
          sassDir: './src/sass/',
          cssDir: './css/',
          environment: 'production',
          outputStyle: 'expanded'
        }
      }
    },

    concat: {
      dist: {
        src: ['src/javascripts/jquery.1.7.2.js', 'src/javascripts/*.js'],
        dest: 'js/script.js'
      }
    },
    
    uglify: {
      dist: {
        src: ['src/javascripts/jquery.1.7.2.js', 'src/javascripts/*.js'],
        dest: 'js/script.js'
      }
    },

    // Run: `grunt watch` from command line for this section to take effect
    watch: {
      css: {
        files: './src/sass/**/*.scss',
        tasks: ['compass:dist', 'bless'],
        options: {
          livereload: true,
        }
      },
      js: {
        files: 'src/javascripts/*.js',
        tasks: 'concat',
        options: {
          livereload: true,
        }
      },
      templates: {
        files: ['./src/**/*.ejs', './src/**/*.html'],
        tasks: 'ejs',
        options: {
          livereload: true,
        }
      }
    },

    coffee: {
      specs: {
        files: [{
          expand: true,
          cwd: 'spec/coffeescripts/',
          src: '*.coffee',
          dest: 'spec/javascripts/',
          ext: '.js'
        }]
      },
      helpers: {
        files: [{
          expand: true,
          cwd: 'spec/coffeescripts/helpers/',
          src: '*.coffee',
          dest: 'spec/javascripts/helpers/',
          ext: '.js'
        }]
      }
    },

    jasmine: {
      specs: {
        src: ['src/javascripts/jquery.1.7.2.js', 'src/javascripts/*.js'],
        options: {
          vendor: ['js/modernizr.js', 'spec/lib/jasmine-jquery.js'],
          specs: 'spec/javascripts/*.js',
          helpers: 'spec/javascripts/helpers/helpers.js',
          keepRunner: true
        }
      }
    },

    ejs: {
      all: {
        cwd: 'src/html',
        src: ['**/*.ejs', '**/*.html', '!**/_*'],
        dest: '',
        expand: true,
        ext: '.html',
      }
    }

  });


  // Load NPM Tasks
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-bless');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-ejs');

  // Default Task
  grunt.registerTask('default', ['ejs', 'compass:dist', 'bless', 'concat']);
  grunt.registerTask('build', ['ejs', 'compass:dist', 'bless', 'uglify:dist']);
  grunt.registerTask('spec', ['coffee', 'jasmine']);

};