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

/**
 * @module blackchip
 */
var blackchip = blackchip || {};

/**
 * Console object that is guaranteed to have certain methods. This can 
 * safely be used as a replacement for the console object.
 * 
 * @class Console
 */
blackchip.Console = blackchip.Console || (function() {
    
    var self = {};
    
    var init = function() {
        /**
         * Writes a message to the console. If console or console.log is not
         * defined, this method does nothing.
         * 
         * @method log
         * @static
         * 
         * @param {object} [arguments*] Arguments to pass to console.log
         */
        self.log = ( console && console.log ) 
                ? console.log.bind(console) 
                : _.identity;
    
        /**
         * Writes an error message to the console. If console or console.error
         * is not defined, this method is the same as Console.log.
         * 
         * @method error
         * @static
         * 
         * @param {object} [arguments*] Arguments to pass to console.error
         */
        self.error = ( console && console.error ) 
                ? console.error.bind(console) 
                : self.log;
        
        /**
         * Writes a warning message to the console. If console or console.warn
         * is not defined, this method is the same as Console.log.
         * 
         * @method warn
         * @static
         * 
         * @param {object} [arguments*] Arguments to pass to console.warn
         */  
        self.warn = ( console && console.warn ) 
                ? console.warn.bind(console) 
                : self.log;      
                
        /**
         * Writes an informational message to the console. If console or 
         * console.info is not defined, this method is the same as Console.log.
         * 
         * @method info
         * @static
         * 
         * @param {object} [arguments*] Arguments to pass to console.warn
         */          
        self.info = ( console && console.info ) 
                ? console.info.bind(console) 
                : self.log;
  
    };
    
    /**
     * Reloads the functions with current definitions found in the global 
     * console object.
     * 
     * @method reload
     * @static
     */
    self.reload = function() {
        init();
    };
    
    return self;
    
}());



