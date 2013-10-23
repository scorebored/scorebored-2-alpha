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

        $('.displayed-score').fitText(0.2);

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

        $('.score-actions button').click(function(e) {
            var player = $(this).attr('data-player');
            if ( _.isNull(self.game.server.is) ) {
                self.game.server.is = player;
            } else {
                self.game.scores[player] += 1;
            }
        });
    },

    initGame: function() {
        this.game = score.pong.Game({matchLength: this.options.match_length,
                                     gameLength: this.options.game_length});
        // FIXME
        window.pong = this.game;

        var talkers = {
            mute: score.talkers.Mute(this.game.events),
            google: score.talkers.Google(this.game.events)
        };

        this.game.talker = talkers.google;

        // Event bindings
        this.game.events
            .on("score", this.onScore)
            .on("server", this.onServer)
            .on("after gameWin", this.onGameWin)
            .on("undo gameWin", this.onUndoGameWin)
            .on("game", this.onGame)
            .on("history", this.onHistory)
            .on("say", this.onSay)
            .on("after say", this.onSilence)
            .on("silence", this.onSilence);

        // DEBUG?
        this.game.events.all(function() {
            console.log(arguments);
        });

        // Enable 'Cancel' button
        $('.cancel-settings').show();
    },

    openGameSettings: function(options) {
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
            (this.game) ? 'Resume Game' : 'Begin Game'
        );
        this.showSettings();

        return true;
    },

    /**
     * Save and start/resume game with current settings
     */
    saveGameSettings: function() {
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

        this.options = set_settings;

        $('.team-1-name').text( this.options.player_1 );
        $('.team-2-name').text( this.options.player_2 );

        // Initialize game
        if (!(!!this.game)) {
            this.initGame();
        } else {
            // Update game
        }

        this.showScoreboard();
        $(window).resize();

        return true;
    },

    onScore: function(value, player) {
        $('.team-'+player+'-score').html(value);
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
