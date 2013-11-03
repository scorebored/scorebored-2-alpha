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

var sb = sb || {};
sb.pong = sb.pong || {};

sb.pong.app = sb.pong.app || function() {

    var self = sb.app();

    self.options = {
        name: "Battle of the Bulge",
        players: [
            { id: 0, name: "Player 1" },
            { id: 1, name: "Player 2" }
        ],
        gameLength: 11,
        matchLength: 3,
        nextServer: "alternate",
        skunkRule: false
    };
    self.gameLengths = [11, 21];
    self.matchLengths = [1, 3, 5, 7];
    self.timer = sb.timer();

    var init = function() {
        self.reset();
    };

    self.reset = function() {
        var state = self.state;

        state.status = "setup";
        state.scores = [0, 0];
        state.initialServer = null;
        state.server = null;
        state.currentGame = 0;
        state.games = [0, 0];
        state.sides = [0, 1];
        state.changes = {};

        self.history = [];
        self.timer.stop();
        self.timer.reset();
        self.events.trigger("state", state);
    };

    self.command = function(event) {
        self.state.changes = {};
        self.state.changes.say = [];
        var func = actions[event.action];
        func.apply(self, arguments);
    };

    self.selectServer = function(server) {
        self.command({action: "server", server: server});
    };

    self.awardPoint = function(player) {
        self.command({action: "score", player: player});
    };

    self.nextGame = function() {
        self.command({action: "next"});
    };

    self.undo = function() {
        self.command({action: "undo"});
    };

    var selectServer = function(event) {
        var state = self.state;
        state.initialServer = event.server;
        state.server = event.server;
        state.status = "playing";
        self.timer.start();

        var player = self.playerName(event.server);
        self.addSpeech(player + " serves first");

        speak();
        self.events.trigger("state", state);
    };

    var awardPoint = function(event) {
        var state = self.state;
        state.scores[event.player]++;
        state.changes.point = event.player;

        processRules();
        speak();

        self.events.trigger("state", state);
    };

    var undo = function() {
        self.settings.talker.silence();
        var previous = self.popHistory();
        if ( previous ) {
            self.state = previous;
            self.events.trigger("state", self.state);
            if ( self.state.status === "playing" ) {
                self.timer.start();
            } else {
                self.timer.stop();
            }
        } else {
            self.reset();
        }
    };

    var nextGame = function() {
        var state = self.state;
        state.status = "playing";
        state.currentGame++;
        state.scores[0] = 0;
        state.scores[1] = 0;

        switchSides();
        nextServer();

        self.addSpeech("Switch sides");
        var player = self.playerName(state.server);
        self.addSpeech(player + " serves first");

        speak();
        //self.pushHistory();
        self.events.trigger("state", state);
        self.timer.start();
    };

    var actions = {
        server: selectServer,
        score: awardPoint,
        undo: undo,
        next: nextGame,
        end: self.reset
    };

    var processRules = function() {
        var changes = self.state.changes;
        self.state.served = self.state.server;

        gameOver();
        matchOver();

        if ( !changes.gameOver && !changes.matchOver ) {
            changeServers();
        } else {
            self.timer.stop();
        }
        sayGameOrMatchOver();
        if ( !changes.gameOver && !changes.matchOver ) {
            sayPoint();
            sayChangeServers();
            sayScore();
            sayGameOrMatchPoint();
        }
        self.pushHistory();
    };

    var gameOver = function() {
        var state = self.state;
        var winner = sb.rules.winByTwo(state.scores, self.options.gameLength);
        if ( !_.isNull(winner) ) {
            state.games[winner]++;
            state.changes.gameOver = true;
            state.changes.gameWinner = winner;
            state.status = "next";
            return true;
        }
        if ( sb.rules.overtimeByTwo(state.scores, self.options.gameLength) ) {
            state.changes.overtime = true;
        }
    };

    var matchOver = function() {
        var state = self.state;
        if ( state.changes.gameOver ) {
            var winner = sb.rules.winBestOf(state.games,
                    self.options.matchLength);
            if ( !_.isNull(winner) ) {
                state.changes.matchOver = true;
                state.changes.matchWinner = winner;
                state.status = "end";
                return true;
            }
        }
    };

    var changeServers = function() {
        var state = self.state;
        var at = ( self.options.gameLength === 11 ) ? 2 : 5;
        if ( state.changes.overtime || sb.util.total(state.scores) % at === 0 ) {
            state.server = sb.util.other([0, 1], state.server);
            state.changes.changeServer = true;
        }
    };

    var nextServer = function() {
        var method = self.options.nextServer;
        if ( method === "alternate" ) {
            alternateServers();
        } else if ( method === "winner" ) {
            winnerServes();
        } else if ( method === "loser" ) {
            loserServes();
        }
    };

    var alternateServers = function() {
        var state = self.state;
        var nextServer = (state.initialServer + state.currentGame) % 2;
        state.server = nextServer;
        state.changes.changeServer = true;
    };

    var winnerServes = function() {
        var state = self.state;
        var previous = _.last(self.history[state.currentGame - 1]);
        state.server = previous.changes.gameWinner;
        state.changes.changeServer = true;
    };

    var loserServes = function() {
        var state = self.state;
        var previous = _.last(self.history[state.currentGame - 1]);
        state.server = sb.util.other([0, 1], previous.changes.gameWinner);
        state.changes.changeServer = true;
    };

    var sayGameOrMatchOver = function() {
        var state = self.state;
        if ( self.options.matchLength > 1 && state.changes.matchOver ) {
            var player = self.playerName(state.changes.matchWinner);
            self.addSpeech(player + " wins the match");
            var winnerGames = state.games[state.changes.matchWinner];
            var loserGames = sb.util.other(state.games,
                    state.changes.matchWinner);
            self.addSpeech("" + winnerGames + " to " + loserGames);
            return true;

        }
        if ( state.changes.gameOver ) {
            var gameWinner =
                    self.options.players[state.changes.gameWinner].name;
            state.changes.say.push(gameWinner + " wins the game");
            return true;
        }
    };

    var sayPoint = function() {
        var state = self.state;
        if ( !state.changes.overtime ) {
            var player = self.options.players[state.changes.point].name;
            state.changes.say.push("Point " + player);
        }
    };

    var sayChangeServers = function() {
        var state = self.state;
        if ( !state.changes.overtime && state.changes.changeServer ) {
            state.changes.say.push("Change servers");
        }
    };

    var sayScore = function() {
        var state = self.state;

        if ( !state.changes.overtime ) {
            var server = self.state.server;
            var score0 = self.state.scores[server];
            var score1 = self.state.scores[sb.util.other([0, 1], server)];
            self.addSpeech("" + score0 + " - " + score1);
        } else {
            if ( state.scores[0] === state.scores[1] ) {
                self.addSpeech("Deuce");
            } else if ( state.scores[0] > state.scores[1] ) {
                self.addSpeech("Advantage " + self.playerName(0));
            }  else {
                self.addSpeech("Advantage " + self.playerName(1));
            }
        }
    };

    var sayGameOrMatchPoint = function() {
        var state = self.state;
        if ( state.changes.overtime ) {
            return;
        }
        var gameLength = self.options.gameLength;
        var matchLength = self.options.matchLength;
        if ( sb.rules.gamePointByTwo(state.scores, gameLength) ) {
            if ( self.options.matchLength !== 1 &&
                    sb.rules.matchPointBestOf(state.games, matchLength) ) {
                self.addSpeech("Match point");
            } else {
                self.addSpeech("Game point");
            }
        }
    };

    var speak = function() {
        self.settings.talker.silence();
        _.each(self.state.changes.say, function(text) {
            self.settings.talker.say(text);
        });
    };

    var switchSides = function() {
        var state = self.state;
        sb.util.swap(state.sides);
        state.changes.switchSides = true;
    };

    init();
    return self;
};

