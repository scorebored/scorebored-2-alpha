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
 * @module score.models
 */
var score = score || {};
score.models = score.models || {};

/**
 * Keeps track of score using simple points.
 * 
 * @class Points
 */
score.models.Points = score.models.Points || function(players, options, events) {
    
    options = options || {};
    events = events || blackchip.Events();
    
    var points;
    var over = false;
        
    var init = function() {
        var playerCount = players().length;
        var startingPoints = options.startingPoints || 0;
        points = _.times(playerCount, function() { return startingPoints; });    
    };
    
    var self = function(id) {
        if ( _.isUndefined(id) ) {
            return points;
        }
        return points[id];
    };
    
    self.players = players;
     
    self.award = function(spec) {
        if ( over ) { 
            return;
        }
        
        var player = spec.player;
        var value = spec.value || 1;
        var id = player.id();
        var previous = points[id];
        points[id] += value || 1;
        events.trigger("before_points");
        events.trigger("points", {
            player: player,
            previous: previous,
            awarded: value,
            points: points,
            type: spec.type || undefined,
            id: spec.id || undefined
        });
        events.trigger("after_points");
    };
    
    self.over = function(value) {
        if ( _.isUndefined(value) ) {
            return over;
        }
        over = value;
    };
            
    self.events = events;
    
    init();
    return self;
};

