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
 * @module score.pong
 */
score.pong = score.pong || {};

/**
 * Table tennis (a.k.a Ping-Pong).
 *
 * Options for this game:
 *
 * * gameLength: Number of points required to win a game. Defaults
 *   to 11.
 * * matchLength: Number of games required to win a match. Defaults
 *   to 1.
 *
 * @class score.pong.Game
 * @uses scores
 * @uses server
 * @uses match
 * @uses sides
 * @uses gameWinSwitchSides
 * @uses winGameByTwo
 * @uses winMatchBestOf
 * @constructor
 *
 * @param options
 */
score.pong.Game = score.pong.Game || function(options) {

    options = options || {};

    options.maxPlayers = 2;
    options.gameLength = options.gameLength || 11;
    options.matchLength = options.matchLength || 1;
    options.gameWinServer = options.gameWinServer || "alternate";

    var self = score.Game(options);

    score.features.scores(self);
    score.features.server(self);
    score.features.match(self);
    score.features.sides(self);
    score.features.timer(self);

    score.rules.gameWinServer(self);
    score.rules.gameWinSwitchSides(self);
    score.rules.winGameByTwo(self);
    score.rules.winMatchBestOf(self);

    var changeServer = function() {
        if ( self.gameOver || self.correction ) {
            return;
        }
        if ( self.isOverTime() ) {
            self.server.next();
        } else {
            var at = ( self.options.gameLength === 11 ) ? 2 : 5;
            if ( (self.scores[0] + self.scores[1]) % at === 0 ) {
                self.server.next();
            }
        }
    };

    var startGame = function(player, is, previous) {
        if ( _.isNull(previous) && _.isNull(self.server.initial) ) {
            self.start();
        }
    };

    var undoGameStart = function() {
        self.server.initial = null;
    };

    self.events.on("after score", changeServer);
    self.events.on("before server", startGame);
    self.events.on("undo gameStart", undoGameStart);
    self.events.on("score", self.silence);

    score.tts.playerPoint(self, { noOverTime: true });
    score.tts.scoreByServer(self, { noOverTime: true, noOverTimeNext: true });
    score.tts.deuce(self);
    score.tts.gamePoint(self, { noOverTime: true });
    score.tts.matchPoint(self, { noOverTime: true });
    score.tts.changeServers(self, { noOverTime: true});
    score.tts.gameWinner(self);
    score.tts.matchStandings(self);
    score.tts.switchSides(self);
    score.tts.matchWinner(self);

    return self;

};
