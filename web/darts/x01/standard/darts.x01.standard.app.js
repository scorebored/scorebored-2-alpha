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

var sb = sb || {};
sb.darts = sb.darts || {};
sb.darts.x01 = sb.darts.x01 = {};
sb.darts.x01.standard = sb.darts.x01.standard = {};

sb.darts.x01.standard.app = sb.darts.x01.standard.app || function() {

    var self = sb.app("darts.x01");

    self.options = {
        title: "",
        players: [
            { id: 0, name: "Player 1" },
            { id: 1, name: "Player 2" }
        ],
        gameLength: 301,
        setLength: 1,
        matchLength: 1
    };

    self.gameLengths = [301, 501];
    self.setLengths = [1, 3, 5];
    self.matchLengths = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21];

};