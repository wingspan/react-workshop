/*global module:false*/
module.exports = function (grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

        react: {
            app: {
                files: [{ expand: true, cwd: 'webapp/js', src: ['**/*.js'], dest: 'webapp/js-built', ext: '.js' }]
            }
        },

        less: {
            development: {
                options: {
                    paths: ['styles'],
                    ieCompat: true,
                    yuicompress: true,
                    report: 'min'
                },
                files: {
                    'webapp/styles/App.css': 'webapp/styles/App.less'
                }
            }
        },

        clean: ['webapp/js-built', 'webapp/styles/App.css']

    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', ['react', 'less']);
};
