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
 * @module sb
 */
var sb = sb || {};

sb.ui = sb.ui || function() {

    var self = {};

    self.names = function(players) {
        _.each(players, function(player, index) {
            $("#names [data-player='" + index + "']").html(player.name);
        });
    };

    self.points = function(scores) {
        _.each(scores, function(score, index) {
            $("#scores [data-player='" + index + "']").html(score);
        });
    };

    self.games = function(games, length) {
        _.each(games, function(game, index) {
            var value = ( length === 1 ) ? "&nbsp;" : game;
            $("#games [data-player='" + index + "']").html(value);
        });
    };

    self.sides = function(sides) {
        _.each(sides, function(player, index) {
            $("[data-side='" + index + "']").attr("data-player", player);
        });
    };

    self.subtitles = function(talker) {
        talker.events.on("say", function(text) {
            $("#announcement").html(text);
        });

        talker.events.on("silence", function() {
            $("#announcement").html("&nbsp");
        });
    };

    self.gameLength = function(gameLength, gameLengths) {
        var $target = $("#setGameLength");
        _.each(gameLengths, function(length) {
            var $option = $("<option></option>")
                    .attr("value", length)
                    .html(length);
            if ( length === gameLength ) {
                $option.attr("selected", "selected");
            }
            $target.append($option);
        });
    };

    self.validateGameLength = function(gameLengths, isValid) {
        _.each(gameLengths, function(length) {
            var $target = $("#setGameLength option[value='" + length + "']");
            var valid = isValid(length);
            if ( valid ) {
                $target.removeAttr("disabled");
            } else {
                $target.attr("disabled", "disabled");
            }
        });
    };

    self.matchLength = function(matchLength, matchLengths) {
        var $target = $("#setMatchLength");
        _.each(matchLengths, function(length) {
            var $option = $("<option></option>")
                    .attr("value", length)
                    .html(length);
            if ( length === matchLength ) {
                $option.attr("selected", "selected");
            }
            $target.append($option);
        });
    };

    self.validateMatchLength = function(matchLengths, isValid) {
        _.each(matchLengths, function(length) {
            var $target = $("#setMatchLength option[value='" + length + "']");
            var valid = isValid(length);
            if ( valid ) {
                $target.removeAttr("disabled");
            } else {
                $target.attr("disabled", "disabled");
            }
        });
    };

    return self;

}();
