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

/**
 * @module blackchip
 */
var blackchip = blackchip || {};

/**
 * Creates an object with properties that fire events when values are set.
 * 
 * For example:
 * 
 *      var events = blackchip.Events();
 *      var props = blackchip.Properties({a: 1, b: 2}, events);
 *      console.log(props.a); // Prints out: 1
 * 
 *      events.on("b", function(value, name, previous) {
 *          console.log(name, value, "was", previous); 
 *      });
 *      props.b = "foo"; // Prints out: b foo was 2
 * 
 * @class Properties
 * @constructor
 * 
 * @param {object} initial A mapping of property names and values that 
 * should initially be defined in the object.
 *
 * @param {blackchip.Events} events The events object to use. 
 * 
 * @param {string} [triggerAs] Trigger events with this name instead of
 * using the name of the property changed.
 */
blackchip.Properties = blackchip.Properties || 
        function(initial, events, triggerAs ) {

    var properties = {};     
    var self = {};

    var init = function() {
        _.each(initial, function(value, name) {
            if ( _.isUndefined(properties[name]) ) {
                var def = {};
                def[name] = { 
                    get: function() { return properties[name]; },
                    set: _.partial(setValue, name)
                };
                Object.defineProperties(self, def);                     
            }
            properties[name] = value;
        });    
    };
    
    var setValue = function(name, value) {
        if ( properties[name] === value ) {
            return;
        }    
        var previous = properties[name];
        var event = ( triggerAs ) ? triggerAs : name;
        
        events.trigger("before " + event, value, name, previous);
        properties[name] = value;
        events.trigger(event, value, name, previous);
        events.trigger("after " + event, value, name, previous);
    };
    
    init();    
    return self;    
};

/**
 * Triggered before a property value is set. The event name "*"
 * will be the same as the property name unless "triggerAs" was provided in
 * the constructor and that name will be used instead.
 * 
 * Example:
 * 
 *      var props = blackchip.Properties({a: 1});
 *      props.events.on("before a", function(value) {
 *          ...    
 *      });   
 * 
 * With triggerAs:
 * 
 *      var props = blackchip.Properties({a: 1}, "foo");
 *      props.events.on("before foo", function(value, name) {
 *          ...
 *      });
 * 
 * @event before *
 * 
 * @param {object} value the value that will be assigned
 * @param {object} name the property name that will be assigned
 * @param {object} previous the value that will be overwritten
 */

/**
 * Triggered anytime a property value is set. The event name "*"
 * will be the same as the property name unless "triggerAs" was provided in
 * the constructor and that name will be used instead.
 * 
 * @event *
 * 
 * Example:
 * 
 *      var props = blackchip.Properties({a: 1});
 *      props.events.on("a", function(value) {
 *          ...    
 *      });   
 * 
 * With triggerAs:
 * 
 *      var props = blackchip.Properties({a: 1}, "foo");
 *      props.events.on("foo", function(value, name) {
 *          ...
 *      });
 * 
 * @param {object} value the value that was assigned
 * @param {object} name the property name that was assigned
 * @param {object} previous the value that was overwritten
 */

/**
 * Triggered after all listeners have been notified of a property change. The 
 * event name "*" will be the same as the property name unless "triggerAs" was 
 * provided in the constructor and that name will be used instead.
 * 
 * Example:
 * 
 *      var props = blackchip.Properties({a: 1});
 *      props.events.on("after a", function(value) {
 *          ...    
 *      });   
 * 
 * With triggerAs:
 * 
 *      var props = blackchip.Properties({a: 1}, "foo");
 *      props.events.on("after foo", function(value, name) {
 *          ...
 *      });
 * 
 * @event after *
 *
 * @param {object} value the value that was assigned
 * @param {object} name the property name that was assigned
 * @param {object} previous the value that was overwritten
 */
