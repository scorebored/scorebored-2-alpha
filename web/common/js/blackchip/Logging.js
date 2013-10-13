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
 * Simple logging utility. 
 * 
 * Loggers only print information to the console if enabled. To obtain a 
 * named logger:
 * 
 *      var log = Logging.get("myLogger");
 * 
 * The there are only four logging levels:
 * 
 * * disabled: Nothing is printed to the console.
 * * enabled: error, warning, info, and log messages are printed.
 * * debug: Everything with enabled including debug messages.
 * * trace: Everything with debug including trace messages.
 * 
 * Example to enable debug logging on the above logger:
 * 
 *      Logging.debug("myLogger");
 * 
 * There is only one instance of a logger for each name. This is NOT like
 * log4j and there is no "hierarchy"
 * 
 * @class Logging
 * @static
 */
blackchip.Logging = blackchip.Logging || function() {
    
    var loggers = {};
    var self = {};
        
    /**
     * Returns a named logger instance. The same instance is used for each
     * logger name. 
     * 
     * @method get
     * @static
     * 
     * @param {string} name Instance name of the logger
     * 
     * @return {Logger}
     */
    self.get = function(name) {
        var logger = loggers[name];
        if ( !logger ) {
            logger = {};
            disable(logger);
            loggers[name] = logger;       
        }    
        return logger;
    };
    
    /**
     * Disables all logging for the given logger.
     * 
     * @method disable
     * @static
     * 
     * @param {string} name Instance of the logger to disable logging.
     */
    self.disable = function(name) {
        disable(self.get(name));    
    };
    
    /**
     * Enables basic logging for the given logger. This will allow error,
     * warn, info, and log messages to be printed.
     * 
     * @method enable
     * @static
     * 
     * @param {string} name Instance of the logger to enable logging.
     */
    self.enable = function(name) {
        enable(self.get(name));
    };
    
    /**
     * Enables debug logging for the given logger. This will allow error,
     * warn, info, log, and debug messages to be printed.
     *
     * @method debug
     * @static
     * 
     * @param {string} name Instance of the logger to enable debug logging.
     */
    self.debug = function(name) {
        debug(self.get(name));
    };
    
    /**
     * Enables trace logging for the given logger. This will allow error,
     * warn, info, log, debug, and trace message to be printed.
     *
     * @method trace
     * @static
     * 
     * @param {string} name Instance of the logger to enable trace logging.
     */
    self.trace = function(name) {
        trace(self.get(name));
    };

    //-------------------------------------------------------------------------
    // Private
    //-------------------------------------------------------------------------
     
    var disable = function(logger) {
        logger.error = function() {};
        logger.warn  = function() {};
        logger.info  = function() {};
        logger.log   = function() {};
        logger.debug = function() {};
        logger.trace = function() {};   
    };
    
    var enable = function(logger) {
        logger.error = blackchip.Console.error;
        logger.warn  = blackchip.Console.warn;
        logger.info  = blackchip.Console.info;
        logger.log   = blackchip.Console.log;    
    };
    
    var debug = function(logger) {
        enable(logger);
        logger.debug = blackchip.Console.log;
    };
    
    var trace = function(logger) {
        enable(logger);
        debug(logger);
        logger.trace = blackchip.Console.log;
    };
     
    return self;
    
}();

/**
 * Logging object retrieved from Logging.get(). This object cannot be created
 * directly.
 * 
 * Use as in the following:
 * 
 *      var log = Logging.get("myLogger");
 *      log.debug("This is a debugging message");
 * 
 * @class Logger
 */

/** 
 * Prints out an error message to the console if the logger has been enabled.
 * Otherwise does nothing.
 * 
 * @method error
 * 
 * @param {object} [arguments*] Arguments to pass to console.error
 */

/** 
 * Prints out a warning message to the console if the logger has been enabled.
 * Otherwise does nothing.
 * 
 * @method warn
 * 
 * @param {object} [arguments*] Arguments to pass to console.warn
 */

/** 
 * Prints out an informational message to the console if the logger has been 
 * enabled. Otherwise does nothing.
 * 
 * @method info
 * 
 * @param {object} [arguments*] Arguments to pass to console.info
 */

/** 
 * Prints out a logging message to the console if the logger has been 
 * enabled. Otherwise does nothing.
 * 
 * @method log
 * 
 * @param {object} [arguments*] Arguments to pass to console.log
 */

/** 
 * Prints out a message to the console if the logger has debugging
 * enabled. Otherwise does nothing.
 * 
 * @method debug
 * 
 * @param {object} [arguments*] Arguments to pass to console.log
 */

/** 
 * Prints out a message to the console if the logger has tracing
 * enabled. Otherwise does nothing.
 * 
 * @method trace
 * 
 * @param {object} [arguments*] Arguments to pass to console.log
 */
