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

    self.toggleDisplay = function(attribute, shows, hides) {
        _.each(hides, function(hide) {
            $("[" + attribute + "='" + hide + "']").addClass("hidden");
        });    
        _.each(shows, function(show) {
            $("[" + attribute + "='" + show + "']").removeClass("hidden");
        });  
    };
    
    self.updateDisplays = function(selector, indexAttr, values, attribute) {
        $(selector).each(function() {
            var index = _.parseInt($(this).attr(indexAttr));
            if ( !_.isUndefined(values[index]) ) {
                if ( !_.isUndefined(attribute) ) {
                    $(this).html(values[index][attribute]);
                } else {
                    $(this).html(values[index]);
                }
            }
        });            
    };
        
    self.updateInputs = function(selector, indexAttr, values, attribute) {
        $(selector).each(function() {
            var index = _.parseInt($(this).attr(indexAttr));
            if ( !_.isUndefined(values[index]) ) {
                $(this).val(values[index][attribute]);
            }   
        });    
    };
    
    self.updateSides = function(sides) {
        $("[data-side-team]").each(function() {
            var side = _.parseInt($(this).attr("data-side-team"));
            $(this).attr("data-team", sides.teams[side]);
        });
        $("[data-side-player]").each(function() {
            var side = _.parseInt($(this).attr("data-side-player"));
            var index = _.parseInt($(this).attr("data-side-index"));
            $(this).attr("data-player", sides.players[side][index]);
        });
    };
            
    self.fillOptions = function(selector, options) {
        var $target = $(selector);
        _.each(options, function(option) {
            var $option = $("<option></option>")
                    .attr("value", option.value)
                    .html(option.description);
            $target.append($option);    
        });    
    };
        
    self.validateOptionGameLength = function(gameLengths, isValid) {
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
        
    self.validateOptionMatchLength = function(matchLengths, isValid) {
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
