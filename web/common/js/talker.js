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

/**
 * @module sb
 */
var sb = sb || {};

sb.talker = sb.talker || function(id) {

    var self = {};

    self.events = sb.events();
    self.type = null;
    self.types = {
        mute: sb.talker.mute(self.events),
        mespeak: sb.talker.mespeak(self.events)
    };
    
    var init = function() {
        id = id || "mute";
        self.set(id);
    };

    self.say = function(text) {
        if ( self.type ) {
            self.type.say(text);
        }
    };

    self.silence = function() {
        if ( self.type ) {
            self.type.silence();
        }
    };

    self.set = function(id) {
        self.type = self.types[id];
    };
    
    init();
    return self;
};


sb.talker.mute = sb.talker.mute || function(events) {

    var queue = [];
    var talking = null;

    var self = {};

    self.id = "mute";
    self.name = "Mute";
    self.delay = 1000;
    self.events = events || sb.events();

    self.say = function(text) {
        if ( talking ) {
            queue.push(text);
        } else {
            speak(text);
        }
    };

    self.silence = function() {
        if ( talking ) {
            clearTimeout(talking);
            talking = null;
        }
        queue = [];
        self.events.trigger("silence");
    };

    var speak = function(text) {
        self.events.trigger("say", text);
        talking = setTimeout(function() {
            self.events.trigger("silence");
            talking = null;
            processQueue();
        }, self.delay);
    };

    var processQueue = function() {
        if ( queue.length === 0 ) {
            return;
        }
        speak(queue.shift());
    };

    return self;

};

sb.talker.mespeak = sb.talker.mespeak || function(events) {
	
	var talking = false;
	var self = {};

    self.id = "mespeak";
    self.name = "meSpeak";
    self.events = events || sb.events();

	var init = function() {
        meSpeak.loadConfig("/scorebored/lib/mespeak/mespeak_config.json");
        meSpeak.loadVoice("/scorebored/lib/mespeak/voices/en/en-rp.json");
	};
	
    self.say = function(text) {
        if ( talking ) {
            queue.push(text);
        } else {
            speak(text);
        }
    };

    self.silence = function() {
        queue = [];
    };
    
    var speak = function(text) {
        self.events.trigger("say", text);
        talking = true;
		meSpeak.speak(text, {}, function() {
			self.events.trigger("silence");
			talking = false;
			processQueue();
		});
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
