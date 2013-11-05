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
sb.pong.standard = sb.pong.standard || {};

sb.pong.standard.app = sb.pong.standard.app || function() {

    var self = sb.app("pong.standard");

    self.options = {
        title: "",
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

    var init = function() {
        self.reset();
    };

    var reset = function() {
        _.extend(self.state, {
            scores: [0, 0],
            initialServer: null,
            server: null,
            currentGame: 0,
            games: [0, 0],
            sides: [0, 1],
            changes: {}
        });
        self.setPhase("setup");
        self.events.trigger("state", self.state);
    };
    self.rules.reset = reset;

    self.reset = function(server) {
        self.command({action: "reset"});
    };

    var initialServer = function(event) {
        self.state.initialServer = event.server;
        self.state.server = event.server;
        self.setPhase("play");

        self.rules.sayInitialServer();

        self.speak();
        self.events.trigger("state", self.state);
    };
    self.rules.initialServer = initialServer;

    self.initialServer = function(server) {
        self.command({action: "initialServer", server: server});
    };

    var sayInitialServer = function() {
        var server = self.state.server;
        self.addSpeech(self.playerName(server) + " serves first");
    };
    self.rules.sayInitialServer = sayInitialServer;

    var point = function(event) {
        self.state.served = self.state.server;
        self.state.scores[event.player]++;
        self.state.changes.point = event.player;

        self.rules.gameOver();
        self.rules.matchOver();

        var gameOver = self.state.changes.gameOver;
        var matchOver = self.state.changes.matchOver;

        if ( !gameOver && !matchOver ) {
            self.rules.changeServers();
        }
        self.rules.sayGameOrMatchOver();
        if ( !gameOver && !matchOver ) {
            self.rules.sayPoint();
            self.rules.sayChangeServers();
            self.rules.sayScore();
            self.rules.sayGameOrMatchPoint();
        }

        self.pushHistory();
        self.speak();
        self.events.trigger("state", self.state);
    };
    self.rules.point = point;

    self.point = function(player) {
        self.command({action: "point", player: player});
    };

    var next = function() {
        var state = self.state;
        state.currentGame++;
        state.scores[0] = 0;
        state.scores[1] = 0;

        self.rules.switchSides();
        self.rules.saySwitchSides();
        self.rules.nextServer();
        self.rules.sayInitialServer();

        self.speak();
        self.setPhase("play");
        self.events.trigger("state", state);
    };
    self.rules.next = next;

    self.next = function() {
        self.command({action: "next"});
    };

    var gameOver = function() {
        var winner = sb.rules.winByTwo(self.state.scores, self.options.gameLength);
        if ( !_.isNull(winner) ) {
            self.state.games[winner]++;
            self.state.changes.gameOver = true;
            self.state.changes.gameWinner = winner;
            self.setPhase("next");
            return true;
        }
        if ( sb.rules.overtimeByTwo(self.state.scores, self.options.gameLength) ) {
            self.state.changes.overtime = true;
        }
    };
    self.rules.gameOver = gameOver;

    var matchOver = function() {
        var state = self.state;
        if ( state.changes.gameOver ) {
            var winner = sb.rules.winBestOf(state.games,
                    self.options.matchLength);
            if ( !_.isNull(winner) ) {
                state.changes.matchOver = true;
                state.changes.matchWinner = winner;
                self.setPhase("end");
                return true;
            }
        }
    };
    self.rules.matchOver = matchOver;

    var changeServers = function() {
        var at = ( self.options.gameLength === 11 ) ? 2 : 5;
        var overtime = self.state.changes.overtime;
        var total = sb.util.total(self.state.scores);

        if ( overtime || total % at === 0 ) {
            self.state.server = sb.util.other(self.state.server);
            self.state.changes.changeServer = true;
        }
    };
    self.rules.changeServers = changeServers;

    var nextServer = function() {
        var method = self.options.nextServer;
        if ( method === "alternate" ) {
            self.rules.alternateServers();
        } else if ( method === "winner" ) {
            self.rules.winnerServes();
        } else if ( method === "loser" ) {
            self.rules.loserServes();
        } else {
            throw new Error("Invalid next server method: " + method);
        }
    };
    self.rules.nextServer = nextServer;

    var alternateServers = function() {
        var initialServer = self.state.initialServer;
        var currentGame = self.state.currentGame;
        var nextServer = (initialServer + currentGame) % 2;
        self.state.server = nextServer;
        self.state.changes.changeServer = true;
    };
    self.rules.alternateServers = alternateServers;

    var winnerServes = function() {
        var previousGame = self.state.currentGame - 1;
        var previous = _.last(self.history[previousGame]);
        self.state.server = previous.changes.gameWinner;
        self.state.changes.changeServer = true;
    };
    self.rules.winnerServes = winnerServes;

    var loserServes = function() {
        var previousGame = self.state.currentGame - 1;
        var previous = _.last(self.history[previousGame]);
        self.state.server = sb.util.other(previous.changes.gameWinner);
        self.state.changes.changeServer = true;
    };
    self.rules.loserServes = loserServes;

    var sayGameOrMatchOver = function() {
        var matchLength = self.options.matchLength;
        var matchOver = self.state.changes.matchOver;

        if ( matchLength > 1 && matchOver ) {
            var matchWinner = self.state.changes.matchWinner;
            self.addSpeech(self.playerName(matchWinner) + " wins the match");
            var winnerGames = self.state.games[matchWinner];
            var loserGames = self.state.games[sb.util.other(matchWinner)];
            self.addSpeech("" + winnerGames + " to " + loserGames);
            return true;
        }
        if ( self.state.changes.gameOver ) {
            var gameWinner = self.state.changes.gameWinner;
            self.addSpeech(self.playerName(gameWinner) + " wins the game");
            return true;
        }
    };
    self.rules.sayGameOrMatchOver = sayGameOrMatchOver;

    var sayPoint = function() {
        if ( !self.state.changes.overtime ) {
            var player = self.state.changes.point;
            self.addSpeech("Point " + self.playerName(player));
        }
    };
    self.rules.sayPoint = sayPoint;

    var sayChangeServers = function() {
        var overtime = self.state.changes.overtime;
        var changeServer = self.state.changes.changeServer;
        if ( !overtime && changeServer ) {
            self.addSpeech("Change servers");
        }
    };
    self.rules.sayChangeServers = sayChangeServers;

    var sayScore = function() {
        if ( !self.state.changes.overtime ) {
            var server = self.state.server;
            var score0 = self.state.scores[server];
            var score1 = self.state.scores[sb.util.other(server)];
            if ( score0 === score1 ) {
                self.addSpeech(score0 + " all");
            } else {
                self.addSpeech("" + score0 + " - " + score1);
            }
        } else {
            if ( self.state.scores[0] === self.state.scores[1] ) {
                self.addSpeech("Deuce");
            } else if ( self.state.scores[0] > self.state.scores[1] ) {
                self.addSpeech("Advantage " + self.playerName(0));
            }  else {
                self.addSpeech("Advantage " + self.playerName(1));
            }
        }
    };
    self.rules.sayScore = sayScore;

    var sayGameOrMatchPoint = function() {
        if ( self.state.changes.overtime ) {
            return;
        }
        var gameLength = self.options.gameLength;
        var matchLength = self.options.matchLength;
        if ( sb.rules.gamePointByTwo(self.state.scores, gameLength) ) {
            if ( self.options.matchLength !== 1 &&
                    sb.rules.matchPointBestOf(self.state.games, matchLength) ) {
                self.addSpeech("Match point");
            } else {
                self.addSpeech("Game point");
            }
        }
    };
    self.rules.sayGameOrMatchPoint = sayGameOrMatchPoint;

    var switchSides = function() {
        sb.util.swap(self.state.sides);
        self.state.changes.switchSides = true;
    };
    self.rules.switchSides = switchSides;

    var saySwitchSides = function() {
       self.addSpeech("Switch sides");
    };
    self.rules.saySwitchSides = saySwitchSides;

    init();
    return self;
};

