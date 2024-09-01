const Game = (function()
 {
     Array.prototype.removeAtRandom = function()
     {
	 return this.splice(Math.floor(Math.random() * this.length), 1)[0];
     };

     var suits = ['s', 'd', 'h', 'c'];
     var numbers = ['a', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'];
     var columnCounts = [7,7,7,7,6,6,6,6];
     
     function Game()
     {
	 this.availableMoves = 0
	 this.table = [[],[],[],[],[],[],[],[]];
	 this.moveHistory = [];
	 this.freecells = ['','','',''];
	 this.home = [[],[],[],[]]
	 let deck = suits.map(function(s)
			      {
				  return numbers.map(function(n)
						     {
							 return s+n;
						     });
			      }).reduce(function(a, b)
					{
					    return a.concat(b);
					});
	     
	 let shuffledDeck = [];

	 while(deck.length > 0)
	 {
	     shuffledDeck.push(deck.removeAtRandom());
	 }

	 let columnIndex = 0;
	 while(shuffledDeck.length > 0)
	 {
	     let card = shuffledDeck.pop();

	     this.table[columnIndex].push(card);

	     columnIndex++;
	     
	     if(columnIndex >= this.table.length)
	     {
		 columnIndex = 0;
	     }
	 }
	 
     }

     Game.prototype.getLargestColumnCount = function()
     {
	 let count = 0;
	 for(let column of this.table)
	 {
	     if(column.length > count)
	     {
		 count = column.length;
	     }
	 }

	 return count;
     };

     Game.prototype.isLastInColumn = function(cardi, rowi)
     {
	 return (this.table[cardi].length - 1 == rowi);
     };
     
     Game.prototype.getRow = function(rowNumber)
     {
	 let result = [];

	 for(let column of this.table)
	 {
	     if(column.length > rowNumber)
	     {
		 result.push(column[rowNumber])
	     }
	     else
	     {
		 result.push('');
	     }
	 }
	 
	 return result;
     };     

     return Game;
     
})();
