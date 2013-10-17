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

score.shoes.Announcer = score.shoes.Announcer || function(game, talker) {

    self = {};
    self.game = game;
    self.talker = talker;

    score.Announcer(self);

    score.announcers.RoundPoints(self);
    score.announcers.Score(self, {when: "after round"});
    score.announcers.GameWinner(self);
    score.announcers.MatchWinner(self);

    self.events.on("score", function(event) {
        var amount = event.value - event.previous;
        if ( amount === 3 ) {
            self.talker.say("Ringer!");
        } else if ( amount === 2 ) {
            self.talker.say("Leaner!");
        }
    });

    return self;
};