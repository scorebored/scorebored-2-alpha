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

score.talkers = score.talkers || {};

score.talkers.Google = score.talkers.Google || function(events, $audio) {
    
    var ENDPOINT = "http://translate.google.com/translate_tts?ie=UTF-8&tl=en&q=";
    
    var self = {};
    var queue = [];
    var queueing = null;
    var $tag = null;
    
    self.events = events || blackchip.Events();
    
    var init = function() {
        if ( $audio ) {
            $tag = $audio;
        } else {
            $tag = $("<embed id='audio' controller='false'></embed>");
            $("body").append($tag);
        }
    };
    
    self.say = function(text) {
        if ( !queueing ) {
            queueing = setTimeout(speak, 10);
        }
        queue.push(text);
    };
    
    self.silence = function() {
        if ( queueing ) {
            clearTimeout(queueing);
        }
        queue = [];
        self.events.trigger("silence");
    };
    
    var speak = function() {
        queueing = false;
        text = queue.join(". ");
        queue = [];
        $tag.attr("src", ENDPOINT + encodeURIComponent(text)); 
    };
    
    var processQueue = function() {
        if ( queue.length === 0 ) {
            return;
        }
        speak(queue.shift());
    };
    
    init();
    return self;
    
};