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
 * An item that can only be held by one player at a time.
 * 
 * Useful for marking who is the current server, dealer, etc.
 * 
 * Example:
 * 
 *      var game = score.Game();
 *      score.features.token(game, "server")
 *      
 *      game.events.on("server", playerId) {
 *          console.log("Player", playerId, "is now serving");
 *      }
 * 
 *      game.server = 1; // Prints "Player 1 is now serving"
 * 
 * @class token
 * @constructor
 * @static
 * 
 * @param {score.Game} self mix in the these properties into the provided
 *        game object.
 * @param {string} name of the property to use for this token
 */
score.features.token = score.features.token || function(self, property) {

    /**
     * Current holder of the token. Set to null to indicate that no player
     * holds the token.
     * 
     * @property {playerId} is
     */
    self[property] = blackchip.Properties({
        is: null
    }, self.events, property);

    /**
     * The intial holder of the token. 
     */
    self[property].initial = null;
    
    var init = function() {
        
        self.events.on(property, function(value, is, previous) {
            if ( _.isNull(previous) && _.isNull(self[property].initial) ) {
                self[property].initial = value;
            }
            self.record.apply(null, arguments);
        });
        
        self.events.on("undo " + property, function(playerId, property, previous) {
            self.server.is = previous;
            self.undo();        
        });
        
        self.events.on("redo " + property, function(playerId) {
            self.server.is = playerId;
        });
    };
    
    init();    
    return self;
};

/**
 * Triggered before a token is given to a player. "*" is the name of the 
 * property given to this token.
 * 
 * @event before *
 * 
 * @param value {object} the new holder of the token or null
 *        if the token is unassigned.
 * @param property {string} the string "is".
 * @param previous {object} the previous holder of the token or
 *        null if it was not assigned.
 * @param eventName {string} the value "before *"
 */

/**
 * Triggered when a token is given to a player. "*" is the name of the
 * property given to this token.
 * 
 * @event *
 * 
 * @param value {object} the new holder of the token or null
 *        if the token is unassigned.
 * @param property {string} the string "is".
 * @param previous {object} the previous holder of the token or
 *        null if it was not assigned.
 * @param eventName {string} the value "before *"
 */

/**
 * Triggered after all listeners have been notified of a token change.
 * "*" is the name of the property given to this token.
 * 
 * @event after *
 * 
 * @param value {object} the new holder of the token or null
 *        if the token is unassigned.
 * @param property {string} the string "is".
 * @param previous {object} the previous holder of the token or
 *        null if it was not assigned.
 * @param eventName {string} the value "after *"
 */

/**
 * Triggered when an undo of a token event is requested. The handler
 * will continue with the next item in the undo stack.
 * 
 * @event undo *
 * 
 * @param value {object} the new holder of the token or null
 *        if the token is unassigned.
 * @param property {string} the string "is".
 * @param previous {object} the previous holder of the token or
 *        null if it was not assigned.
 * @param eventName {string} the value "undo *"
 */

/**
 * Triggered when an redo of a token event is requested. 
 * 
 * @event redo *
 * 
 * @param value {object} the new holder of the token or null
 *        if the token is unassigned.
 * @param property {string} the string "is".
 * @param previous {object} the previous holder of the token or
 *        null if it was not assigned.
 * @param eventName {string} the value "redo *"
 */
