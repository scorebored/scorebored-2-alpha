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
 * Changes the server at the end of a game. This is based on the game option
 * gameWinServer:
 * 
 * * alternate: The initial server in the last game, receives first in
 * the next game.
 * * winner: Winner of the last game serves first.
 * * loser: Loser of the last game serves first.
 * 
 * @class score.rules.gameWinServer
 * @static
 * 
 * @param {object} the target object to receive these new properites.
 */
score.rules.gameWinServer = score.rules.gameWinServer || function(self) { 

    var lastWinnner = null;
    var lastLoser = null;
    
    self.events
        .on("gameWin", function(player) {
            lastWinner = player;     
            lastLoser = ( player === "0" ) ? "1": "0";   
        })
        .on("nextGame", function() {
            var option = self.options.gameWinServer || "alternate";
            if ( option === "loser" ) {
                self.server.is = lastLoser;
            } else if ( option === "winner" ) {
                self.server.is = lastWinner;
            } else {
                var server = (parseInt(self.server.initial) + 
                        self.games.current - 1) % 2; 
                self.server.is = "" + server;
            }
        }); 
            
};

