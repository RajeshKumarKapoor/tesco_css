# README

## Technologies used

* Templates, CSS and JavaScripts are compiled using the [Grunt](http://gruntjs.com/) build tool.
* CSS is compiled from [SCSS](http://sass-lang.com/) templates using the [Compass](http://compass-style.org/) framework.
* HTML templates are compiled from [EJS](http://embeddedjs.com/) templates
* JavaScript is compiled using [Uglify](https://github.com/mishoo/UglifyJS) for minification
* JavaScript functionality is tested using the [Jasmine](http://pivotal.github.io/jasmine/) framework

## Pre-requisites

The following software must be installed:

* [npm](https://npmjs.org/) package manager
* [Grunt](http://gruntjs.com/) build tool
* [Ruby](http://ruby-lang.org/) language
* [RubyGems](http://ruby-lang.org/) package manager
* [Compass](http://compass-style.org/) Ruby Gem

The installation process differs between environments so please refer to the documentation linked above.

When you have installed all of the above, run the following from the project root (`/development/trunk`):

    $ npm install

This will install the additional Grunt dependancies.

## Running tests

To run the Jasmine test suite, execute the following command:

    $ grunt spec

## Building for development

To compile the assets for the development environment (no JavaScript minification), use the default task:

    $ grunt

Run the watch task in the background if you'd like any changes to be automatically re-compiled when you save changes:

    $ grunt watch

## Building for production

To compile the assets for the production environment, use the build task:

    $ grunt build

## Test suite

The test suite uses the Jasmine framework to provide automated testing of the JavaScript functionality.

The test files are located in spec/coffeescripts and are written in CoffeeScript. When you run the `grunt test` task, they're compiled into JavaScript and the tests are run automatically, reporting back which tests pass and fail.

## HTML Templates

HTML templates are written using EJS, primarily to reduce duplication of code. They exist in `src/html`.

They are compiled to static HTML when built using Grunt.

## JavaScript

JavaScripts exist in `src/javascripts`.

## CSS

CSS is written using the SCSS superset language. They are compiled to standard CSS using Grunt.

The Bootstrap and Compass frameworks are also used. Compass must be installed in order to compile the CSS.
