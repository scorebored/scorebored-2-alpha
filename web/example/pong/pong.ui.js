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

$(function() {

    var app = sb.pong.app();
    window.pong = app;

    // From the settings page, go to the scorebored page
    $("#scorebored").click(function() {
        $("#settings-page").hide();
        $("#scorebored-page").show();
    });

    // From the scorebored page, go back to the settings page
    $("#settings").click(function() {
        $("#scorebored-page").hide();
        $("#settings-page").show();
    });

    // From the scorebored page, go to the match log page
    $("#log").click(function() {
        $("#scorebored-page").hide();
        displayLog();
        $("#log-page").show();
    });

    // From the match log page, go back to the scorebored page
    $("#logBack").click(function() {
        $("#log-page").hide();
        $("#scorebored-page").show();
    });

    // Award a point for the player. If the game hasn't started, use this
    // to select the first server.
    $("button.add").click(function() {
        var player = _.parseInt($(this).attr("data-player"));
        if ( app.state.status === "setup" ) {
            app.selectServer(player);
        } else {
            app.awardPoint(player);
        }
    });

    // Undo the last scoring event
    $("#undo").click(function() {
        app.undo();
    });

    // Either continue to the next game, or end and reset the match
    $("#continue").click(function() {
        if ( app.state.status === "next" ) {
            app.nextGame();
        } else if ( app.state.status === "end" ) {
            app.reset();
        } else {
            throw new Error("Invalid status: " + app.state.status);
        }
    });

    // Update the player name
    $("#setNames input").keyup(function() {
        var player = $(this).attr("data-player");
        var name = $(this).val();
        if ( /^ *$/.test(name) ) {
            name = app.defaultPlayerName(player);
        }
        app.options.players[player].name = name;
        updateState();
    });

    // Select the rule that will be used to decide who serves first after
    // a game win. Either alternate, winner, or loser.
    $("#setNextServer select").change(function() {
        app.options.nextServer = $(this).val();
    });

    // Sets the match length to the best out of 1, 3, 5, or 7.
    $("#setMatchLength").change(function() {
        app.options.matchLength = _.parseInt($(this).val());
        updateState();
    });

    // Sets the game length to either 11 or 21 points
    $("#setGameLength").change(function() {
        app.options.gameLength = _.parseInt($(this).val());
        updateState();
    });

    // Update the UI based on a change of game state
    var updateState = function() {
        var state = app.state;

        // Move the players to different sides if necessary.
        sb.ui.sides(state.sides);

        // Update the names
        sb.ui.names(app.options.players);

        // Update the game length
        $("#gameLength").html(app.options.gameLength + " point game");

        // Show who is serving
        $("#server div").html("&nbsp;");
        if ( !_.isNull(state.server) ) {
            $("#server [data-player='" + state.server + "']").html("Server");
        }

        // Update the scores
        sb.ui.points(state.scores);

        // Update the number of games won by each player in the match
        sb.ui.games(state.games, app.options.matchLength);

        // If this is a multi game match, show which game is currently
        // being played. Otherwise, leave this blank
        if ( !app.isSingleGameMatch() ) {
            var current = app.state.currentGame + 1;
            $("#matchStatus").html("Game " + current + " of " +
                    app.options.matchLength);
        } else {
            $("#matchStatus").html("&nbsp;");
        }

        // Enable to undo button unless this is the setup phase
        if ( state.status !== "setup" ) {
            $("#undo").removeAttr("disabled");
        } else {
            $("#undo").attr("disabled", "disabled");
        }

        // If at the game or end of match, show the continue button
        // and disabled the "plus" buttons for each player.
        if ( state.status === "next" || state.status === "end" ) {
            $("#continue").css("visibility", "visible");
            $("button.add").attr("disabled", "disabled");
        } else {
            $("#continue").css("visibility", "hidden");
            $("button.add").removeAttr("disabled");
        }

        // Disable game lengths in the settings combo box that are
        // no longer valid (game has already reached 11 points)
        sb.ui.validateGameLength(app.gameLengths, function(length) {
            return app.state.scores[0] < length && app.state.scores[1] < length;
        });

        // Disable match lengths in the settings combob box that are
        // no longer valid (3 cannot be picked while in game 3)
        sb.ui.validateMatchLength(app.matchLengths, function(length) {
            return app.state.games[0] + app.state.games[1] < length;
        });
    };

    // Listen for state change events
    app.events.on("state", updateState);

    // Update the timer
    setInterval(function() {
        var elapsed = app.timer.elapsed();
        $("#timer").html(sb.util.elapsedString(elapsed));
    }, 100);

    // Handles display of the subtitles
    sb.ui.subtitles(app.settings.talker);

    // Populates the game length combo with the appropriate values
    sb.ui.gameLength(app.options.gameLength, app.gameLengths);

    // Populates the match length combo with the appropriate values
    sb.ui.matchLength(app.options.matchLength, app.matchLengths);

    // Populate the match log
    var displayLog = function() {
        var $target = $("#history").empty();
        var contents = [];
        _.each(app.history, function(games, index) {
            contents.push("<table>");

            // Only show the game heading if this is a multi game match.
            if ( !app.isSingleGameMatch() ) {
                var gameNumber = index + 1;
                contents.push("<caption>Game " + gameNumber + "</caption>");
            }
            contents.push("<tr>");

            contents.push("<th>Time</th>");
            contents.push("<th>" + app.playerName(0) + "</th>");
            contents.push("<th></th>");
            contents.push("<th>" + app.playerName(1) + "</th>");
            _.each(games, function(state) {
                var server;
                contents.push("<tr>");
                contents.push("<td>" +
                        sb.util.elapsedString(state.time) + "</td>");

                // Bold if server
                server = state.served === 0 ? "class='server'": "";
                contents.push("<td " + server + ">" + state.scores[0] + "</td>");

                // Mark with < or > who earned the point
                if ( state.changes.point === 0 ) {
                    contents.push("<td>&lt;</td>");
                } else {
                    contents.push("<td>&gt</td>");
                }

                server = state.served === 1 ? "class='server'": "";
                contents.push("<td " + server + ">" + state.scores[1] + "</td>");
                contents.push("</tr>");
            });
            contents.push("</table>");
        });
        $target.append(contents.join(""));
    };

    updateState();

});
