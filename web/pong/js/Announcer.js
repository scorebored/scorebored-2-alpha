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

score.pong = score.pong || {};

score.pong.Announcer = score.pong.Announcer || function(pong, talker) {

    var say = talker.say;
    
    pong.points.events.on("before_points", function() {
        var serviceChange = false;
        var pointsEvent;
        
        var onPoints = function(event) {
            pointsEvent = event;
        };
        pong.points.events.on("points", onPoints);
        
        var onServiceChange = function() {
            serviceChange = true;
        };
        pong.server.events.on("change", onServiceChange);
        
        var onAfterPoints = function() {
            say("Point", pointsEvent.player.name());
            if ( serviceChange ) {
                say("Change servers");
            }
            say(pong.points(0) + " - " + pong.points(1));
            
            pong.points.events.off("points", onPoints);
            pong.points.events.off("change", onServiceChange);
            pong.points.events.off("after_points", onAfterPoints);   
        };
        pong.points.events.on("after_points", onAfterPoints);
    });
    
    
            
};

