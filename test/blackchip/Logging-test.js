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

buster.testCase("blackchip.Logging", {
        
    setUp: function() {
        this.stub(console, "error");
        this.stub(console, "warn");
        this.stub(console, "info");
        this.stub(console, "log");
        blackchip.Console.reload();
    },
    
    tearDown: function() {
        blackchip.Console.reload();
    },
    
    "Same names are same instance": function() {
        var log1 = blackchip.Logging.get("test-foo");
        var log2 = blackchip.Logging.get("test-foo");
        assert.equals(log1, log2);
    },
    
    "Different names are different instance": function() {
        var log1 = blackchip.Logging.get("test-log1");
        var log2 = blackchip.Logging.get("test-log2");
        refute.equals(log1, log2);
    },
    
    "Disabled by default": function() {
        var log = blackchip.Logging.get("test1");
        
        log.error("error");
        log.warn("warn");
        log.info("info");
        log.log("log");
        log.debug("debug");
        log.trace("trace");
        
        refute.called(console.error);
        refute.called(console.warn);
        refute.called(console.info);
        refute.called(console.log);
    },
    
    "Enabled logger is active": function() {
        var log = blackchip.Logging.get("test2");
        blackchip.Logging.enable("test2");
        
        log.error("error");
        log.warn("warn");
        log.info("info");
        log.log("log");
        
        assert.calledOnce(console.error);
        assert.calledOnce(console.warn);
        assert.calledOnce(console.info);
        assert.calledOnce(console.log);       
    },

    "Debug/trace silent when enabled": function() {
        var log = blackchip.Logging.get("test3");
        blackchip.Logging.enable("test3");
        
        log.debug("debug");
        log.trace("trace");

        refute.called(console.log);      
    },
    
    "Debug logging when enabled": function() {
        var log = blackchip.Logging.get("test4");
        blackchip.Logging.debug("test4");
        
        log.error("error");
        log.warn("warn");
        log.info("info");
        log.log("log");
        log.debug("debug");
        log.trace("trace");
        
        assert.calledOnce(console.error);
        assert.calledOnce(console.warn);
        assert.calledOnce(console.info);
        assert.calledTwice(console.log); 
    },
    
    "Trace logging when enabled": function() {
        var log = blackchip.Logging.get("test5");
        blackchip.Logging.trace("test5");
        
        log.error("error");
        log.warn("warn");
        log.info("info");
        log.log("log");
        log.debug("debug");
        log.trace("trace");
        
        assert.calledOnce(console.error);
        assert.calledOnce(console.warn);
        assert.calledOnce(console.info);
        assert.calledThrice(console.log); 
    }
});