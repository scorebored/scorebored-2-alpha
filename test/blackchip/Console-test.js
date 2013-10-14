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
            
    "Correct method called for error": function() {
        this.stub(console, "error");
        blackchip.Console.reload();
        blackchip.Console.error("test");
        assert.called(console.error);
    },
    
    "Correct method called for warn": function() {
        this.stub(console, "warn");
        blackchip.Console.reload();
        blackchip.Console.warn("test");
        assert.called(console.warn);
    },    
    
    "Correct method called for info": function() {
        this.stub(console, "info");
        blackchip.Console.reload();
        blackchip.Console.info("test");
        assert.called(console.info);
    },    
    
    "Correct method called for log": function() {
        this.stub(console, "log");
        blackchip.Console.reload();
        blackchip.Console.log("test");
        assert.called(console.log);
    },
    
    "Error does nothing if there is no function": function() {
        this.stub(window, "console");
        blackchip.Console.reload();
        blackchip.Console.error("error");
    },

    "Warn does nothing if there is no function": function() {
        this.stub(window, "console");
        blackchip.Console.reload();
        blackchip.Console.warn("warn");
    },   
    
    "Info does nothing if there is no function": function() {
        this.stub(window, "console");
        blackchip.Console.reload();
        blackchip.Console.info("info");
    },
    
    "Log does nothing if there is no function": function() {
        this.stub(window, "console");
        blackchip.Console.reload();
        blackchip.Console.log("log");
    }
});