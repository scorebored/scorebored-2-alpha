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

sb = sb || {};
sb.pong = sb.pong || {};

sb.pong.ui = sb.pong.ui || function(app) {

    var self = {};

    // From the options page, go to the scorebored page
    $("#scorebored").click(function() {
        $("#options-page").hide();
        $("#scorebored-page").show();
    });

    // Cancel current game and reset
    $("#reset").click(function() {
        app.reset();
    });

    // Change the variant
    $("#variant").change(function() {
        app.setVariant($(this).val());
        updateOptions();    
    });
    
    // Set the match title
    $("#setTitle").keyup(function() {
        app.options.title = $(this).val();
        app.events.trigger("options");
    });

    // Set the player name
    $("#setNames input").keyup(function() {
        var player = $(this).attr("data-player");
        var name = $(this).val();
        if ( /^ *$/.test(name) ) {
            name = app.defaultPlayerName(player);
        }
        app.options.players[player].name = name;
        app.events.trigger("options");
    });

    // Select the rule that will be used to decide who serves first after
    // a game win. Either alternate, winner, or loser.
    $("#setNextServer select").change(function() {
        app.options.nextServer = $(this).val();
        app.events.trigger("options");
    });

    // Sets the match length to the best out of 1, 3, 5, or 7.
    $("#setMatchLength").change(function() {
        app.options.matchLength = _.parseInt($(this).val());
        app.events.trigger("options");
    });

    // Sets the game length to either 11 or 21 points
    $("#setGameLength").change(function() {
        app.options.gameLength = _.parseInt($(this).val());
        app.events.trigger("options");
    });

    var updateState = function() {
        var state = app.state;

        // Move the players to different sides if necessary.
        sb.ui.sides(state.sides);

        // Update the names
        sb.ui.playerNames(app.options.players);

        // At the beginning of the game, show "Start" as the button to
        // take you to the scorebored. If the game is in progress, show
        // "Continue"
        if ( app.state.phase === "setup" ) {
            $("#scorebored").html("Start");
        } else {
            $("#scorebored").html("Continue");
        }

        // Show reset button if the game is in progress
        if ( app.state.phase === "setup" ) {
            $("#reset").hide();
        } else {
            $("#reset").show();
        }

        // Disable game lengths in the settings combo box that are
        // no longer valid (game has already reached 11 points)
        sb.ui.validate.optionGameLength(app.gameLengths, function(length) {
            return app.state.scores[0] < length && app.state.scores[1] < length;
        });

        // Disable match lengths in the settings combob box that are
        // no longer valid (3 cannot be picked while in game 3)
        sb.ui.validate.optionMatchLength(app.matchLengths, function(length) {
            return app.state.games[0] + app.state.games[1] < length;
        });

        // Show who is serving
        $(".name").removeClass("server");
        if ( !_.isNull(state.server) ) {
            $(".name[data-player='" + state.server + "']").addClass("server");
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
        if ( state.phase !== "setup" ) {
            $("#undo").removeAttr("disabled");
        } else {
            $("#undo").attr("disabled", "disabled");
        }

        // If at the game or end of match, show the continue button
        // and disabled the "plus" buttons for each player.
        if ( state.phase === "next" || state.phase === "end" ) {
            $("#continue").css("visibility", "visible");
            $("button.add").attr("disabled", "disabled");
        } else {
            $("#continue").css("visibility", "hidden");
            $("button.add").removeAttr("disabled");
        }
    };
    app.events.on("state", updateState);

    // Populates the game length combo with the appropriate values
    sb.ui.fill.optionGameLength(app.options.gameLength, app.gameLengths);

    // Populates the match length combo with the appropriate values
    sb.ui.fill.optionMatchLength(app.options.matchLength, app.matchLengths);

    var updateOptions = function() {
        if ( app.variant === "singles" ) {
            $("[data-variant='team']").addClass("hidden");
            $("[data-variant='hook']").addClass("hidden");
        } else if ( app.variant === "doubles" ) {
            $("[data-variant='hook']").addClass("hidden");
            $("[data-variant='team']").removeClass("hidden");
        } else if ( app.variant === "hook" ) {
            $("[data-variant='hook']").removeClass("hidden");
            $("[data-variant='team']").removeClass("hidden");            
        }

        sb.ui.update.optionTitle(app.options.title);
        sb.ui.update.optionPlayerNames(app.options.players);        
        sb.ui.update.optionTeamNames(app.options.teams);
        
        $("#setNextServer select").val(app.options.nextServer);
        $("#setMatchLength").val(app.options.matchLength);
        $("#setGameLength").val(app.options.gameLength);

        // Update the title
        $("#title").html(app.options.title);

        updateState();
    };
    app.events.on("options", updateOptions);

    // From the scorebored page, go back to the settings page
    $("#back-options").click(function() {
        $("#scorebored-page").hide();
        $("#options-page").show();
    });

    // From the scorebored page, go to the match log page
    $("#history").click(function() {
        $("#scorebored-page").hide();
        refreshHistory();
        $("#history-page").show();
    });

    // Award a point for the player. If the game hasn't started, use this
    // to select the first server.
    $("button.add").click(function() {
        var player = _.parseInt($(this).attr("data-player"));
        if ( app.state.phase === "setup" ) {
            app.initialServer(player);
        } else {
            app.point(player);
        }
    });

    // Undo the last scoring event
    $("#undo").click(function() {
        app.undo();
    });

    // Either continue to the next game, or end and reset the match
    $("#continue").click(function() {
        if ( app.state.phase === "next" ) {
            app.next();
        } else if ( app.state.phase === "end" ) {
            app.reset();
        } else {
            throw new Error("Invalid status: " + app.state.status);
        }
    });

    // Update the timer
    setInterval(function() {
        var elapsed = app.timer.elapsed();
        $("#timer").html(sb.util.elapsedString(elapsed));
    }, 100);

    // Handles display of the subtitles
    sb.ui.subtitles(app.settings.talker);

    // From the match log page, go back to the scorebored page
    $("#back-scorebored").click(function() {
        $("#history-page").hide();
        $("#scorebored-page").show();
    });

    // Populate the match log
    var refreshHistory = function() {
        var $target = $("#history-table").empty();
        var contents = [];
        _.each(app.history, function(games, index) {
            contents.push("<table class='table table-condensed'>");

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
                server = state.served === 0 ? "class='served'": "";
                contents.push("<td " + server + ">" + state.scores[0] + "</td>");

                // Mark with < or > who earned the point
                if ( state.changes.point === 0 ) {
                    contents.push("<td>&lt;</td>");
                } else {
                    contents.push("<td>&gt</td>");
                }

                server = state.served === 1 ? "class='served'": "";
                contents.push("<td " + server + ">" + state.scores[1] + "</td>");
                contents.push("</tr>");
            });
            contents.push("</table>");
        });
        $target.append(contents.join(""));
    };

    updateOptions();

};

