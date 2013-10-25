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

score = score || {};
score.pong = score.pong || {};

score.pong.ui = score.pong.ui || {

    game: null,     // Stores game instance

    /**
     * Current game settings
     */
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

        $('.team-name').fitText(1.0);
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
            if ( _.isNull(self.game.server.is) ) {
                self.game.server.is = player;
            } else {
                self.game.scores[player] += 1;
            }
        });
    },

    initGame: function() {
        self = score.pong.ui;
        self.game = score.pong.Game({matchLength: this.options.match_length,
                                     gameLength: this.options.game_length});
        // FIXME
//        window.pong = this.game;

        var talkers = {
            mute: score.talkers.Mute(self.game.events),
            google: score.talkers.Google(self.game.events)
        };

        self.game.talker = talkers.google;

        // Event bindings
        self.game.events
            .on("score", this.onScore)
            .on("server", this.onServer)
            .on("gameStart", this.onGameStart)
            .on("timerStart", this.onTimerStart)
            .on("timerStop", this.onTimerStop)
            .on("after gameWin", this.onGameWin)
            .on("undo gameWin", this.onUndoGameWin)
            .on("game", this.onGame)
            .on("history", this.onHistory)
            .on("say", this.onSay)
            .on("after say", this.onSilence)
            .on("silence", this.onSilence);

        // DEBUG?
        self.game.events.all(function() {
            console.log(arguments);
        });

        // Enable 'Cancel' button
        $('.cancel-settings').show();
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

    /**
     * Save and start/resume game with current settings
     */
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

        $('.team-name[data-player="0"]').text( this.options.player_1 );
        $('.team-name[data-player="1"]').text( this.options.player_2 );


        self.updateMatchCountDisplay();

        // Initialize game
        if (!(!!self.game)) {
            this.initGame();
        } else {
            // Update game
        }

        this.showScoreboard();
        $(window).resize();

        return true;
    },

    onGameStart: function() {
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
        if ( !_.isNull(pong.server.is) ) {
            $("#server ." + player).html("Server");
        }
    },

    onGameWin: function() {
    },

    onUndoGameWin: function() {
    },

    onGame: function(games, player) {
    },

    onHistory: function(history) {
    },

    onSay: function(text) {
    },

    onSilence: function(text) {
    },

    updateMatchCountDisplay: function() {
        var self = score.pong.ui;

        $('.score-match-count').html('<strong>Match Count: </strong>');
        for (var i = 0; i < self.options.match_length; i++) {
            if (i == 0) {   // FIXME
                $('.score-match-count').append(
                    $('<span class="score-game-label current-game">'+(i+1)+'</span>') );
            } else {
                $('.score-match-count').append(
                    $('<span class="score-game-label">'+(i+1)+'</span>') );
            }
        }
    },

    // UI Control methods
    showSettings: function() {
        $('.score-pong').hide();
        $('.score-pong-settings').show();
    },

    showScoreboard: function() {
        $('.score-pong').hide();
        $('.score-pong-board').show();
    }
};

$(document).ready(function() {
    score.pong.ui.init();
});
