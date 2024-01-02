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
 * @module score.features
 */
var score = score || {};
score.features = score.features || {};

/**
 * Keeps track of scores in a round. 
 * 
 * Scores for a round are recorded after all players have performed an action.
 * Example:
 * 
 *      var game = score.Game();
 *      score.features.scores(game);
 *      score.features.round(game);
 * 
 *      game.events.on("round", function(totals) {
 *          console.log(totals[0], totals[1]);
 *      });
 * 
 *      game.scores[0] += 1;
 *      game.scores[1] += 3;
 *      game.scores[0] += 1;
 *      game.scores[1] += 3;
 *      game.endRound(); // Prints "2 6"
 * 
 * An undo will restore all points awarded during the round.
 * 
 * @class round    
 * @constructor
 * @static
 *
 * @param {score.Game} self mix in the these properties into the provided
 * game object. The game object must already be mixed in with 
 * score.features.scores. 
 */
score.features.round = score.features.round || function(self) {

    var scores = {};

    var init = function() {
        zero();
        
        self.events.on("score", function(score, playerId, previous) {
            scores[playerId] += score - previous;
        });

        self.events.on("undo round", function() {
            var done = false;
            while ( !done ) {
                if ( self.history.length === 0 ) {
                    done = true;
                } else if ( _.last(self.history)[0] === "round" ) {
                    done = true;
                } else {
                    self.undo();
                }
            }
        });
    };

    /**
     * Ends the current round.
     * 
     * @method endRound
     */
    self.endRound = function() {
        var event = _.clone(scores);
        self.events.trigger("round", event);
        self.events.trigger("after round", event);
        self.record(event, "round");
        zero();
    };
        
    var zero = function() {
        for ( var i = 0; i < self.options.maxPlayers; i++ ) {
            scores[i] = 0;
        }
    };

    init();
    return self;
};

/**
 * Triggered after a round has ended.
 * 
 * @event round
 * 
 * @param totals {object} A mapping of player ids and total points 
 * awarded this round.
 * @param eventName {string} the value "round" 
 */

/**
 * Triggered after all listeners have been notified that a round has
 * ended.
 * 
 * @event after round
 * 
 * @param totals {object} A mapping of player ids and total points 
 * awarded this round.
 * @param eventName {string} the value "end round" 
 */
