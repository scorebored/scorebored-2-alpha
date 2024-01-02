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
 * A token that is passed around in a given order. 
 * 
 * Useful for handling who the current dealer is or who is the current 
 * server.
 * 
 * Example:
 * 
 *      var game = score.Game();
 *      game.features.token(game, "dealer");
 *      game.features.tokenRing(game, "dealer");
 * 
 *      game.events.on("dealer", function(dealer) {
 *          console.log("Player", dealer, "is now dealing");
 *      });
 * 
 *      game.dealer.next(); // Prints "Player 0 is now dealing"
 *      game.dealer.next(); // Prints "Player 1 is now dealing"
 * 
 * @class tokenRing
 * @static
 * @constructor
 * 
 * @param {score.Game} self mix in the these properties into the provided
 * game object.
 * @param {string} property name of the token that this tokenRing should use
 */
score.features.tokenRing = score.features.tokenRing || 
        function(self, property) {
    
    /**
     * Array of player ids representing the order. The "*" is the name of the 
     * token property. By default, players are assigned to a sequential order 
     * based on their player id. Change these values to provide a different 
     * order. 
     *
     * @property *.order 
     * @type {playerId} Array
     */
    self[property].order = [];
    
    var init = function() {
        for ( var i = 0; i < self.players.count; i++ ) {
            self[property].order[i] = "" + i;
        }
    };
    
    /**
     * Advances the token to the next player. The "*" is the name of the
     * token property.
     * 
     * @method *.next
     */
    self[property].next = function() {
        var index = _.indexOf(self[property].order, self[property].is) + 1;
        if ( index >= self.players.count ) {
            index = 0;
        }
        self[property].is = self[property].order[index];
    };
    
    /**
     * Moves the token to the previous player. The "*" is the name of the 
     * token property.
     * 
     * @method *.previous
     */
    self[property].previous = function() {
        var index = _.indexOf(self[property].order, self[property].is) - 1;
        if ( index < 0 ) {
            index = self.players.count - 1;
        }          
        self[property].is = self[property].order[index];        
    };

    init();
    return self;    
};
    
    
