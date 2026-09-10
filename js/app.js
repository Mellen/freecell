const { createApp, ref, reactive } = Vue;
const { cardBlobURLs } = cardImages;

const wait = new Promise(r => setTimeout(r, 300));

wait.then( v =>
    {
const app = createApp(
    {
	setup()
	{
	    const game = reactive(new Game());
	    function cardClass(cardi, rowi)
	    {
		let cls = ''
		let isLast = game.isLastInColumn(cardi, rowi);
		let columnClass = 'column'+(cardi+1);

		if(isLast)
		{
		    cls = 'last ';
		}

		if(game.selectedColumn == cardi && game.selectedRows.includes(rowi))
		{
		    cls += 'selected ';
		}

		cls += columnClass;

		return cls;
	    }
	    function freecellExtraClasses(cellIndex)
	    {
		return game.freecellSelected(cellIndex) ? 'selected' : '';
	    }
	    function getFreecell(index)
	    {
		if(game.freecells[index] == '')
		{
		    return cardToBlobURL('blank');
		}
		else
		{
		    return cardToBlobURL(game.freecells[index]);
		}
	    }
	    function getHome(index)
	    {
		if(game.home[index].length == 0)
		{
		    return cardToBlobURL('blank');
		}
		else
		{
		    return cardToBlobURL(game.home[index].at(-1));
		}
	    }
	    function newGame()
	    {
		if(confirm('Start a new game?'))
		{
		    location.reload();
		}
	    }

	    function cardToBlobURL(card)
	    {
		if(card in cardBlobURLs)
		{
		    return cardBlobURLs[card];
		}

		return cardBlobURLs['blank'];
	    }
	    
	    function cardToCardName(card)
	    {
		if(card == '' || !card)
		{
		    return 'empty';
		}
		let cardname = '';
		const suit = card[0];
		const value = card.substring(1);

		const suits = {
		    's': 'spades',
		    'h': 'hearts',
		    'd': 'diamonds',
		    'c': 'clubs'
		};

		const values = {
		    'a': 'ace',
		    '2': 'two',
		    '3': 'three',
		    '4': 'four',
		    '5': 'five',
		    '6': 'six',
		    '7': 'seven',
		    '8': 'eight',
		    '9': 'nine',
		    '10': 'ten',
		    'j': 'jack',
		    'q': 'queen',
		    'k': 'king'
		};

		cardname = `${values[value]} of ${suits[suit]}`;
		
		return cardname;
	    }
	    return {
		game,
		cardClass,
		getFreecell,
		getHome,
		freecellExtraClasses,
		newGame,
		cardToCardName,
		cardToBlobURL
	    };
	}
	
    }).mount('#app');

    });
