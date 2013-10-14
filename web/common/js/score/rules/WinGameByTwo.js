var score = score || {}; 
score.rules = score.rules || {};

score.rules.WinGameByTwo = score.rules.WinGameByTwo || function(self) {

    var gameOver = false;
    
    self.events.on("after score", function(event) {
        if ( self.rollback ) {
            return;
        }
        if ( gameOver ) {
            throw new Error("Game is over");
        }
        var props = event.properties;
        if ( Math.abs(props[0] - props[1]) < 2 ) {
            return;
        }
        if ( event.value >= self.options.gameLength ) {
            gameOver = true;
            var winEvent = { player: event.name };
            self.events.trigger("gameWin", winEvent);
            self.events.trigger("after gameWin", winEvent);
            self.record("gameWin", winEvent);             
        } 
    });
    
    self.events.on("before nextGame", function(event) {
        gameOver = false;
    });
    
    self.events.on("undo gameWin", function(event) {
        gameOver = false;
        self.undo();
    });
    
    return self;             
};

