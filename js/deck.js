const Game = (function()
 {
     Array.prototype.removeAtRandom = function()
     {
	 return this.splice(Math.floor(Math.random() * this.length), 1)[0];
     };

     const suits = ['s', 'd', 'h', 'c'];
     const suitColours = {'s': 'black', 'd': 'red', 'h': 'red', 'c': 'black'};
     const numbers = ['a', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k'];
     
     function Game()
     {
	 this.availableMoves = 0
	 this.table = [[],[],[],[],[],[],[],[]];
	 this.moveHistory = [];
	 this.freecells = ['','','',''];
	 this.home = [[],[],[],[]]
	 this.selectedColumn = -1;
	 this.selectedRows = [];
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

     Game.prototype.getCard = function(coli, rowi)
     {
	 let card = '';

	 if(rowi < this.table[coli].length)
	 {
	     card = this.table[coli][rowi];
	 }

	 return card;
     };
     
     Game.prototype.isLastInColumn = function(coli, rowi)
     {
	 return (this.table[coli].length - 1 == rowi);
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

     Game.prototype.selectDropClear = function(coli, rowi)
     {
	 if(this.selectedColumn == coli && this.selectedRows.includes(rowi))
	 {
	     this.selectedColumn = -1;
	     this.selectedRows = [];
	 }
	 else if(this.selectedColumn == coli && !this.selectedRows.includes(rowi)
		 || this.selectedColumn == -1)
	 {
	     if(this.cardCanBeSelected(coli, rowi))
	     {
		 this.selectedColumn = coli;
		 this.selectedRows = [];
		 for(let includedRow = rowi; includedRow < this.table[coli].length; includedRow++)
		 {
		     this.selectedRows.push(includedRow);
		 }
	     }
	     else
	     {
		 this.selectedColumn = -1;
		 this.selectedRows = [];
	     }
	 }
	 else
	 {
	     if(this.selectedRows.length > 0
		&& this.selectedColumn > -1
		&& this.cardsCanBeDropped(coli))
	     {
		 let movingCards = [];
		 while(movingCards.length < this.selectedRows.length)
		 {
		     movingCards.push(this.table[this.selectedColumn].pop());
		 }

		 while(movingCards.length > 0)
		 {
		     this.table[coli].push(movingCards.pop());
		 }
	     }

	     this.selectedColumn = -1;
	     this.selectedRows = [];
	 }
     };

     Game.prototype.cardsCanBeDropped = function(coli)
     {
	 let destsuit = this.table[coli].at(-1)[0];
	 let destvalue = this.table[coli].at(-1).substring(1);

	 let srcsuit = this.table[this.selectedColumn][this.selectedRows[0]][0]
	 let srcvalue = this.table[this.selectedColumn][this.selectedRows[0]].substring(1);

	 if(suitColours[destsuit] == suitColours[srcsuit])
	 {
	     return false;
	 }

	 if(numbers.indexOf(destvalue) - numbers.indexOf(srcvalue) != 1)
	 {
	     return false;
	 }

	 return true;
     }

     Game.prototype.cardCanBeSelected = function(coli, rowi)
     {
	 if(rowi == this.table[coli].length -1)
	 {
	     return true;
	 }
	 else
	 {
	     let suit = this.table[coli][rowi][0];
	     let value = this.table[coli][rowi].substring(1);
	     for(let nextRowi = rowi+1; nextRowi < this.table[coli].length; nextRowi++)
	     {
		 let nextsuit = this.table[coli][nextRowi][0];
		 let nextvalue = this.table[coli][nextRowi].substring(1);

		 if(suitColours[suit] == suitColours[nextsuit])
		 {
		     return false;
		 }

		 if(numbers.indexOf(value) - numbers.indexOf(nextvalue) != 1)
		 {
		     return false
		 }

		 suit = nextsuit;
		 value = nextvalue;
	     }
	     return true;
	 }
     }

     return Game;
     
})();
