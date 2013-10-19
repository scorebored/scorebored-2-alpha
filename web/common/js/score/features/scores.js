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
 * @module score.features
 */
var score = score || {};
score.features = score.features || {};

/**
 * Records the scores for each player.
 * 
 * Example:
 * 
 *      var game = score.Game();
 *      score.features.scores(game);
 * 
 *      game.events.on("score", function(value, playerId) {
 *          console.log("Player", playerId, "got", value, "point(s)");
 *      });
 * 
 *      game.scores[0] += 10; // Prints "Player 0 got 10 point(s)"
 * 
 * @class scores
 * @constructor
 * @statc
 * 
 * @param {score.Game} self mix in the these properties into the provided
 * game object.
 */
score.features.scores = score.features.scores || function(self) {
    
    /**
     * Scores of each player keyed by player id.
     * 
     * @property scores
     * @type {object}
     */
    self.scores = null;
    
    var init = function() {
        var scores = {};
        
        for ( var i = 0; i < self.options.maxPlayers; i++ ) {
            scores[i] = self.options.startingScore || 0;
        }

        /**
         * Triggered before a score is changed.
         * 
         * @event before score
         * 
         * @param value {object} the new value of the score
         * @param playerId {object} the player's score that was changed
         * @param previous {object} the previous value of the score
         * @param eventName {string} the value "before score"
         */
        
        /**
         * Triggered when a score is changed.
         * 
         * @event score
         * 
         * @param value {object} the new value of the score
         * @param playerId {object} the player's score that was changed
         * @param previous {object} the previous value of the score
         * @param eventName {string} the value "score"
         */
        
        /**
         * Triggered after all listeners have been notified of a score change.
         * 
         * @event after score
         * 
         * @param value {object} the new value of the score
         * @param playerId {object} the player's score that was changed
         * @param previous {object} the previous value of the score
         * @param eventName {string} the value "after score"
         */
        self.scores = blackchip.Properties(scores, self.events, "score");

        self.events.on("score", function() {
            self.record.apply(null, arguments);
        });
        
        /**
         * Triggered when an undo of a scoring event is requested.
         * 
         * @event undo score
         * 
         * @param value {object} the new value of the score when the event was 
         *        applied.
         * @param playerId {object} the player's score that was changed
         * @param previous {object} the previous value of the score before the 
         *        event was applied
         * @param eventName {string} the value "undo score"
         */
        self.events.on("undo score", function(value, playerId, previous) {
            self.scores[playerId] = previous;
        });    
        
        /**
         * Triggered when an redo of a scoring event is requested.
         * 
         * @event redo score
         * 
         * @param value {object} the requested new score
         * @param playerId {object} the player's score that was changed
         * @param current {object} the current score
         * @param eventName {string} the value "redo score"
         */
        self.events.on("redo score", function(value, playerId, previous) {
            self.scores[playerId] = value;    
        });
    };    
                  
    init();
    return self;
    
};





