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

blackchip.Properties = blackchip.Properties || 
        function(initial, events, context) {

    var properties = {}; 
    
    var self = {};
    self.events = events || blackchip.Events();

    var init = function() {
        _.each(initial, function(value, name) {
            properties[name] = value;
            var def = {};
            def[name] = { 
                get: function() { return properties[name]; },
                set: _.partial(setValue, name)
            };
            Object.defineProperties(self, def);     
        });    
    };
    
    var setValue = function(name, value) {
        if ( properties[name] === value ) {
            return;
        }    
        var previous = properties[name];
        var event = ( context ) ? context : name;
        
        self.events.trigger("before " + event, value, name, previous);
        properties[name] = value;
        self.events.trigger(event, value, name, previous);
        self.events.trigger("after " + event, value, name, previous);
    };
    
    init();    
    return self;    
};

