(function()
 {
     Array.prototype.removeAtRandom = function()
     {
	 return this.splice(Math.floor(Math.random() * this.length), 1)[0];
     };

     var app = angular.module('freecell-deck', []);

     var suits = ['s', 'd', 'h', 'c'];
     var numbers = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
     var columnCounts = [7,7,7,7,6,6,6,6];

     app.directive('playArea', [ '$log', function($log)
		   {
		       return {
			   restrict:'E',
			   templateUrl:'chunks/play-area.html',
			   controller: function()
			   {
			       setCellHeights();

			       this.newGame = function()
			       {
				   this.cardToDrag = null;

				   this.initialState = '';
				   this.history = [];
				   this.cards = [[],[],[],[],[],[],[],[]];
				   var deck = suits.map(function(s)
							{
							    return numbers.map(function(n)
									       {
										   return s+n;
									       });
							}).reduce(function(a, b)
								  {
								      return a.concat(b);
								  });
				   
				   var shuffledDeck = [];

				   while(deck.length > 0)
				   {
				       shuffledDeck.push(deck.removeAtRandom());
				   }

				   this.initialState = shuffledDeck.join(',');
				   this.history.push(this.initialState);
				   var sdi = 0;
				   for(var ci = 0; ci < this.cards.length; ci++)
				   {
				       for(var place = 0; place < columnCounts[ci]; place++)
				       {
					   var card = this.createCard(shuffledDeck[sdi]);
					   card.column = ci;
					   card.row = place;
					   this.cards[ci].push(card);
					   sdi++;
				       }
				   }
			       };

			       this.createXRanges = function()
			       {
				   this.cellXRanges = {};

				   var cells = document.querySelectorAll('.cell,.card-column');
				   for(var cellIndex = 0; cellIndex < cells.length; cellIndex++)
				   {
				       var cell = cells[cellIndex];
				       for(var xRangePos = cell.offsetLeft; xRangePos < cell.offsetLeft + cell.offsetWidth; xRangePos++)
				       {
					   if(this.cellXRanges[xRangePos])
					   {
					       this.cellXRanges[xRangePos].push(cell);
					   }
					   else
					   {
					       this.cellXRanges[xRangePos] = [cell];
					   }
				       }
				   }
			       }

			       this.createCard = function(card)
			       {
				   var newCard = {imgURL:'cards/'+card.toLowerCase()+'.png'};

				   var suitLetter = card.slice(0,1);
				   var value = card.slice(1);

				   switch(suitLetter)
				   {
				   case 'h':
				       newCard.suit = 'hearts';
				       newCard.colour = 'red';
				       break;
				   case 'c':
				       newCard.suit = 'clubs';
				       newCard.colour = 'black';
				       break;
				   case 'd':
				       newCard.suit = 'diamonds';
				       newCard.colour = 'red';
				       break;
				   case 's':
				       newCard.suit = 'spades';
				       newCard.colour = 'black';
				       break;
				   default:
				       newCard.suit = 'error';
				       newCard.colour = 'error';
				   }

				   if(Number.isNaN(Number.parseInt(value)))
				   {
				       switch(value)
				       {
				       case 'A':
					   newCard.value = 1;
					   break;
				       case 'J':
					   newCard.value = 11;
					   break;
				       case 'Q':
					   newCard.value = 12;
					   break;
				       case 'K':
					   newCard.value = 13;
					   break;
				       default:
					   newCard.value = -1;
				       }
				   }
				   else
				   {
				       newCard.value = Number.parseInt(value);
				   }

				   return newCard;
			       };

			       var xOff = 0, yOff = 0;
			       var floatingDiv = document.getElementById('floatingCards');

			       this.selectCard = function(column, row, $event)
			       {
				   $event.preventDefault();
				   this.cardToDrag = null;
				   if(row == (this.cards[column].length - 1))
				   {
				       this.cardToDrag = $event.target;
				       xOff = this.cardToDrag.x - $event.pageX;
				       yOff = this.cardToDrag.y - $event.pageY;
				       var x = $event.pageX + xOff;
				       var y = $event.pageY + yOff;
				       this.cardToDrag.originalParent = this.cardToDrag.parentElement;
				       floatingDiv.appendChild(this.cardToDrag.parentElement.removeChild(this.cardToDrag));
				       floatingDiv.style='top:'+y+'px;left:'+x+'px';
				   }
			       };

			       this.moveCard = function($event)
			       {
				   $event.preventDefault();
				   if(this.cardToDrag)
				   {
				       var x = $event.pageX + xOff;
				       var y = $event.pageY + yOff;
				       floatingDiv.style='top:'+y+'px;left:'+x+'px';
				   }
			       };

			       this.dropCard = function($event)
			       {
				   $event.preventDefault();
				   if(this.cardToDrag !== null)
				   {
				       if(this.canPlaceSelection($event.pageX, $event.pageY))
					  {
					      
					  }
					  else
					  {
					      this.cardToDrag.originalParent.appendChild(floatingDiv.removeChild(this.cardToDrag));
					      this.cardToDrag = null;
					  }
				   }
			       };

			       this.canPlaceSelection = function(x, y)
			       {
				   if(!this.cellXRanges)
				   {
				       this.createXRanges();
				   }

				   var cells = this.cellXRanges[x];
				   var pickedCell = cells[0];
				   if(cells.length > 1)
				   {				       
				       for(var cellIndex = 0; cellIndex < cells.length; cellIndex++)
				       {
					   var cell = cells[cellIndex];
					   if(y > pickedCell.offsetParent.offsetTop && y > cell.offsetParent.offsetTop)
					   {
					       pickedCell = cell;
					   }
				       }
				   }
				   return false;
			       };
			   },
			   controllerAs:'board'
		       };
		   }]);

 })();