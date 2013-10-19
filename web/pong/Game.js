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
 * Not documented
 * 
 * @class Game
 * @uses score.features.scores
 * @uses score.features.server
 * @uses score.features.match
 * @uses score.features.sides
 */
score.pong.Game = score.pong.Game || function(options) {
        
    options = options || {};
    
    options.maxPlayers = 2;
    options.gameLength = options.gameLength || 11;
    options.matchLength = options.matchLength || 1;

    var game = score.Game(options);
    
    score.features.scores(game);
    score.features.server(game);
    score.features.match(game); 
    score.features.sides(game);
               
    score.rules.winGameByTwo(game);
    score.rules.winMatchBestOf(game); 
    
    var changeServer = function() {
        if ( game.gameOver ) {
            return;
        }
        var at = ( game.options.gameLength === 11 ) ? 2 : 5;
        if ( (game.scores[0] + game.scores[1]) % at === 0 ) {
            game.server.next();
        }    
    };  
    game.events.on("after score", changeServer);
    
    return game;
    
};
