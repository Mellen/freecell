function setCellHeights()
{
    var cells = document.querySelectorAll('.cell');
    var width = cells[0].clientWidth;
    var height = 320/240 * width;
    for(var ci = 0; ci < cells.length; ci++)
    {
	cells[ci].height = height;
    }
    var cards = document.querySelectorAll('img.card');
    for(var ci = 0; ci < cards.length; ci++)
    {
	cards[ci].width = width;
	cards[ci].height = height;
    }
}

window.onresize = setCellHeights;

(function()
 {   
     var app = angular.module('freecell', ['freecell-deck']);
 })();