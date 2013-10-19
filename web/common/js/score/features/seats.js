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
 * Marks which seat a player is sitting in.
 * 
 * Example:
 * 
 *      var game = score.Game({maxPlayers: 8});
 *      score.features.seats(game);
 * 
 *      game.events.on("seat", function(player, seat) {
 *          console.log("Player", player, "in seat", seat);
 *      });
 * 
 *      game.seats[1] = 6; // Prints "Player 6 in seat 1"   
 * 
 * @class seats
 * @static
 * @constructor
 *
 * @param {score.Game} self mix in the these properties into the provided
 *        game object.
 * @param {string} [property] Use this as the property name to mix in instead
 *        of "seats".
 */
score.features.seats = score.features.seats || function(self, property) {
    
    property = property || "seats";
    
    /**
     * Mapping of seats to players. If property was specified, it is the
     * name of the provided property instead of "seats"
     * 
     * @property seats 
     */
    
    self[property] = null;
    
    var init = function() {
        var seats = {};
        for ( var id = 0; id < self.players.count; id++ ) {
            seats[id] = id;
        };
        self[property] = blackchip.Properties(seats, self.events, "seat");   
    };
    init();
        
    /**
     * Swaps seats between two players.
     * 
     * @method seats.swap
     * 
     * @param player1 {int}
     * @param player2 {int}
     */
    self[property].swap = function(playerId1, playerId2) {
        var tmp = self[property][playerId1];
        self[property][playerId1] = playerId2;
        self[property][playerId2] = tmp;    
    };
    
    return self;
};

/**
 * Triggered before a seat is assigned.
 * 
 * @event before seat
 * 
 * @param player {object} the player assigned to the seat.
 * @param seat {object} seat the player is assigned to.
 * @param previous {object} previous player in the seat
 * @param eventName {string} the value "before seat"
 */

/**
 * Triggered when a seat is assigned.
 * 
 * @event seat
 * 
 * @param player {object} the player assigned to the seat.
 * @param seat {object} seat the player is assigned to.
 * @param previous {object} previous player in the seat
 * @param eventName {string} the value "seat"
 */

/**
 * Triggered when a seat is assigned.
 * 
 * @event after seat
 * 
 * @param player {object} the player assigned to the seat.
 * @param seat {object} seat the player is assigned to.
 * @param previous {object} previous player in the seat
 * @param eventName {string} the value "after seat"
 */
    
