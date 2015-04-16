(function()
 {
     var app = app.module('freecell-deck', []);

     var suits = ['s', 'd', 'h', 'c'];
     var numbers = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

     app.directive('PlayArea', function()
		   {
		       return {
			   restrict:'E',
			   templateUrl:'chunks/play-area.html',
			   controller: function()
			   {
			       this.initialState = '';
			       this.newGame = function()
			       {
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
				   
			       };
			   },
			   controllerAs:'deck'
		       };
		   });
 })();