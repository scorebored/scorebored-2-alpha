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
 * @module score
 */
var score = score || {};

/**
 * Not documented.
 *
 * @class Game
 */
score.Game = score.Game || function(options) {

    var self = {};

    self.events = blackchip.Events();
    self.options = null;
    self.players = null;
    self.undoing = 0;
    self.correction = false;
    self.history = [];
    self.undoHistory = [];
    self.talker = score.talkers.Mute();

    var init = function() {
        options = options || { maxPlayers: 2 };
        options.maxPlayers = options.maxPlayers || 2;
        self.options = blackchip.Properties(options, self.events, "options");

        var players = {
            count: self.options.maxPlayers
        };

        for ( var i = 0; i < self.options.maxPlayers; i++ ) {
            var playerNumber = i + 1;
            players[i] = "Player " + playerNumber;
        }
        self.players = blackchip.Properties(players, self.events, "player");
    };

    self.start = function() {
        self.events.trigger("gameStart");
        self.record("gameStart");
    };

    self.record = function() {
        if ( !self.correction ) {
            undoHistory = [];
            var args = Array.prototype.slice.call(arguments, 0);
            args.unshift(args.pop());
            args.unshift(new Date());   // Prefix with event time
            self.history.push(args);
            self.events.trigger("history", self.history);
        }
    };

    self.undo = function() {
        if ( self.history.length === 0 ) {
            return;
        }
        self.undoing++;
        self.correction = true;
        var args = self.history.pop();
        self.undoHistory.push(args.slice(0));
        args[0] = "undo " + args[0];
        self.events.trigger.apply(null, args);
        self.undoing--;
        self.correction = false;
        self.events.trigger("history", self.history);
    };

    self.redo = function() {
        self.correction = true;
        while ( self.undoHistory.length ) {
            var args = self.undoHistory.pop();
            args[0] = "redo " + args[0];
            self.events.trigger.apply(null, args);
        }
        self.correction = false;
    };

    self.say = function() {
        if ( self.talker && !self.correction ) {
            _.each(arguments, function(text) {
                self.talker.say(text);
            });
        }
    };

    self.silence = function() {
        if ( self.talker ) {
            self.talker.silence();
        }
    };

    self.defaultPlayerName = function(id) {
        playerNumber = _.parseInt(id) + 1;
        return "Player " + playerNumber;
    };

    init();
    return self;
};
