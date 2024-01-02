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

$(function() {
    console.log("READY");
    var shoes = score.shoes.Driver();
    window.shoes = shoes;
        
    var resize = function() {
        var windowHeight = $(window).height();
        var navBarHeight = $(".navbar").outerHeight(true);
        var bodyHeight = windowHeight;
        var panelHeight = windowHeight - navBarHeight;
        $("body").height(bodyHeight);
        $(".scores").height(panelHeight);
        
        var nameHeight = panelHeight * .2;
        var scoreHeight = panelHeight - nameHeight;
                
        $(".name").height(nameHeight);
        var nameFontSize = nameHeight * .6;
        $(".name").css("font-size", nameFontSize + "px");
        
        $(".score").height(scoreHeight);
        var scoreFontSize = scoreHeight * .6;
        $(".score").css("font-size", scoreFontSize + "px");
    };
    
    var updateScore = function() {
        $(".score.left").html(shoes.match(0));
        $(".score.right").html(shoes.match(1));    
    };
    
    $(window).resize(resize);
    resize();
    updateScore();
    
    shoes.match.events.on("points", updateScore);
    
    $(document).keyup(function(event) {
        console.log(event.keyCode);
        if ( event.keyCode === 37 ) {
            shoes.match.award({player: shoes.players(0)});
        }
        if ( event.keyCode === 39 ) {
            shoes.match.award({player: shoes.players(1)});
        }
    });

});
