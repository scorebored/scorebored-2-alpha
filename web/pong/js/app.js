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

var sb = sb || {};
sb.pong = sb.pong || {};

sb.pong.app = sb.pong.app || function() {

    var self = sb.app("pong");
    
    var defaultOptions = {
        title: "",
        gameLength: 11,
        matchLength: 1,
        nextServer: "alternate",
        skunkRule: false    
    };
    
    var singles = {
        value: "singles",
        description: "Singles",
        show: ["singles"],
        hide: ["team"],
        defaultOptions: {
            variant: "singles",
            team: false, 
            players: self.defaultPlayers(2),
            teams: [] 
        }
    };
    
    var doubles = {
        value: "doubles", 
        description: "Doubles", 
        team: true,
        show: ["team"],
        hide: ["singles"],
        defaultOptions: { 
            variant: "doubles",
            team: true,
            players: self.defaultPlayers(4),
            teams: self.defaultTeams(2)
        }
    };
    self.variants = [singles, doubles];
    self.variant = null;
    
    self.gameLengths = [
        { value: 11, description: "11 point game" }, 
        { value: 21, description: "21 point game" }
    ];
    self.matchLengths = [
        { value: 1, description: "Single game" }, 
        { value: 3, description: "Best 2 out of 3" },
        { value: 5, description: "Best 3 out of 5" },
        { value: 7, description: "Best 4 out of 7" }
    ];
    self.nextServerOptions = [
        { value: "alternate", description: "Servers alternate between games" },
        { value: "winner", description: "Game winner serves first" },
        { value: "loser", description: "Game loser servers first" }    
    ];
        
    self.options = {};
     
    self.setVariant = function(name) {
        self.variant = name;
        var variant = _.find(self.variants, {value: name});
        self.loadOptions(variant.value); 
        _.defaults(self.options, defaultOptions);
        _.defaults(self.options, variant.defaultOptions);  
    };
    
    var init = function() {
        self.loadGlobals();
        self.variant = self.variant || "singles";
        self.setVariant(self.variant);
        self.loadState();
        if ( !self.state ) {
            self.reset();
        }
    };
    
    var reset = function() {
        self.state = {
            scores: [0, 0],
            initialServer: null,
            serverTeam: null,
            serverPlayer: null,
            servedTeam: null,
            servedPlayer: null,
            currentGame: 0,
            games: [0, 0],
            sides: {
                teams: [0, 1],
                players: [[0, 2], [1, 3]] 
            },
            changes: {}
        };
        self.setPhase("setup");
        self.events.trigger("state", self.state);
    };

    self.reset = function(server) {
        self.command({action: "reset"});
    };
    self.actions.reset = reset;
    
    var initialServer = function(event) {
        self.state.initialServer = event.server;
        self.state.serverTeam = event.server;
        if ( self.options.team ) {
            self.state.serverPlayer = event.server;
        }
        self.setPhase("play");

        sayInitialServer();

        self.speak();
        self.events.trigger("state", self.state);
    };

    self.initialServer = function(server) {
        self.command({action: "initialServer", server: server});
    };
    self.actions.initialServer = initialServer;
    
    var sayInitialServer = function() {
        var server = ( self.options.team ) 
                ? self.state.serverPlayer : self.state.serverTeam; 
        self.addSpeech(self.playerName(server) + " serves first");
    };

    var point = function(event) {
        self.state.servedTeam = self.state.serverTeam;
        if ( self.options.team ) {
            self.state.servedPlayer = self.state.serverPlayer;
        }
        self.state.scores[event.player]++;
        self.state.changes.point = event.player;

        gameOver();
        matchOver();

        var isGameOver = self.state.changes.gameOver;
        var isMatchOver = self.state.changes.matchOver;

        if ( !isGameOver && !isMatchOver ) {
            changeServers();
        }
        sayGameOrMatchOver();
        if ( !isGameOver && !isMatchOver ) {
            sayPoint();
            sayChangeServers();
            sayScore();
            sayGameOrMatchPoint();
        }

        self.pushHistory();
        self.speak();
        self.events.trigger("state", self.state);
    };

    self.point = function(player) {
        self.command({action: "point", player: player});
    };
    self.actions.point = point;
    
    var next = function() {
        var state = self.state;
        state.currentGame++;
        state.scores[0] = 0;
        state.scores[1] = 0;

        switchSides();
        saySwitchSides();
        nextServer();
        sayInitialServer();

        self.speak();
        self.setPhase("play");
        self.events.trigger("state", state);
    };

    self.next = function() {
        self.command({action: "next"});
    };
    self.actions.next = next;
    
    var gameOver = function() {
        var winner = sb.rules.winByTwo(self.state.scores, self.options.gameLength);
        if ( !_.isNull(winner) ) {
            self.state.games[winner]++;
            self.state.serverTeam = null;
            if ( self.options.team ) {
                self.state.serverPlayer = null;
            }
            self.state.changes.gameOver = true;
            self.state.changes.gameWinner = winner;
            self.setPhase("next");
            return true;
        }
        if ( sb.rules.overtimeByTwo(self.state.scores, self.options.gameLength) ) {
            self.state.changes.overtime = true;
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
                self.setPhase("end");
                return true;
            }
        }
    };

    var changeServers = function() {
        var at = ( self.options.gameLength === 11 ) ? 2 : 5;
        var overtime = self.state.changes.overtime;
        var total = sb.util.total(self.state.scores);

        if ( overtime || total % at === 0 ) {
            self.state.serverTeam = sb.util.other(self.state.serverTeam);
            if ( self.options.team ) {
                self.state.serverPlayer = (self.state.serverPlayer + 1) % 4;
            }
            self.state.changes.changeServer = true;
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
        } else {
            throw new Error("Invalid next server method: " + method);
        }
    };

    var alternateServers = function() {
        var initialServer = self.state.initialServer;
        var currentGame = self.state.currentGame;
        var nextTeamServer = (initialServer + currentGame) % 2;
        self.state.serverTeam = nextServer;
        if ( self.options.team ) {
            self.state.serverPlayer = (initialServer + currentGame) % 4;
        }
        self.state.changes.changeServer = true;
    };

    var winnerServes = function() {
        var previousGame = self.state.currentGame - 1;
        var previous = _.last(self.history[previousGame]);
        self.state.serverTeam = previous.changes.gameWinner;
        if ( self.options.team ) {
            self.state.serverPlayer++;
            if ( self.state.serverPlayer % 2 !== self.state.serverTeam ) {
                self.state.serverPlayer++;    
            }
        }
        self.state.changes.changeServer = true;
    };

    var loserServes = function() {
        var previousGame = self.state.currentGame - 1;
        var previous = _.last(self.history[previousGame]);
        self.state.serverTeam = sb.util.other(previous.changes.gameWinner);
        if ( self.options.team ) {
            self.state.serverPlayer++;
            if ( self.state.serverPlayer % 2 !== self.state.serverTeam ) {
                self.state.serverPlayer++;    
            }
        }
        self.state.changes.changeServer = true;
    };

    var sayGameOrMatchOver = function() {
        var matchLength = self.options.matchLength;
        var matchOver = self.state.changes.matchOver;

        if ( matchLength > 1 && matchOver ) {
            var matchWinner = self.state.changes.matchWinner;
            self.addSpeech(self.teamName(matchWinner) + " wins the match");
            var winnerGames = self.state.games[matchWinner];
            var loserGames = self.state.games[sb.util.other(matchWinner)];
            self.addSpeech("" + winnerGames + " to " + loserGames);
            return true;
        }
        if ( self.state.changes.gameOver ) {
            var gameWinner = self.state.changes.gameWinner;
            self.addSpeech(self.teamName(gameWinner) + " wins the game");
            return true;
        }
    };

    var sayPoint = function() {
        if ( !self.state.changes.overtime ) {
            var player = self.state.changes.point;
            self.addSpeech("Point " + self.teamName(player));
        }
    };

    var sayChangeServers = function() {
        var changes = self.state.changes;
        if ( !changes.overtime && changes.changeServer ) {
            if ( self.options.team ) {
                self.addSpeech(self.playerName(self.state.serverPlayer) + 
                    " is now serving");
            } else {
                self.addSpeech("Change servers");
            }   
        }
    };

    var sayScore = function() {
        if ( !self.state.changes.overtime ) {
            var server = self.state.serverTeam;
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
                self.addSpeech("Advantage " + self.teamName(0));
            }  else {
                self.addSpeech("Advantage " + self.teamName(1));
            }
        }
    };

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

    var switchSides = function() {
        sb.util.swap(self.state.sides.teams);
        sb.util.swap(self.state.sides.players);
        self.state.changes.switchSides = true;
    };

    var saySwitchSides = function() {
       self.addSpeech("Switch sides");
    };

    init();
    return self;
};

