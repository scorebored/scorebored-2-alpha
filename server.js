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

/*
 * server.js - Server component for ScoreBored app
 */

'use strict';

var http = require('http');
var express = require('express');
var io = require('socket.io');
var mongodb = require('mongodb');
var routes = require('./routes');

var app = express();
var server = http.createServer( app );
var socket = io.listen(server);


app.configure(function() {
    app.use( express.bodyParser() );
    app.use( express.methodOverride() );
    app.use( express.logger() );

    app.use( express.static( __dirname + '/web') );
    app.use( app.router );
});

app.configure('development', function() {
    app.use( express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }) );
});

// - Setup MongoDB connection
var mongoServer = new mongodb.Server(
    'localhost',
    mongodb.Connection.DEFAULT_PORT
);
var db = new mongodb.Db(
    'sb', mongoServer, { safe: true }
);
db.open(function() {
    console.log( "** Connected to MongoDB **" );
});


routes.configRoutes( app, socket, db );
routes.configIO( socket, db );

server.listen(8000);
console.log(
    'ScoreBored listening on port %d in %s mode',
     server.address().port, app.settings.env
);
