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

score.models.Round = score.models.Round || function(spec) {

    var players = spec.players;
    var points = spec.points;
    var current = [];
    var history = [];
    var self = {};
    self.events = blackchip.Events();
    
    self.award = function(spec) {
        current.push({
            value: spec.value || 1,
            player: spec.player,
            type: spec.type || undefined,
            id: spec.id || undefined
        });    
    };
    
    self.commit = function() {
        self.events.trigger("before_round");
        historyItem = [];
        _.each(current, function(award) {
            points.award(award);
            historyItem.push(award);     
        });
        history.push(historyItem);
        current = [];
        self.events.trigger("round", historyItem);
        self.events.trigger("after_round");
    };
        
    return self;
};
