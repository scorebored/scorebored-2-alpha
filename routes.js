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
 * routes.js - module to provide routing for app
 */

'use strict';

var configRoutes;
var util = require('./server/util');
var mongodb = require('mongodb');

// - Setup MongoDB connection
var mongoServer = new mongodb.Server(
    'localhost',
    mongodb.Connection.DEFAULT_PORT
);
var dbHandle = new mongodb.Db(
    'sb', mongoServer, { safe: true }
);
dbHandle.open(function() {
    console.log( "** Connected to MongoDB **" );
});


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

// - Setup app routes
configRoutes = function(app, server) {

    app.all('/:game/?', function( req, res, next ) {
        var game = req.params.game;     // Game type

        if (req.method === 'POST') {
            res.contentType( 'json' );
            try {
                // - CREATE NEW GAME
                dbHandle.collection(
                    game,
                    function( outer_error, collection ) {
                        var options_map = { safe: true };
                        outer_error && console.log("outer_error: "+outer_error);

                        // - Verify game settings
                        var game_settings = req.body;

                        // - Save to MongoDB
                        var newGame = GameMap( game );
                        newGame.options = game_settings;

                        collection.insert(
                            newGame,
                            options_map,
                            function (inner_error, result_map) {
                                try {
                                    inner_error && console.log("inner_error: "+inner_error);
                                    // - Respond with game code
                                    res.send({ created: true, id: result_map[0].gameCode });
                                } catch (err) {
                                    console.log(err);
                                    res.send({ created: false, error: err });
                                }
                            }
                        );
                    }
                );
            } catch (e) {
                console.log(e);
                res.send({ created: false, error: e });
            }
        } else {
            next();
        }
    });

    app.all('/:game/:code', function( req, res, next ) {
        var game = req.params.game;     // Game type
        var code = req.params.code;     // Unique game code

        if (req.method === 'POST') {
            res.contentType( 'json' );

            var msg = req.body;

            try {

                // - Authenticate user (i.e. owner of game)
                // - Process message type
                res.send({ error: false, response: "" });

            } catch (e) {
                console.log(e);
                res.send({ error: true, response: e });
            }
        } else {
            res.sendfile( __dirname + '/web/' + game + '/index.html' );
        }
    });

};

module.exports = { configRoutes: configRoutes };
