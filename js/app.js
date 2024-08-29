const { createApp, ref } = Vue;

const app = createApp(
    {
	this.setup = function ()
	{
	    const game = new Game()
	    return { game };
	};
    }).mount('#app');



function setCellHeights()
{
    var cells = document.querySelectorAll('.cell');
    if(cells.length > 0)
    {
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
}

window.onresize = setCellHeights;

(function()
 {   

     var observer = new MutationObserver(function(mutations) 
					 {
					     mutations.forEach(function(mutation)
							       {
								   if(mutation.addedNodes.length > 0)
								   {
								       var cell = document.querySelector('.cell');
								       if(cell != null)
								       {
									   mutation.addedNodes[0].width = cell.clientWidth;
									   mutation.addedNodes[0].height = cell.clientHeight;
								       }
								   }
							       });
					 });

     // configuration of the observer:
     var config = { attributes: false, childList: true, subtree: true, characterData: false };

     // pass in the target node, as well as the observer options
     observer.observe(document.body, config);

 })();
