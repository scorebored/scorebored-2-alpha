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
 * Marks which player is the current server.
 * 
 * Example:
 *      var game = score.Game({maxPlayers: 2});
 *      game.features.server(game);
 * 
 *      game.events.on("server", function(playerId) {
 *          console.log("Player", playerId, "is now serving");
 *      });
 * 
 *      game.server.is = 0; // Prints "Player 0 is now serving"
 *      game.server.next(); // Prints "Player 1 is now serving"  
 *      game.server.next(); // Prints "Player 0 is now serving"  
 * 
 * @class server
 * @static
 * @constructor
 * 
 * @param {score.Game} self mix in the these properties into the provided
 *        game object.
 */
score.features.server = score.features.server || function(self) {

    var init = function() {
        score.features.token(self, "server");
        score.features.tokenRing(self, "server");  
        
        self.events.on("gameWin", function() {
            self.server.is = null;
        });
    };
    
    init();
    return self;
};

/**
 * Current player that is serving. Set to null to indicate a server has not
 * yet been decided.
 * 
 * @property {playerId} server.is
 */

/**
 * Triggered before the server is changed. 
 * 
 * @event before server
 * 
 * @param value {object} the new server or null if not assigned
 * @param property {string} the string "is".
 * @param previous {object} the previous server or null if not assigned.
 * @param eventName {string} the value "before server"
 */

/**
 * Triggered when the server is changed. 
 * 
 * @event server
 * 
 * @param value {object} the new server or null if not assigned
 * @param property {string} the string "is".
 * @param previous {object} the previous server or null if not assigned.
 * @param eventName {string} the value "server"
 */

/**
 * Triggered after all listeners have been notified that the server has
 * changed.
 * 
 * @event after server
 * 
 * @param value {object} the new server or null if not assigned
 * @param property {string} the string "is".
 * @param previous {object} the previous server or null if not assigned.
 * @param eventName {string} the value "after server"
 */

/**
 * Switches the server.
 * 
 * @method server.next
 */
