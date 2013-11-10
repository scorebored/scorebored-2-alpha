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

sb.settings = sb.settings || function() {

    var self = {};
    var settings = null;

    self.load = function() {
        if ( localStorage.getItem("scorebored") ) {
            settings = JSON.parse(localStorage.getItem("scorebored"));
        } else {
            settings = {};
        }
        
        settings.talker = sb.talker(settings.talker);
        settings.subtitles = ( _.isUndefined(settings.subtitles) ) ?
            true: settings.subtitles;
            
        return settings;
    };

    self.get = function() {
        return settings || self.load();
    };

    self.save = function() {
        var save = _.clone(settings);
        save.talker = save.talker.type.id;
        localStorage.setItem("scorebored", JSON.stringify(save));
    };

    self.ui = function() {
        $(function() { ui(); });
    };
    
    var ui = function() {
        self.load();
        var $talker = $("#talker");
        _.each(settings.talker.types, function(type) {
            var $option = $("<option></option>")
                .attr("value", type.id)
                .html(type.name);
            if ( type.id === settings.talker.type.id ) {
                $option.attr("selected", "selected");
            }
            $talker.append($option);
        });
        if ( settings.subtitles ) {
            $("#subtitles").attr("checked", "checked");
        }
        
        $("#talker").change(function() {
        	settings.talker.set($(this).val());
        	self.save();	
        });
        
        $("#subtitles").click(function() {
            settings.subtitles = $(this).is(":checked");
            self.save();    
        });
    };
    
    return self;

}();
