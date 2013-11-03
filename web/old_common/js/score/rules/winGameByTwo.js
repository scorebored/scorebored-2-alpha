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
 * @module score.rules
 */
var score = score || {};
score.rules = score.rules || {};

/**
 * Game is won once a certain score has been reached, but must be at least
 * two points ahead of the other player. 
 * 
 * This assumes only two players.
 * 
 * @class winGameByTwo
 * @constructor
 * 
 * @param {object} the target object to receive these new properites.
 * @param {string} options.when The event to listen for when determining
 *        if a game has been one. By default it is "after score".
 * @param {int} options.gameLength Number of points needed to win the game.
 */
score.rules.winGameByTwo = score.rules.winGameByTwo || function(self, options) {

    options = options || {};
    var when = options.when || "after score";
    
    /**
     * True when the winning condition has been achieved.
     * 
     * @property gameOver
     * @type {boolean}
     */
    self.gameOver = false;

    var init = function() {
        self.events.on(when, function() {
            if ( self.undoing ) {
                return;
            }
            if ( self.gameOver ) {
                throw new Error("Game is over");
            }
            var winner = null;
            if ( isWinner(self.scores[0], self.scores[1]) ) {
                winner = "0";
            }
            if ( isWinner(self.scores[1], self.scores[0]) ) {
                winner = "1";
            }
            if ( !_.isNull(winner) ) {
                self.events.trigger("before gameWin", winner);
                self.gameOver = true;
                self.events.trigger("gameWin", winner);
                self.events.trigger("after gameWin", winner);
                self.record(winner, "gameWin");
            }
        });
    
        self.events.on("before options", function(value, name) {
            if ( name === "gameLength" ) {
                var newLength = value;
                if ( self.scores[0] >= newLength || 
                        self.scores[1] >= newLength ) {
                    throw "gameOver";            
                }
            }            
        });
        
        self.events.on("before nextGame", function() {
            self.undoing = true;
        });
    
        self.events.on("nextGame", function() {
            self.gameOver = false;
            self.overTime = false;
            self.undoing = false;
        });
    
        self.events.on("undo gameWin", function() {
            self.gameOver = false;
            self.undo();
        });  
    };
    init();
    
    /**
     * Checks to see the game has gone into overtime.
     * 
     * @method isOverTime
     * @return true if at least one player has a score equal to or greater
     * than the game length but has not outscored the opponent by two.
     */
    self.isOverTime = function() {
        return !self.gameOver && (self.scores[0] >= self.options.gameLength ||
                                  self.scores[1] >= self.options.gameLength);
    };

    /**
     * Checks to see if the next point awarded to any player forces an
     * overtime.
     * 
     * @method isOverTimeNext
     * @return true if both players have a score equal to the game length
     * minus one.
     */
    self.isOverTimeNext = function() {
        return !self.gameOver &&
                (self.scores[0] === self.options.gameLength - 1 &&
                 self.scores[1] === self.options.gameLength - 1);
    };

    /**
     * Checks to see if a player could win the game on the next point.
     * 
     * @method isGamePoint
     * @return true if a player can receive a point and have their score
     * be equal to or greather than the game length and have outscored
     * their opponent by two.
     */
    self.isGamePoint = function() {
        return isWinner(self.scores[0] + 1, self.scores[1]) ||
               isWinner(self.scores[1] + 1, self.scores[0]);
    };

    var isWinner = function(score1, score2) {
        if ( Math.abs(score1 - score2) < 2 ) {
            return;
        }
        return ( score1 >= self.options.gameLength );
    };

    return self;
};

/**
 * Triggered before a game win has been awarded.
 * 
 * @event before gameWin
 * @param {string} player id of the winner.
 */

/**
 * Triggered when a game win has been awarded.
 * 
 * @event gameWin
 * @param {string} player id of the winner.
 */

/**
 * Triggered after all other listeners have been notified of a game win.
 * 
 * @event after gameWin
 * @param {string} player id of the winner.
 */
