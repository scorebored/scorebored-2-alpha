/******************************************************************************
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013-2024 blackchip.org
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

/* jshint -W060 */ // allow document.write

/**
 * @module blackchip
 */
var blackchip = blackchip || {};

/**
 * Simple script loader for development. 
 * 
 * In production, HTML pages will include one, or a few, concatenated,
 * minified, and compressed javascript files. In development, use this
 * instead of listing every script by hand.
 * 
 * Create a file called Scripts.js that invokes the loader with every
 * script to load. Paths should be relative to the root of the application.
 * For example, lets say you have the following files:
 * 
 * * js/module/Foo.js
 * * js/module/Bar.js
 * * js/module/Baz.js
 * 
 * Scripts.js can go anywhere, but lets put it at js/module/Scripts.js. Its
 * contents should be:
 * 
 *      (function() {
 *          blackchip.ScriptLoader.load([
 *              "js/module/Foo.js",
 *              "js/module/Bar.js",
 *              "js/module/Baz.js"
 *          ]);
 *      }());
 * 
 * The HTML file that needs to load these scripts is found at html/index.html.
 * The root of the application is one directory above that file and a 
 * base directory of ".." needs to be set. 
 * 
 * Insert the following into html/index.html:
 * 
 *      <script src="path/to/blackchip/ScriptLoader.js"></script>
 *      <script>blackchip.SCRIPT_BASE_DIR = "..";</script>
 *      <script src="../js/module/Scripts.js"></script>
 * 
 * @class ScriptLoader
 * @static 
 */
blackchip.ScriptLoader = blackchip.ScriptLoader || function() {
    
    var self = {};
    
    /**
     * Loads each script in the order provided. Each script path has
     * blackchip.SCRIPT_BASE_DIR prefixed or "." if that is not specified. 
     * 
     * @method load
     * @static 
     * 
     * @param {string array} bundle Paths to load relative to the application
     * root.
     */
    self.load = function(bundle) {
        var baseDir = blackchip.SCRIPT_BASE_DIR || ".";
        var tags = [];
        
        for ( var i = 0; i < bundle.length; i++ ) {
            path = bundle[i];
            tags.push("<script src='" + baseDir + "/" + path + "'></script>");    
        }
        document.write(tags.join(""));    
    };
    
    return self;
    
}();
