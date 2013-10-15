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

score.shoes = score.shoes || {};

score.shoes.Game = score.shoes.Game || function() {

    var self = {};
    self.events = blackchip.Events();

    self.options = blackchip.Properties({
        maxPlayers: 2,
        gameLength: 11,
        matchLength: 1
    }, self.events, "options");

    score.Game(self);

    score.features.Scores(self);
    score.features.Round(self);
    score.features.Match(self);

    score.rules.WinGameByTwo(self, { when: "after round" });
    score.rules.WinMatchBestOf(self);

    self.ringer = function(player) {
        self.scores[player] += 3;
    };

    self.leaner = function(player) {
        self.scores[player] += 2;
    };

    self.close = function(player) {
        self.scores[player] += 1;
    };

    self.status = function() {
        console.log("Game ", self.currentGame, ":",
                    self.players[0], self.scores[0], "-",
                    self.players[1], self.scores[1],
                    "; Match:",
                    self.players[0], self.match[0], "-",
                    self.players[1], self.match[1]);
    };

    return self;

};
