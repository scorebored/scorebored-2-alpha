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

sb = sb || {};
sb.pong = sb.pong || {};

sb.pong.ui = sb.pong.ui || function(app) {

    var self = {};

    var bindControls = function () {
        // From the options page, go to the scorebored page
        $("#scorebored").click(function() {
            $("#options-page").hide();
            $("#scorebored-page").show();
        });

        // Cancel current game and reset
        $("#reset").click(function() {
            app.reset();
        });

        // Change the variant
        $("#option-variant").change(function() {
            var variant = _.find(app.variants, {value: $(this).val()});
            app.setVariant(variant.value);
            app.changeOptions();
        });

        // Set the match title
        $("#option-title").blur(function() {
            app.options.title = $(this).val();
            app.changeOptions();
        });

        // Set the team name
        $("[data-control='option-team-name']").blur(function() {
            var team = $(this).attr("data-team");
            app.options.teams[team].name = $(this).val();
            app.changeOptions();
        });

        // Set the player name
        $("[data-control='option-player-name']").blur(function() {
            var player = $(this).attr("data-player");
            app.options.players[player].name = $(this).val();
            app.changeOptions();
        });

        // Sets the game length to either 11 or 21 points
        $("#option-game-length").change(function() {
            app.options.gameLength = _.parseInt($(this).val());
            app.changeOptions();
        });

        // Sets the match length to the best out of 1, 3, 5, or 7.
        $("#option-match-length").change(function() {
            app.options.matchLength = _.parseInt($(this).val());
            app.changeOptions();
        });

        // Select the rule that will be used to decide who serves first after
        // a game win. Either alternate, winner, or loser.
        $("#option-next-server").change(function() {
            app.options.nextServer = $(this).val();
            app.changeOptions();
        });

    };

    var updateState = function() {
        var state = app.state;

        // Move the players to different sides if necessary.
        sb.ui.updateSides(state.sides);

        // Update the names
        sb.ui.updateDisplays("[data-display='player-name']",
                "data-player", app.options.players, "name");
        sb.ui.updateDisplays("[data-display='team-name']",
                "data-team", app.options.teams, "name");

        sb.ui.updateDisplays("[data-display='score']",
                "data-team", app.state.scores);

        // At the beginning of the game, show "Start" as the button to
        // take you to the scorebored. If the game is in progress, show
        // "Continue"
        if ( app.state.phase === "setup" ) {
            $("#scorebored").html("Start");
        } else {
            $("#scorebored").html("Continue");
        }

        // Show reset button if the game is in progress
        if ( app.state.phase === "setup" ) {
            $("#reset").hide();
        } else {
            $("#reset").show();
        }

        // Disable game lengths in the settings combo box that are
        // no longer valid (game has already reached 11 points)
        sb.ui.validateOptionGameLength(app.gameLengths, function(length) {
            return app.state.scores[0] < length && app.state.scores[1] < length;
        });

        // Disable match lengths in the settings combob box that are
        // no longer valid (3 cannot be picked while in game 3)
        sb.ui.validateOptionMatchLength(app.matchLengths, function(length) {
            return app.state.games[0] + app.state.games[1] < length;
        });

        // Show who is serving
        $(".team-name").removeClass("server");
        $(".player-name").removeClass("server");

        if ( !_.isNull(state.serverTeam) ) {
            if ( app.options.team ) {
                $(".player-name[data-player='" + state.serverPlayer + "']")
                        .addClass("server");
            } else {
                $(".team-name[data-player='" + state.serverTeam + "']")
                        .addClass("server");
            }
        }

        // Update the number of games won by each player in the match
        sb.ui.updateDisplays("[data-display='score']",
                "data-team", state.games, "name");

        // If this is a multi game match, show which game is currently
        // being played. Otherwise, leave this blank
        if ( !app.isSingleGameMatch() ) {
            var current = app.state.currentGame + 1;
            $("#match-status").html("Game " + current + " of " +
                    app.options.matchLength);
        } else {
            $("#match-status").html("&nbsp;");
        }

        // Enable to undo button unless this is the setup phase
        if ( state.phase !== "setup" ) {
            $("#undo").removeAttr("disabled");
        } else {
            $("#undo").attr("disabled", "disabled");
        }

        // If at the game or end of match, show the continue button
        // and disabled the "plus" buttons for each player.
        if ( state.phase === "next" || state.phase === "end" ) {
            $("#continue").css("visibility", "visible");
            $("button.add").attr("disabled", "disabled");
        } else {
            $("#continue").css("visibility", "hidden");
            $("button.add").removeAttr("disabled");
        }

        if ( state.phase === "setup" ) {
            $("#option-variant").removeAttr("disabled");
        } else {
            $("#option-variant").attr("disabled", "disabled");
        }
    };
    app.events.on("state", updateState);

    sb.ui.fillOptions("#option-variant", app.variants);
    sb.ui.fillOptions("#option-game-length", app.gameLengths);
    sb.ui.fillOptions("#option-match-length", app.matchLengths);
    sb.ui.fillOptions("#option-next-server", app.nextServerOptions);

    var updateOptions = function() {

        var variant = _.find(app.variants, { value: app.options.variant });
        $("#option-variant").val(variant.value);
        sb.ui.toggleDisplay("data-variant", variant.show, variant.hide);

        sb.ui.updateInputs("[data-control='option-player-name']",
                "data-player", app.options.players, "name");
        sb.ui.updateInputs("[data-control='option-team-name']",
                "data-team", app.options.teams, "name");

        $("#option-game-length").val(app.options.gameLength);
        $("#option-match-length").val(app.options.matchLength);
        $("#option-next-server").val(app.options.nextServer);
        $("#option-title").val(app.options.title);
        $("#title").html(app.options.title);

        updateState();
    };
    app.events.on("options", updateOptions);

    // From the scorebored page, go back to the settings page
    $("#back-options").click(function() {
        $("#scorebored-page").hide();
        $("#options-page").show();
    });

    // From the scorebored page, go to the match log page
    $("#history").click(function() {
        $("#scorebored-page").hide();
        refreshHistory();
        $("#history-page").show();
    });

    // Award a point for the player. If the game hasn't started, use this
    // to select the first server.
    $("[data-control='team']").click(function() {
        var team = _.parseInt($(this).attr("data-team"));
        if ( app.state.phase === "setup" ) {
            app.initialServer(team);
        } else {
            app.point(team);
        }
    });

    // Undo the last scoring event
    $("#undo").click(function() {
        app.undo();
    });

    // Either continue to the next game, or end and reset the match
    $("#continue").click(function() {
        if ( app.state.phase === "next" ) {
            app.next();
        } else if ( app.state.phase === "end" ) {
            app.reset();
        } else {
            throw new Error("Invalid status: " + app.state.status);
        }
    });

    // Update the timer
    setInterval(function() {
        var elapsed = app.timer.elapsed();
        $("#timer").html(sb.util.elapsedString(elapsed));
    }, 100);

    // Handles display of the subtitles
    sb.ui.subtitles(app.settings.talker);

    // From the match log page, go back to the scorebored page
    $("#back-scorebored").click(function() {
        $("#history-page").hide();
        $("#scorebored-page").show();
    });

    // Populate the match log
    var refreshHistory = function() {
        var $target = $("#history-table").empty();
        var contents = [];
        _.each(app.history, function(games, index) {
            contents.push("<table class='table table-condensed'>");

            // Only show the game heading if this is a multi game match.
            if ( !app.isSingleGameMatch() ) {
                var gameNumber = index + 1;
                contents.push("<caption>Game " + gameNumber + "</caption>");
            }
            contents.push("<tr>");

            contents.push("<th>Time</th>");
            contents.push("<th>" + app.playerName(0) + "</th>");
            contents.push("<th></th>");
            contents.push("<th>" + app.playerName(1) + "</th>");
            _.each(games, function(state) {
                var server;
                contents.push("<tr>");
                contents.push("<td>" +
                        sb.util.elapsedString(state.time) + "</td>");

                // Bold if server
                server = state.served === 0 ? "class='served'": "";
                contents.push("<td " + server + ">" + state.scores[0] + "</td>");

                // Mark with < or > who earned the point
                if ( state.changes.point === 0 ) {
                    contents.push("<td>&lt;</td>");
                } else {
                    contents.push("<td>&gt</td>");
                }

                server = state.served === 1 ? "class='served'": "";
                contents.push("<td " + server + ">" + state.scores[1] + "</td>");
                contents.push("</tr>");
            });
            contents.push("</table>");
        });
        $target.append(contents.join(""));
    };

    bindControls();
    updateOptions();

/*

    game: null,     // Stores game instance
    view_game: null,    // Allows for viewing an older game

     * Current game settings
    options: {
        'game_name': '',
        'game_length': 21,
        'match_length': 3,
        'mode': 'single',
        'player_1': 'Home Team',
        'player_2': 'Away Team',
        'subtitles': true,
        'mute': false
    },

    init: function () {

        var self = this;

        // Start with new game settings
        this.openGameSettings();

        $('.team-name').fitText(1.15);
        $('.team-score').fitText(0.2);

        // Button bindings
        $('.score-pong-open-settings').click(function(e) {
            self.openGameSettings();
        });
        $('#score_settings_play_game').click(function(e) {
            self.saveGameSettings();
        });
        $('.cancel-settings').click(function(e) {
            self.showScoreboard();
        });

        $('.score-actions .action-select-server').click(function(e) {
            var player = $(this).attr('data-player');
            if ( _.isNull(self.game.server.is) ) {
                self.game.server.is = player;
            }

            $('.score-actions .action-select-server').hide();
            $('.score-actions .action-increment-score').show();
        });
        $('.score-actions .action-increment-score').click(function(e) {
            var player = $(this).attr('data-player');
            if ( !self.game.gameOver && !self.game.matchOver
                    && !_.isNull(self.game.server.is) ) {
                self.game.scores[player] += 1;
            }
        });

        $('.score-pong-next-game').click(function(e) {
            var self = score.pong.ui;
            if ( self.game.matchOver ) {
                self.initGame();
            } else {
                self.game.games.next();
            }
        });

        $('.score-open-match-log').click(function(e) {
            self.openMatchLog();
        });

        $('.match-log-modal').on('shown.bs.modal', function() {
            self.renderMatchLog();
            var $mbody = $(this).find('.modal-body');
            $mbody.animate({
                scrollTop: $mbody[0].scrollHeight
            }, 200);
        });
    },

    initGame: function() {
        self = score.pong.ui;
        if ( self.game ) { delete self.game; }
        self.game = score.pong.Game({matchLength: this.options.match_length,
                                     gameLength: this.options.game_length});

        var talkers = {
            mute: score.talkers.Mute(self.game.events),
            google: score.talkers.Google(self.game.events)
        };

//        self.game.talker = talkers.google;
        self.game.talker = talkers.mute;

        // Event bindings
        self.game.events
            .on("player", this.onPlayer)
            .on("score", this.onScore)
            .on("server", this.onServer)
            .on("options", this.onOptions)
            .on("gameStart", this.onGameStart)
            .on("timerStart", this.onTimerStart)
            .on("timerStop", this.onTimerStop)
            .on("after gameWin", this.onGameWin)
            .on("undo gameWin", this.onUndoGameWin)
            .on("nextGame", this.onNextGame)
            .on("undo nextGame", this.onUndoNextGame)
            .on("game", this.onGame)
            .on("history", this.onHistory)
            .on("say", this.onSay)
            .on("after say", this.onSilence)
            .on("silence", this.onSilence)
            .on("seat", this.onSeat);

        // DEBUG?
        self.game.events.all(function() {
            console.log(arguments);
        });

        self.game.players['0'] = this.options.player_1;
        self.game.players['1'] = this.options.player_2;

        // Enable 'Cancel' button
        $('.cancel-settings').show();

        self.updateMatchDisplay();
        self.updateGameButtons();
    },

    openGameSettings: function(options) {
        var self = score.pong.ui;

        options = options || {};
        var new_options = $.extend(true, {}, this.options, options);

        // Default names
        if (new_options.player_1 == 'Home Team') { new_options.player_1 = ''; }
        if (new_options.player_2 == 'Away Team') { new_options.player_2 = ''; }

        $('#pong_settings_game_name').val( new_options.game_name );
        $('#pong_settings_game_length').val( new_options.game_length );
        $('#pong_settings_match_length').val( new_options.match_length );
        $('#pong_settings_game_type').val( new_options.mode );
        $('#pong_settings_player_1_name').val( new_options.player_1 );
        $('#pong_settings_player_2_name').val( new_options.player_2 );

        // Game button
        $('#score_settings_play_game').text(
            (self.game) ? 'Resume Game' : 'Begin Game'
        );
        this.showSettings();

        return true;
    },

     * Save and start/resume game with current settings
    saveGameSettings: function() {
        var self = score.pong.ui;

        // Read settings from DOM
        var set_settings = $.extend(true, {}, this.options, {
            'game_name': $('#pong_settings_game_name').val(),
            'game_length': $('#pong_settings_game_length').val(),
            'match_length': $('#pong_settings_match_length').val(),
            'mode': $('#pong_settings_game_type').val(),
            'player_1': $('#pong_settings_player_1_name').val(),
            'player_2': $('#pong_settings_player_2_name').val()
        });

        // Check for default names
        if (!set_settings.player_1) { set_settings.player_1 = 'Home Team'; }
        if (!set_settings.player_2) { set_settings.player_2 = 'Away Team'; }

        self.options = set_settings;

        // Initialize game
        if (!(!!self.game)) {
            this.initGame();
        } else {
            // Update game
            self.game.players['0'] = set_settings.player_1;
            self.game.players['1'] = set_settings.player_2;

            try {
                self.game.options.matchLength = set_settings.match_length;
            } catch (e) {
                self.options.match_length = self.game.options.matchLength;
                alert("Cannot change match length (it would end the match)");
            }

            try {
                self.game.options.gameLength = set_settings.game_length;
            } catch (e) {
                self.options.game_length = self.game.options.gameLength;
                alert("Cannot change game length (it would end current game)");
            }

        }

        self.updateMatchDisplay();

        this.showScoreboard();
        $(window).resize();

        return true;
    },

    onPlayer: function() {
        var self = score.pong.ui;
        $('.team-name[data-player="0"]').text( self.game.players[0] );
        $('.team-name[data-player="1"]').text( self.game.players[1] );
    },

    onOptions: function() {
    },

    onGameStart: function() {
        self.updateGameButtons();
    },

    onNextGame: function() {
        self = score.pong.ui;
        self.updateMatchDisplay();
        self.updateGameButtons();
    },

    onUndoNextGame: function() {
        self = score.pong.ui;
        self.updateMatchDisplay();
        self.updateGameButtons();
    },

    onSeat: function() {
        self = score.pong.ui;
        $("[data-side='0']").attr("data-player", self.game.sides[0]);
        $("[data-side='1']").attr("data-player", self.game.sides[1]);
        self.onPlayer();
        self.onScore();
        self.onServer();
        self.onGame();
    },

    onTimerStart: function() {
        var self = score.pong.ui;

        var count = 0;
        if (!!self.game) { count = self.game.timer.elapsed(); }
        count = isNaN(count) ? 0 : count;
        var count_date = new Date(new Date() - count);

        // In case clock is already running, destroy it
        $('.score-match-clock').countdown('destroy');
        $('.score-match-clock').countdown({
            since: count_date,
            compact: true,
            format: "HMS"
        });
    },

    onTimerStop: function() {
        $('.score-match-clock').countdown('pause');
    },

    onScore: function(value, player) {
        var self = score.pong.ui;

        $(".team-score[data-player='0']").html(self.game.scores[0]);
        $(".team-score[data-player='1']").html(self.game.scores[1]);
    },

    onServer: function(player) {
        $("#server div").html("&nbsp;");
        if ( !_.isNull(player) ) {
            $("#server ." + player).html("Server");
        }
        self.updateGameButtons();
    },

    onGameWin: function() {
    },

    onUndoGameWin: function() {
    },

    onGame: function() {
        self = score.pong.ui;
        self.updateMatchDisplay();
        self.updateGameButtons();
    },

    onHistory: function(history) {
    },

    onSay: function(text) {
    	meSpeak.speak(text);
    },

    onSilence: function(text) {
    },

    updateGameButtons: function() {
        self = score.pong.ui;
        if ( self.game.matchOver
                || (!self.game.matchOver && self.game.gameOver) ) {
            $('.action-select-server').attr({'disabled': true});
            $('.action-increment-score').attr({'disabled': true});
            $('.score-pong-next-game').attr({'disabled': false });
            $('.score-pong-toolbar-buttons').show();
        } else {

            if ( _.isNull(self.game.server.is) ) {
                $('.action-increment-score').attr({'disabled': true}).hide();
                $('.action-select-server').attr({'disabled': false}).show();
            } else {
                $('.action-select-server').attr({'disabled': true}).hide();
                $('.action-increment-score').attr({'disabled': false}).show();
            }

            if ( self.game.gameOver ) {
                $('.score-pong-next-game').attr({'disabled': false});
                $('.score-pong-toolbar-buttons').show();
            } else {
                $('.score-pong-next-game').attr({'disabled': true});
                $('.score-pong-toolbar-buttons').hide();
            }
        }
    },

    updateMatchDisplay: function() {
        var self = score.pong.ui;
        var current_game = 1;
        if ( self.game ) {
            current_game = self.game.games.current;
        }

        $('.score-match-count').html('<strong>Games: </strong>');
        for (var i = 1; i <= self.options.match_length; i++) {
            if (i < current_game) {
                $('.score-match-count').append(
                    $('<span class="score-game-label completed-game">'+i+'</span>') );
            } else if (i == current_game) {
                $('.score-match-count').append(
                    $('<span class="score-game-label current-game">'+i+'</span>') );
            } else {
                $('.score-match-count').append(
                    $('<span class="score-game-label">'+i+'</span>') );
            }
        }
    },

    openMatchLog: function() {
        $('.match-log-modal').modal('show');

        $('.match-log-modal .modal-body').html(
            $('<h3 class="muted text-center">Loading...</h3>') );
    },

    renderMatchLog: function () {
        var self = score.pong.ui;
        var $mbody = $('.match-log-modal .modal-body');

        var $log = $('<div class="match-log-content">');
        var game_log = self.game.history;

        // FIXME: these should be listed in history log
        var p1 = 0,
            p2 = 0,
            serve = null;

        if (game_log.length === 0) {
            $mbody.html( $('<h2 class="text-center">No activity yet</h2>') );
            return;
        }

        for (var i = 0; i < game_log.length; i++) {
            var e = game_log[i];
            var $e = $('<div class="match-log-event row">');
            if (e[0] == "server") {
                server = e[1];

                $e.append(
                    $('<div class="col-md-offset-2">'
                        + '<div>Server changed.</div>' ) );
                $log.append( $e );

            }
            else if (e[0] == "score") {
                $e.append( $('<div class="col-md-2">00:00</div>') );
                if (e[2] == "0") {
                    p1++;
                } else {
                    p2++;
                }
                $e.append(
                    $('<div class="col-md-offset-2">'
                        + '<div class="team-score-block">'
                        +   '<div class="team-score text-center">'+p1 +'</div>'
                        + '</div>'
                        + '<div class="team-score-block">'
                        +   '<div class="team-score text-center">'+ p2+'</div>'
                        + '</div>'
                    + '</div>') );
                $log.append( $e );
            }
            else if (e[0] == "gameWin") {
                p1 = 0;
                p2 = 0;
            }
        }

        $mbody.html( $log ).animate({
            scrollTop: $mbody[0].scrollHeight
        }, 200);
    },

    // UI Control methods
    showSettings: function() {
        $('.score-pong').hide();
        $('.score-pong-settings').show();
    },

    showScoreboard: function() {
        $('.score-pong').hide();
        $('.score-pong-board').show();
        window.scrollTo(0);
        self.updateGameButtons();
    }
    */
};

$(document).ready(function() {
    score.pong.ui.init();
});
