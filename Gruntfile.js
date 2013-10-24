/******************************************************************************
 * The MIT License (MIT)
 *
 * Copyright (c) 2013 blackchip.org
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 *****************************************************************************/

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            main: [
                "web/common/js/**/*.js",
                "web/pong/*.js"
            ]
        },

        buster: {
            all: {}
        },

        yuidoc: {
            compile: {
                name: "Scorebored",
                description: "Description here",
                version: "2.0",
                url: "http://example.com",
                options: {
                    paths: ["web/common/js", "web/pong"],
                    outdir: "build/doc"
                }
            }
        },

        copy: {
            source: {
                files: [
                    {expand: true, cwd: "web",
                        src: ["**", "!**/Scripts.js"],
                        dest: "build/scorebored"},
                    {expand: true, cwd: "web",
                        src: ["**", "!**/Scripts.js"],
                        dest: "build/scorebored-debug"}
                ]
            }
        },

        replace: {
            links: {
                src: [
                    "build/scorebored/**/*.html",
                    "build/scorebored/common/css/**/*.css",
                    "build/scorebored/pong/css/**/*.css",
                    "build/scorebored-debug/**/*.html",
                    "build/scorebored-debug/common/css/**/*.css",
                    "build/scorebored-debug/pong/css/**/*.css"
                ],
                overwrite: true,
                replacements: [
                    {from: /.*<!-- *link.dev *-->.*/g, to: ""} ,
                    {from: /.*\/\* *link.dev *\*\/.*/g, to: ""},
                    {from: /.*<!-- *link.prod *-->.*<!--(.*)-->/g, to: "$1"},
                    {from: /.*\/\* *link.prod *\*\/.*\/\*(.*)\*\//g, to: "$1"}
                ]
            }
        },

        concat: {
            js: {
                src: [
                    "build/scorebored/common/js/**/*.js",
                    "build/scorebored/pong/js/**/*.js"
                ],
                dest: "build/scorebored-debug/scorebored.js"
            },
            css: {
                src: [
                    "build/scorebored/common/css/*.css",
                    "build/scorebored/pong/css/*.css"
                ],
                dest: "build/scorebored-debug/scorebored.css"
            }
        },

        uglify: {
            js: {
                files: {
                    "build/scorebored/scorebored.js": [
                        "build/scorebored-debug/scorebored.js"
                    ]
                }
            }
        },

        cssmin: {
            minify: {
                src: ["build/scorebored-debug/scorebored.css"],
                dest: "build/scorebored/scorebored.css"
            }
        },

        clean: {
            build: ["build"],
            source: [
                "build/**/*.js",
                "!build/scorebored/scorebored.js",
                "!build/scorebored-debug/scorebored.js",
                "!build/**/lib/**/*.js",
                "build/**/*.css",
                "!build/scorebored/scorebored.css",
                "!build/scorebored-debug/scorebored.css",
                "!build/**/lib/**/*.css"
             ]
        },

        exec: {
            removeEmptyDirs: {
                cmd: "find build -type d -empty -delete"
            }
        }
    });

    grunt.loadNpmTasks("grunt-buster");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks("grunt-rename");
    grunt.loadNpmTasks("grunt-text-replace");

    grunt.registerTask("default", [
        "clean:build",
        "copy:source",
        "replace",
        "concat",
        "uglify",
        "cssmin",
        "clean:source",
        "exec:removeEmptyDirs"
    ]);

    grunt.registerTask("doc", ["yuidoc"]);
    grunt.registerTask("lint", ["jshint"]);
    grunt.registerTask("test", ["buster"]);
};
