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

buster.testCase("blackchip.Properties", {

    "Initialized with properties": function() {
        var props = blackchip.Properties({a: 1, b: 2});
        assert.equals(props.a, 1);
        assert.equals(props.b, 2);
    },
    
    "Events fired on assignment": function() {
        var props = blackchip.Properties({a: 1});
        var listener = this.stub();
        props.events.on("a", listener);
        props.a = 2;
        assert(listener.calledWith(2, "a", 1));
    },
    
    /*
    "Event not fired when assigned the same value": function() {
        var props = blackchip.Properties({a: 1});
        var listener = this.stub();
        props.events.on("a", listener);
        props.a = 1;
        refute.called(listener);  
    },
    
    "Uses provided events object": function() {
        var events = blackchip.Events();
        var props = blackchip.Properties({a: 1}, events);
        var listener = this.stub();
        events.on("a", listener);
        props.a = 2;
        assert(listener.calledWith({
            name: "a",
            value: 2,
            previous: 1,
            properties: {a: 2}
        }));        
    },
    
    "Prefixes property names in events": function() {
        var events = blackchip.Events();
        var props = blackchip.Properties({a: 1}, events, "prefix");
        var listener = this.stub();
        events.on("a", listener);
        props.a = 2;
        assert(listener.calledWith({
            name: "prefix.a",
            value: 2,
            previous: 1,
            properties: {a: 2}
        }));         
    }
    */
});