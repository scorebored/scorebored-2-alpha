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
 * General event pump.
 * 
 * This has the same naming scheme as jQuery:
 * 
 * * Register listeners with on()
 * * Unregister listeners with off()
 * * Fire events with trigger()
 * 
 * The all() method can be used to register for all events which can be
 * useful when debugging. Use none() to remove the listener from all events.
 * 
 * Example:
 * 
 *      var events = blackchip.Events();
 *      events.on("answer", function(answer) {
 *          console.log("Answer to life, the universe, and everything", answer);
 *      });
 *      
 *      events.trigger("answer", 42);
 * 
 * All functions return the Events object to allow chaining:
 * 
 * Example:
 * 
 *      events
 *          .on("foo", function() { 
 *              console.log("foo"); 
 *          })
 *          .on("bar", function() {
 *              console.log("bar");
 *          });
 * 
 * @class Events
 */
blackchip.Events = blackchip.Events || function() {
    
    var listeners = {};
    var allListeners = [];
    var self = {};
    
    /**
     * Registers a listener for an event.
     * 
     * @method on
     * 
     * @param {string} event Name of the event to listen for.
     * 
     * @param {function} listener Invoked when the event is triggered. First
     * argument will be the value passed to the trigger method, the second
     * argument will be the name of this event.
     * 
     * @return {Events} this object for chaining. 
     */
    self.on = function(event, listener) {
        listeners[event] = listeners[event] || [];
        listeners[event].push(listener);
        return self;
    };
    
    /**
     * Registers a listener for all events.
     * 
     * @method all
     * 
     * @param {function} listener Invoked when an event is triggered. First
     * argument will be the value passed to the trigger method, the second
     * argument will be the name of this event.
     * 
     * @return {Events} this object for chaining. 
     */
    self.all = function(listener) {
        allListeners.push(listener);
        return self;
    };
    
    /**
     * Unregisters a listener. The listener must have been registered with
     * on(), otherwise this method does nothing.
     * 
     * @method off
     * 
     * @param {string} event Name of the event the listener was registered for.
     * 
     * @param {function} listener Listener to remove.
     * 
     * @return {Events} this object for chaining. 
     */
    self.off = function(event, listener) {
        if ( listeners[event] ) {
            var index = _.indexOf(listeners[event], listener);
            if ( index >= 0 ) {
                listeners[event].splice(index, 1);
            }
        }
        return self;
    };
    
    /**
     * Unregisters a listen from all events. The listener must have been
     * registered with all(), otherwise this method does nothing.
     * 
     * @method none
     * 
     * @param {function} listener Listener to remove.
     * 
     * @return {Events} this object for chaining.
     */
    self.none = function(listener) {
        var index = _.indexOf(allListeners, listener);
        if ( index >= 0 ) {
            allListeners.splice(index, 1);
        }
        return self;        
    };
    
    /**
     * Triggers an event and notifies all listeners. 
     * 
     * @method trigger
     * 
     * @param {string} event Name of the event to trigger.
     * 
     * @param {object} [arg] Single argument to pass to each listener. Use
     * arrays or objects if more than one value needs to be passed. 
     * 
     * @return {Events} this object for chaining. 
     */
    self.trigger = function(event, arg) {
        if ( listeners[event] ) {
            _.each(listeners[event], function(listener) {
                listener(arg, event);    
            });
        }
        _.each(allListeners, function(listener) {
            listener(arg, event);    
        });
        return self;     
    };
    
    return self;
};
