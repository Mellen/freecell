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
	 this.selectedFreecell = -1;
	 this.selectedColumn = -1;
	 this.selectedRows = [];
	 this.playerHasWon = false;
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

     Game.prototype.undo = function()
     {
	 if(this.moveHistory.length > 0)
	 {
	     let history = this.moveHistory.pop();
	     this.table = history.table;
	     this.home = history.home;
	     this.freecells = history.freecells;
	     this.playerHasWon = false;
	 }
	 this.selectedRows = [];
	 this.selectedColumn = -1;
	 this.selectedFreecell = -1;
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

     Game.prototype.freecellSelected = function(cellIndex)
     {
	 return cellIndex == this.selectedFreecell;
     };

     Game.prototype.generateHistoryCandidate = function()
     {
	 let history = {
	     table: this.table.reduce((tbl, col) => { tbl.push([...col]); return tbl; }, []),
	     freecells: [...this.freecells],
	     home: this.home.reduce((home, col) => { home.push([...col]); return home; }, [])
	 };
	 return history;
     }
     
     Game.prototype.dropHome = function(cellIndex)
     {
	 let history = this.generateHistoryCandidate();
	 if(this.selectedRows.length == 1 && this.selectedColumn != -1)
	 {
	     const card = this.table[this.selectedColumn][this.selectedRows[0]];
	     const homecard = this.home[cellIndex].at(-1);
	     let dropped = false;
	     if(this.home[cellIndex].length == 0 && card[1] == 'a')
	     {
		 this.home[cellIndex].push(this.table[this.selectedColumn].pop())
		 dropped = true;
	     }
	     else if(this.home[cellIndex].length > 0 &&
		     card[0] == homecard[0] &&
		     (numbers.indexOf(card.substring(1)) - numbers.indexOf(homecard.substring(1))) == 1)
	     {
		 this.home[cellIndex].push(this.table[this.selectedColumn].pop())
		 dropped = true;
	     }

	     if(dropped)
	     {
		 this.moveHistory.push(history);
		 this.checkWin();
	     }
	     
	     this.selectedRows = [];
	     this.selectedColumn = -1;
	 }
	 else if(this.selectedFreecell != -1)
	 {
	     const card = this.freecells[this.selectedFreecell];
	     const homecard = this.home[cellIndex].at(-1);
	     let dropped = false;
	     if(this.home[cellIndex].length == 0 && card[1] == 'a')
	     {
		 this.home[cellIndex].push(card);
		 this.freecells[this.selectedFreecell] = '';
		 dropped = true;
	     }
	     else if(this.home[cellIndex].length > 0 &&
		     card[0] == homecard[0] &&
		     (numbers.indexOf(card.substring(1)) - numbers.indexOf(homecard.substring(1))) == 1)
	     {
		 this.home[cellIndex].push(card);
		 this.freecells[this.selectedFreecell] = '';
		 dropped = true;
	     }

	     if(dropped)
	     {
		 this.moveHistory.push(history);
		 this.checkWin();
	     }
	     
	     this.selectedFreecell = -1;
	 }
     };

     Game.prototype.checkWin = function()
     {
	 let homeCount = this.home[0].length + this.home[1].length + this.home[2].length + this.home[3].length;
	 this.playerHasWon = homeCount == 52;
     }
     
     Game.prototype.selectDropFreecell = function(cellIndex)
     {
	 let history = this.generateHistoryCandidate();
	 if(this.selectedFreecell == cellIndex)
	 {
	     this.selectedFreecell = -1;
	 }
	 else if(this.freecells[cellIndex] == '')
	 {
	     if(this.selectedColumn > -1 && this.selectedRows.length == 1)
	     {
		 this.freecells[cellIndex] = this.table[this.selectedColumn].pop();
		 this.moveHistory.push(history);
		 this.selectedColumn = -1;
		 this.selectedRows = [];
	     }
	 }
	 else
	 {
	     this.selectedFreecell = cellIndex;
	     this.selectedColumn = -1;
	     this.selectedRows = [];
	 }
	 
     };

     Game.prototype.selectDropClear = function(coli, rowi)
     {
	 let history = this.generateHistoryCandidate();
	 if(this.selectedColumn == coli && this.selectedRows.includes(rowi))
	 {
	     this.selectedColumn = -1;
	     this.selectedRows = [];
	 }
	 else if(this.selectedFreecell != -1)
	 {
	     if(this.table[coli].length == 0 ||
		this.isDestinationSuitAndValueValid(this.freecells[this.selectedFreecell], this.table[coli].at(-1)))
	     {
		 this.moveHistory.push(history);
		 this.table[coli].push(this.freecells[this.selectedFreecell]);
		 this.freecells[this.selectedFreecell] = '';
		 this.selectedFreecell = -1;
	     }
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
		 this.moveHistory.push(history);
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
	 if(this.table[coli].length == 0)
	 {
	     if(this.getMaxMovableStackLength(coli) >= this.selectedRows.length)
	     {
		 return true;
	     }
	     else
	     {
		 return false;
	     }
	 }
	 
	 let destcard = this.table[coli].at(-1);
	 let srccard = this.table[this.selectedColumn][this.selectedRows[0]];

	 if(!this.isDestinationSuitAndValueValid(srccard, destcard))
	 {
	     return false;
	 }

	 if(this.selectedRows.length > 1 && this.getMaxMovableStackLength(coli) < this.selectedRows.length)
	 {
	     return false;
	 }

	 return true;
     };

     Game.prototype.isDestinationSuitAndValueValid = function(srcCard, destCard)
     {
 	 let destsuit = destCard[0];
	 let destvalue = destCard.substring(1);

	 let srcsuit = srcCard[0]
	 let srcvalue = srcCard.substring(1);

	 if(suitColours[destsuit] == suitColours[srcsuit])
	 {
	     return false;
	 }

	 if(numbers.indexOf(destvalue) - numbers.indexOf(srcvalue) != 1)
	 {
	     return false;
	 }

	 return true;
     };
     
     Game.prototype.getMaxMovableStackLength = function(coli)
     {
	 const freecellCount = this.freecells.reduce((acc,cell) => cell == '' ? acc+1:acc, 0);
	 let moveableLength = 1 + freecellCount;

	 for(let curColi = 0; curColi < this.table.length; curColi++)
	 {
	     if(curColi == coli)
	     {
		 continue;
	     }

	     if(this.table[curColi].length == 0)
	     {
		 moveableLength += freecellCount;
	     }
	 }
	 
	 return moveableLength;
     };

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
     };

     return Game;
     
})();
