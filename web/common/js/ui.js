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

    self.playerNames = function(players) {
        $(".name").each(function() {
            var index = _.parseInt($(this).attr("data-player"));
            $(this).html(players[index].name);
        });
    };

    self.update = {};
    
    self.update.optionTitle = function(title) {
        $("[data-control='set-team-name']").val(title);
    };
    
    self.update.optionPlayerNames = function(players) {
        $("[data-control='set-player-name']").each(function() {
            var index = _.parseInt($(this).attr("data-player"));
            $(this).val(players[index].name); 
        });    
    };

    self.update.optionTeamNames = function(teams) {
        $("[data-control='set-team-name']").each(function() {
            var index = _.parseInt($(this).attr("data-team"));
            $(this).val(teams[index].name); 
        });    
    };
        
    self.fill = {};
    
    self.fill.optionGameLength = function(gameLength, gameLengths) {
        var $target = $("#option-game-length");
        _.each(gameLengths, function(length) {
            var $option = $("<option></option>")
                    .attr("value", length.value)
                    .html(length.description);
            if ( length.value === gameLength ) {
                $option.attr("selected", "selected");
            }
            $target.append($option);
        });
    };

    self.fill.optionMatchLength = function(matchLength, matchLengths) {
        var $target = $("#option-match-length");
        _.each(matchLengths, function(length) {
            var $option = $("<option></option>")
                    .attr("value", length.value)
                    .html(length.description);
            if ( length === matchLength ) {
                $option.attr("selected", "selected");
            }
            $target.append($option);
        });
    };

    self.validate = {};
    
    self.validate.optionGameLength = function(gameLengths, isValid) {
        _.each(gameLengths, function(length) {
            var $target = $("#option-game-length option[value='" + length + "']");
            var valid = isValid(length.value);
            if ( valid ) {
                $target.removeAttr("disabled");
            } else {
                $target.attr("disabled", "disabled");
            }
        });
    };
        
    self.validate.optionMatchLength = function(matchLengths, isValid) {
        _.each(matchLengths, function(length) {
            var $target = $("#option-match-length option[value='" + length + "']");
            var valid = isValid(length);
            if ( valid ) {
                $target.removeAttr("disabled");
            } else {
                $target.attr("disabled", "disabled");
            }
        });
    };
    
    self.points = function(scores) {
        $(".score").each(function() {
            var index = _.parseInt($(this).attr("data-player"));
            $(this).html(scores[index]);
        });
    };

    self.games = function(games, length) {
        $(".games").each(function() {
            var index = _.parseInt($(this).attr("data-player"));
            $(this).html(games[index]);
        });
    };

    self.sides = function(sides) {
        $("[data-side]").each(function() {
            var side = _.parseInt($(this).attr("data-side"));
            $(this).attr("data-player", sides[side]);
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







    return self;

}();
