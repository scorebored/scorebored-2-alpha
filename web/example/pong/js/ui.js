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
    $("#option-variant").change(function() {
        var variant = _.find(app.variants, {value: $(this).val()});
        app.setVariant(variant.value);
        app.changeOptions();   
    });
    
    // Set the match title
    $("#option-title").blur(function() {
        app.options.title = $(this).val();
        app.changeOptions();
    });

    // Set the team name
    $("[data-control='option-team-name']").blur(function() {
        var team = $(this).attr("data-team");
        app.options.teams[team].name = $(this).val();
        app.changeOptions();   
    });
    
    // Set the player name
    $("[data-control='option-player-name']").blur(function() {
        var player = $(this).attr("data-player");
        app.options.players[player].name = $(this).val();
        app.changeOptions();
    });

    // Sets the game length to either 11 or 21 points
    $("#option-game-length").change(function() {
        app.options.gameLength = _.parseInt($(this).val());
        app.changeOptions();
    });

    // Sets the match length to the best out of 1, 3, 5, or 7.
    $("#option-match-length").change(function() {
        app.options.matchLength = _.parseInt($(this).val());
        app.changeOptions();
    });
        
    // Select the rule that will be used to decide who serves first after
    // a game win. Either alternate, winner, or loser.
    $("#option-next-server").change(function() {
        app.options.nextServer = $(this).val();
        app.changeOptions();
    });

    var updateState = function() {
        var state = app.state;

        // Move the players to different sides if necessary.
        sb.ui.updateSides(state.sides);

        // Update the names
        sb.ui.updateDisplays("[data-display='player-name']", 
                "data-player", app.options.players, "name");
        sb.ui.updateDisplays("[data-display='team-name']", 
                "data-team", app.options.teams, "name");

        sb.ui.updateDisplays("[data-display='score']", 
                "data-team", app.state.scores);
                
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
        sb.ui.validateOptionGameLength(app.gameLengths, function(length) {
            return app.state.scores[0] < length && app.state.scores[1] < length;
        });

        // Disable match lengths in the settings combob box that are
        // no longer valid (3 cannot be picked while in game 3)
        sb.ui.validateOptionMatchLength(app.matchLengths, function(length) {
            return app.state.games[0] + app.state.games[1] < length;
        });

        // Show who is serving
        $(".team-name").removeClass("server");
        $(".player-name").removeClass("server");

        if ( !_.isNull(state.serverTeam) ) {
            if ( app.options.team ) {
                $(".player-name[data-player='" + state.serverPlayer + "']")
                        .addClass("server");
            } else {
                $(".team-name[data-player='" + state.serverTeam + "']")
                        .addClass("server");
            }
        }

        // Update the number of games won by each player in the match
        sb.ui.updateDisplays("[data-display='score']", 
                "data-team", state.games, "name");

        // If this is a multi game match, show which game is currently
        // being played. Otherwise, leave this blank
        if ( !app.isSingleGameMatch() ) {
            var current = app.state.currentGame + 1;
            $("#match-status").html("Game " + current + " of " +
                    app.options.matchLength);
        } else {
            $("#match-status").html("&nbsp;");
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
        
        if ( state.phase === "setup" ) {
            $("#option-variant").removeAttr("disabled");
        } else {
            $("#option-variant").attr("disabled", "disabled");
        }
    };
    app.events.on("state", updateState);

    sb.ui.fillOptions("#option-variant", app.variants);
    sb.ui.fillOptions("#option-game-length", app.gameLengths);
    sb.ui.fillOptions("#option-match-length", app.matchLengths);
    sb.ui.fillOptions("#option-next-server", app.nextServerOptions);    

    var updateOptions = function() {
        
        var variant = _.find(app.variants, { value: app.options.variant });
        $("#option-variant").val(variant.value);
        sb.ui.toggleDisplay("data-variant", variant.show, variant.hide);
        
        sb.ui.updateInputs("[data-control='option-player-name']", 
                "data-player", app.options.players, "name");
        sb.ui.updateInputs("[data-control='option-team-name']", 
                "data-team", app.options.teams, "name");
        
        $("#option-game-length").val(app.options.gameLength);
        $("#option-match-length").val(app.options.matchLength);
        $("#option-next-server").val(app.options.nextServer);        
        $("#option-title").val(app.options.title);
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
    $("[data-control='team']").click(function() {
        var team = _.parseInt($(this).attr("data-team"));
        if ( app.state.phase === "setup" ) {
            app.initialServer(team);
        } else {
            app.point(team);
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

