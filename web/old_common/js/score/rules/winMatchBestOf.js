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
 * @modules score.rules.winMatchBestOf
 */
var score = score || {};
score.rules = score.rules || {};

/**
 * Match is one when one players wins the best X of of Y games. This
 * condition is true if the number of games one by a player is greater than
 * half of the match length.
 * 
 * @class winMatchBestOf
 */
score.rules.winMatchBestOf = score.rules.winMatchBestOf || function(self) {

    /**
     * True when the winning condition for the match has been achieved.
     * 
     * @property matchOver
     */
    self.matchOver = false;

    var init = function() {
        self.events.on("game", function(games, player) {
            if ( self.undoing ) {
                return;
            }
            if ( self.matchOver ) {
                throw new Error("Match is over");
            }
            if ( isWinner(self.games[player]) ) {
                self.events.trigger("before matchWin", player);
                self.matchOver = true;
                self.events.trigger("matchWin", player);
                self.events.trigger("after matchWin", player);
                self.record(player, "matchWin");
            }
        });
    
        self.events.on("before options", function(value, name) {
            if ( name === "matchLength" ) {
                var newLength = value;
                if ( isWinner(self.games[0], newLength) ||
                        isWinner(self.games[1], newLength) ) {
                    throw "matchOver";            
                }      
            }
        });
        
        self.events.on("undo matchWin", function() {
            self.matchOver = false;
            self.undo();
        });        
    };
    init();
    
    /**
     * Checks to see if a player could win the match on the next point.
     * 
     * @method isMatchPoint
     * @return true if this is a game point for that player and winning 
     * the game would also win the match.
     */
    self.isMatchPoint = function() {
        return self.isGamePoint() &&
            ( isWinner(self.games[0] + 1) || isWinner(self.games[1] + 1) );
    };
    
    var isWinner = function(games, matchLength) {
        matchLength = matchLength || self.options.matchLength;
        return ( games / matchLength >= 0.5 ) ;
    };
    
    return self;
};

/**
 * Triggered before a match win has been awarded.
 * 
 * @event before matchWin
 * @param {string} player id of the winner.
 */

/**
 * Triggered when a match win has been awarded.
 * 
 * @event matchWin
 * @param {string} player id of the winner.
 */

/**
 * Triggered after all other listeners have been notified of a match win.
 * 
 * @event after matchWin
 * @param {string} player id of the winner.
 */
