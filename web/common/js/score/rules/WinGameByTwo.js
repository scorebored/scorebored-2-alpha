var score = score || {};
score.rules = score.rules || {};

score.rules.WinGameByTwo = score.rules.WinGameByTwo || function(self, options) {

    options = options || {};
    var when = options.when || "score";

    self.gameOver = false;

    self.isOverTime = function() {
        return !self.gameOver && (self.scores[0] >= self.options.gameLength ||
                                  self.scores[1] >= self.options.gameLength);
    };

    self.isOverTimeNext = function() {
        return !self.gameOver &&
                (self.scores[0] === self.options.gameLength - 1 &&
                 self.scores[1] === self.options.gameLength - 1);
    };

    var isWinner = function(score1, score2) {
        if ( Math.abs(score1 - score2) < 2 ) {
            return;
        }
        return ( score1 >= self.options.gameLength );
    };

    self.isGamePoint = function() {
        return isWinner(self.scores[0] + 1, self.scores[1]) ||
               isWinner(self.scores[1] + 1, self.scores[0]);
    };

    self.events.on(when, function(event, name) {
        if ( self.rollback ) {
            return;
        }
        if ( self.gameOver ) {
            console.error(name, event);
            throw new Error("Game is over");
        }
        var winner = isWinner(self.scores[0], self.scores[1]) ? 0 : null ||
                     isWinner(self.scores[1], self.scores[0]) ? 1 : null;
        if ( !_.isNull(winner) ) {
            self.gameOver = true;
            var winEvent = { player: winner };
            self.events.trigger("gameWin", winEvent);
            self.events.trigger("after gameWin", winEvent);
            self.record("gameWin", winEvent);
        }
    });

    self.events.on("nextGame", function(event) {
        self.gameOver = false;
        self.overTime = false;
    });

    self.events.on("undo gameWin", function(event) {
        self.gameOver = false;
        self.undo();
    });

    return self;
};

