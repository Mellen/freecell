function setCellHeights()
{
     var cells = document.querySelectorAll('.cell');
     var width = cells[0].clientWidth;
     var height = 320/240 * width;
     for(var ci = 0; ci < cells.length; ci++)
     {
	 cells[ci].height = height;
     }
}

window.onresize = setCellHeights;

(function()
 {
     setCellHeights();
     
     var app = angular.module('freecell', ['freecell-deck']);
 })();