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
					   card.row = place+1;
					   this.cards[ci].push(card);
					   sdi++;
				       }
				   }
			       };

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
			       }
			   },
			   controllerAs:'board'
		       };
		   }]);

 })();