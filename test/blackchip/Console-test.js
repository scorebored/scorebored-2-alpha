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

buster.testCase("blackchip.Console", {
    
    originalConsole: null,
    
    setUp: function() {
        originalConsole = console;    
    },
    
    tearDown: function() {
        console = originalConsole;
    },
    
    "Correct method called for error": function() {
        var called = false;
        console.error = function() {
            called = true;
        };
        blackchip.Console.reload();
        blackchip.Console.error("test");
        assert(called);
    },
    
    "Correct method called for warn": function() {
        var called = false;
        console.warn = function() {
            called = true;
        };
        blackchip.Console.reload();
        blackchip.Console.warn("test");
        assert(called);
    },    
    
    "Correct method called for info": function() {
        var called = false;
        console.info = function() {
            called = true;
        };
        blackchip.Console.reload();
        blackchip.Console.info("test");
        assert(called);
    },    
    
    "Correct method called for log": function() {
        var called = false;
        console.log = function() {
            called = true;
        };
        blackchip.Console.reload();
        blackchip.Console.log("test");
        assert(called);
    },
    
    "Error does not crash if there is no console": function() {
        console = null;
        blackchip.Console.reload();
        blackchip.Console.error("test");
    },
    
    "Error does not crash if there is no function": function() {
        console.error = null;
        console.log = null;
        blackchip.Console.reload();
        blackchip.Console.error("error");
    },
    
    "Warn does not crash if there is no console": function() {
        console = null;
        blackchip.Console.reload();
        blackchip.Console.warn("test");
    },
    
    "Warn does not crash if there is no function": function() {
        console.warn = null;
        console.log = null;
        blackchip.Console.reload();
        blackchip.Console.warn("warn");
    },
        
    "Info does not crash if there is no console": function() {
        console = null;
        blackchip.Console.reload();
        blackchip.Console.info("test");
    },
    
    "Info does not crash if there is no function": function() {
        console.info = null;
        console.log = null;
        blackchip.Console.reload();
        blackchip.Console.info("info");
    },
    
    "Log does not crash if there is no console": function() {
        console = null;
        blackchip.Console.reload();
        blackchip.Console.log("test");
    },
    
    "Log does not crash if there is no function": function() {
        console.log = null;
        blackchip.Console.reload();
        blackchip.Console.log("log");
    }
    
});