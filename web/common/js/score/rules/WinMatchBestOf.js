var score = score || {}; 
score.rules = score.rules || {};

score.rules.WinMatchBestOf = score.rules.WinMatchBestOf || function(self) {

    self.matchOver = false;
    
    var isWinner = function(score) {
        return ( score / self.options.matchLength >= .5 ) ;
    };
    
    self.isMatchPoint = function() {
        return ( isWinner(self.match[0] + 1) || isWinner(self.match[1] + 1) );
    };
    
    self.events.on("match", function(event, name) {
        if ( self.rollback ) {
            return;
        }
        if ( self.matchOver ) {
            throw new Error("Match is over");
        }
        if ( isWinner(event.value) ) {
            self.matchOver = true;
            var winEvent = { player: event.name };
            self.events.trigger("matchWin", winEvent);
            self.events.trigger("after matchWin", winEvent);
            self.record("matchWin", winEvent);
        }
    });
    
    self.events.on("undo matchWin", function(event) {
        self.matchOver = false;
        self.undo();    
    });
    
    return self;             
};
