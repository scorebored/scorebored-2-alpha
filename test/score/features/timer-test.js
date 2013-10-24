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

buster.testCase("score.features.timer", {

    app: null,
    clock: null,

    setUp: function() {
        app = score.Game();
        score.features.timer(app);
        clock = sinon.useFakeTimers();
    },

    tearDown: function() {
        clock.restore();
    },

    "Zero on creation": function() {
        refute(app.timer.running);
        assert.equals(app.timer.elapsed(), 0);
    },

    "Elapsed time": function() {
        app.timer.start();
        clock.tick(1000);
        assert(app.timer.running);
        assert.equals(app.timer.elapsed(), 1000);
    },

    "Elapsed holds when stopped": function() {
        app.timer.start();
        clock.tick(1000);
        app.timer.stop();
        clock.tick(500);
        refute(app.timer.running);
        assert.equals(app.timer.elapsed(), 1000);
    },

    "Elapsed resumes after stop": function() {
        app.timer.start();
        clock.tick(1000);
        app.timer.stop();
        clock.tick(500);
        app.timer.start();
        clock.tick(500);
        assert.equals(app.timer.elapsed(), 1500);
    },

    "Elapsed resumes after double stop": function() {
        app.timer.start();
        clock.tick(1000);
        app.timer.stop();
        clock.tick(1000);
        app.timer.start();
        clock.tick(1000);
        app.timer.stop();
        clock.tick(1000);
        app.timer.start();
        clock.tick(1000);
        assert.equals(app.timer.elapsed(), 3000);
    },

    "Reset": function() {
        app.timer.start();
        clock.tick(1000);
        app.timer.reset();
        clock.tick(500);
        assert.equals(app.timer.elapsed(), 500);
    },

    "Event fired on start": function() {
        var listener = this.stub();
        app.events.on("timerStart", listener);
        app.timer.start();
        assert.calledWith(listener, "timerStart");
    },

    "Event fired on stop": function() {
        var listener = this.stub();
        app.timer.start();
        app.events.on("timerStop", listener);
        app.timer.stop();
        assert.calledWith(listener, "timerStop");
    }

});
