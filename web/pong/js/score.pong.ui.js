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

score = {};
score.pong = score.pong || {};

score.pong.ui = score.pong.ui || {

    /**
     * Current game settings
     */
    options: {
        'score': 21,
        'mode': 'single',
        'game_name': '',
        'player_1': 'Home Team',
        'player_2': 'Away Team',
        'subtitles': true
    },

    score_options: {
        '11': '11',
        '21': '21'
    },

    init: function () {

        var self = this;

        // Start with new game settings
        this.openGameSettings();

        // Button bindings
        $('.score-pong-open-settings').click(function(e) {
            self.openGameSettings();
        });
        $('#score_settings_play_game').click(function(e) {
            self.saveGameSettings();
        });

    },

    openGameSettings: function(options) {
        options = options || {};
        var new_options = $.extend(true, {}, this.options, options);

        $('#pong_settings_length').val(new_options['score']);
        $('#pong_settings_game_type').val(new_options['mode']);
        $('#pong_settings_player_1_name').val(new_options['player_1']);
        $('#pong_settings_player_2_name').val(new_options['player_2']);

        $('.score-pong').hide();
        $('.score-pong-settings').show();

        return true;
    },

    /**
     * Save and start/resume game with current settings
     */
    saveGameSettings: function() {
        var set_settings = $.extend(true, {}, this.options);
        set_settings['score'] = $('#pong_settings_length').val();
        set_settings['mode'] = $('#pong_settings_game_type').val();
        set_settings['player_1'] = $('#pong_settings_player_1_name').val();
        set_settings['player_2'] = $('#pong_settings_player_2_name').val();

        this.options = set_settings;

        $('.score-pong').hide();
        $('.score-pong-board').show();

        return true;
    }
};

$(document).ready(function() {
    score.pong.ui.init();
});
