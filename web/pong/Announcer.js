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
 * Something
 * 
 * @class score.pong.Announcer
 */
score.pong.Announcer = score.pong.Announcer || function(game) {
    
    var playerPoint = score.tts.playerPoint(game, { 
        noOverTime: true 
    });
    var scoreByServer = score.tts.scoreByServer(game, { 
        noOverTime: true,
        noOverTimeNext: true 
    });
    var deuce = score.tts.deuce(game);
    var gamePoint = score.tts.gamePoint(game, { noOverTime: true });
    var matchPoint = score.tts.matchPoint(game, { noOverTime: true });
    var changeServers = score.tts.changeServers(game, { noOverTime: true });
    var gameWinner = score.tts.gameWinner(game);
    var matchStandings = score.tts.matchStandings(game);
    var switchSides = score.tts.switchSides(game);
    var matchWinner = score.tts.matchWinner(game);      

    var self = {
        "score": [
            { name: "playerPoint", call: playerPoint }
        ],
        "after score": [
            { name: "scoreByServer", call: scoreByServer },
            { name: "deuce", call: deuce },
            { name: "gamePoint", call: gamePoint },
            { name: "matchPoint", call: matchPoint }
        ],
        "server": [
            { name: "changeServers", call: changeServers }
        ],
        "after gameWin": [
            { name: "gameWinner", call: gameWinner },
            { name: "matchStandings", call: matchStandings }
        ],
        "switchSides": [
            { name: "switchSides", call: switchSides }
        ],
        "matchWin": [
            { name: "matchWinner", call: matchWinner }
        ]
    };
    
    return self;
};
