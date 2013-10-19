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
 * @module score.pong
 */
score.pong = score.pong || {};

/**
 * Table tennis (a.k.a Ping Pong).
 * 
 * @class Game
 * @uses score.features.scores
 * @uses score.features.server
 * @uses score.features.match
 * @uses score.features.sides
 */
score.pong.Game = score.pong.Game || function() {

    var self = {};
    self.events = blackchip.Events(); 
        
    self.options = blackchip.Properties({
        maxPlayers: 2,
        gameLength: 11,
        matchLength: 3
    }, self.events, "options");
    
    score.Game(self);
    
    score.features.Scores(self);
    score.features.Server(self);
    score.features.Match(self); 
    score.features.Sides(self);
               
    score.rules.WinGameByTwo(self);
    score.rules.WinMatchBestOf(self); 
    
    var changeServer = function() {
        if ( self.gameOver ) {
            return;
        }
        var at = ( self.options.gameLength === 11 ) ? 2 : 5;
        if ( (self.scores[0] + self.scores[1]) % at === 0 ) {
            self.changeServer();
        }    
    };  
    self.events.on("after score", changeServer);
      
    self.status = function() {
        console.log("Game ", self.currentGame, ":",
                    self.players[0], self.scores[0], "-", 
                    self.players[1], self.scores[1], 
                    "; Match:", 
                    self.players[0], self.match[0], "-",
                    self.players[1], self.match[1],
                    "; Server:", 
                    self.players[self.server.is]);
    };
    
    return self;
    
};
