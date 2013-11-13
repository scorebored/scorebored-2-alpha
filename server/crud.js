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

/*
 * crud.js - module to provide CRUD operations for games
 */

'use strict';

var util = require('./util');

var GameMap = function( game ) {
    var created = Date.now();
    return {
        game: game,
        gameCode: util.makeNewGameCode( created ),
        gameOwner: {},
        created: created,
        history: [],
        options: {},
        state: {}
    };
};


var crud = function (db) {
    var self = {};

    self.createGame = function (game, options, callback) {
        // - Verify game settings
        var game_settings = options;

        try {
            // - CREATE NEW GAME
            db.collection(
                game,
                function( outer_error, collection ) {
                    var options_map = { safe: true };
                    if (outer_error) {
                        console.log("createGame: outer_error => "+outer_error);
                        callback(outer_error);
                        return;
                    }

                    // - Save to MongoDB
                    var newGame = GameMap( game );
                    newGame.options = game_settings;

                    collection.insert(
                        newGame,
                        options_map,
                        function (inner_error, result_map) {
                            if (inner_error) {
                                console.log("createGame: inner_error => "+inner_error);
                                callback(inner_error);
                                return;
                            }
                            callback(false, result_map[0]);
                        }
                    );
                }
            );
        } catch (e) {
            console.log(e);
            callback(e);
        }
    };

    self.getGameByCode = function (game, code, callback) {
        try {

            db.collection(
                game,
                function( outer_error, collection ) {
                    var options_map = { safe: true };
                    if (outer_error) {
                        console.log("getGameByCode: outer_error => "+outer_error);
                        callback(outer_error);
                        return;
                    }

                    collection.findOne(
                        { gameCode: code },
                        function ( inner_error, result_map ) {
                            if (inner_error) {
                                console.log("getGameByCode: inner_error => "+inner_error);
                                callback(inner_error);
                                return;
                            }
                            if (result_map === null) {
                                console.log("getGameByCode: no game with code '"+code+"' found.");
                                callback("No game found matching '"+code+"'.");
                                return;
                            }
                            callback(false, result_map);
                        }
                    );
                }
            );

        } catch (e) {
            console.log("getGameByCode: e => "+e);
            callback(e);
        }
    };

    return self;
};

module.exports = { crud: crud };
