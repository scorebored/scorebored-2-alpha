var score = score || {}; 
score.rules = score.rules || {};

score.rules.WinMatchBestOf = score.rules.WinMatchBestOf || function(self) {

    var matchOver = false;
    
    self.events.on("after match", function(event, name) {
        if ( self.rollback ) {
            return;
        }
        if ( matchOver ) {
            throw new Error("Match is over");
        }
        if ( event.value / self.options.matchLength >= .5 ) {
            matchOver = true;
            var winEvent = { player: event.name };
            self.events.trigger("matchWin", winEvent);
            self.events.trigger("after matchWin", winEvent);
            self.record("matchWin", winEvent);
        }
    });
    
    self.events.on("undo matchWin", function(event) {
        matchOver = false;
        self.undo();    
    });
    
    return self;             
};
