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

(function() {

    blackchip.ScriptLoader.load([
        "common/lib/jquery.js",
        "common/lib/lodash.js",
        "common/lib/bootstrap/js/bootstrap.js",

        "common/js/blackchip/module.js",
        "common/js/blackchip/Console.js",
        "common/js/blackchip/Events.js",
        "common/js/blackchip/Logging.js",
        "common/js/blackchip/Properties.js",

        "common/js/score/Announcer.js",
        "common/js/score/Game.js",

        "common/js/score/announcers/ChangeServers.js",
        "common/js/score/announcers/Deuce.js",
        "common/js/score/announcers/GamePoint.js",
        "common/js/score/announcers/GameWinner.js",
        "common/js/score/announcers/MatchPoint.js",
        "common/js/score/announcers/MatchStandings.js",
        "common/js/score/announcers/MatchWinner.js",
        "common/js/score/announcers/PlayerPoint.js",
        "common/js/score/announcers/RoundPoints.js",
        "common/js/score/announcers/Score.js",
        "common/js/score/announcers/ScoreByServer.js",
        "common/js/score/announcers/SwitchSides.js",

        "common/js/score/features/Match.js",
        "common/js/score/features/Round.js",
        "common/js/score/features/Scores.js",
        "common/js/score/features/Server.js",
        "common/js/score/features/Sides.js",

        "common/js/score/rules/WinGameByTwo.js",
        "common/js/score/rules/WinMatchBestOf.js",

        "common/js/score/talkers/Console.js"
    ]);

})();
