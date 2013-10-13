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

buster.testCase("blackchip.Events", {

    "Trigger an event": function() {
        var events = blackchip.Events();
        var triggered = false;
        events
            .on("test", function() {
                triggered = true;    
            })
            .trigger("test");
        assert(triggered);
    },
    
    "Pass argument to event": function() {
        var events = blackchip.Events();
        events
            .on("test", function(arg) {
                assert.equals(arg, 42);   
            })
            .trigger("test", 42);    
    },
    
    "Remove listener": function() {
        var events = blackchip.Events();
        var count = 0;
        var listener = function() {
            count++;
        };
        events
            .on("test", listener)
            .trigger("test")
            .off("test", listener)
            .trigger("test");
        assert.equals(count, 1);
    },
    
    "Listen to all events": function() {
        var events = blackchip.Events();
        var calledA = null;
        var calledB = null;
        events
            .all(function(event, name) { 
                if ( name === "a" ) { calledA = true; }
                if ( name === "b" ) { calledB = true; }
            })
            .trigger("a")
            .trigger("b");
        assert(calledA);
        assert(calledB);
    },
    
    "Remove all events listener": function() {
        var events = blackchip.Events();
        var calledA = 0;
        var calledB = 0;
        var listener = function(event, name) {
            if ( name === "a" ) { calledA++; }
            if ( name === "b" ) { calledB++; }
        };
        events
            .all(listener)
            .trigger("a")
            .trigger("b")
            .none(listener)
            .trigger("a")
            .trigger("b");
            
        assert.equals(calledA, 1);
        assert.equals(calledB, 1);        
    }    
    
});
