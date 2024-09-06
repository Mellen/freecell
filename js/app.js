const { createApp, ref, reactive } = Vue;

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
		    return 'cards/blank.png';
		}
		else
		{
		    return `cards/${game.freecells[index]}.png`;
		}
	    }
	    function getHome(index)
	    {
		if(game.home[index].length == 0)
		{
		    return 'cards/blank.png';
		}
		else
		{
		    return `cards/${game.home[index].at(-1)}.png`;
		}
	    }
	    function newGame()
	    {
		if(confirm('Start a new game?'))
		{
		    location.reload();
		}
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
		cardToCardName
	    };
	}
	
    }).mount('#app');

