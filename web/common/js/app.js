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

sb.app = sb.app || function(name) {

    var self = {};

    self.events = sb.events();

    self.settings = sb.settings.get();
    self.options = {};
    self.state = {};
    self.timer = sb.timer();
    self.history = [];
    self.rules = {};

    var init = function() {
        self.actions = {
            undo: self.undo
        };
    };

    self.setPhase = function(phase) {
        self.state.phase = phase;
        if ( phase === "setup" ) {
            self.history = [];
            self.timer.stop();
            self.timer.reset();
        } else {
            if ( phase === "play" ) {
                self.timer.start();
            } else {
                self.timer.stop();
            }
        }
    };

    self.command = function(event) {
        self.state.changes = {};
        self.state.changes.speech = [];
        var func = self.rules[event.action];
        if ( !func ) {
            throw new Error("No such rule: " + event.action);
        }
        func.apply(self, arguments);
    };

    self.next = function() {
        self.command({action: "next"});
    };

    self.playerName = function(index) {
        return self.options.players[index].name;
    };

    self.addSpeech = function(text) {
        self.state.changes.speech.push(text);
    };

    self.speak = function() {
        self.settings.talker.silence();
        _.each(self.state.changes.speech, function(text) {
            self.settings.talker.say(text);
        });
    };

    self.pushHistory = function() {
        if ( !self.history[self.state.currentGame] ) {
            self.history[self.state.currentGame] = [];
        }
        var saveState = _.cloneDeep(self.state);
        saveState.time = self.timer.elapsed();
        self.history[self.state.currentGame].push(saveState);
    };

    self.popHistory = function() {
        var i = self.state.currentGame;
        if ( self.history.length === 0 ) {
            return null;
        }
        if ( self.history[i] ) {
            self.history[i].pop();
        } else {
            i--;
        }
        if ( self.history[i].length === 0 ) {
            delete self.history[self.state.currentGame];
            i--;
        }
        return _.last(_.cloneDeep(self.history[i]));
    };

    self.undo = function() {
        self.settings.talker.silence();
        var previous = self.popHistory();
        if ( previous ) {
            self.state = previous;
            self.setPhase(self.state.phase);
            self.events.trigger("state", self.state);
        } else {
            self.reset();
        }
    };

    self.isSingleGameMatch = function() {
        return self.options.matchLength === 1;
    };

    self.defaultPlayerName = function(index) {
        var number = index + 1;
        return "Player " + number;
    };

    self.loadOptions = function() {
        name = "scorebored_" + self.name;
        if ( localStorage[name] ) {
            self.options = JSON.parse(localStorage[name]);
        }
    };

    self.saveOptions = function() {
        name = "scorebored_" + self.name;
        localStorage[name] = JSON.stringify(self.options);
    };

    self.initialPlayers = function(count) {
        if ( !options.players ) {
            for ( var i = 0; i < count; i++ ) {
                options.players[i] = {
                    id: i,
                    index: i,
                    name: self.defaultPlayerName(i)
                };
            }
        }
    };



    init();
    return self;
};
