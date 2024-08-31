const { createApp, ref, reactive } = Vue;

const app = createApp(
    {
	setup()
	{
	    const game = reactive(new Game());
	    function cardClass(card, rowi)
	    {
		let cls = ''
		let isLast = game.isLastInColumn(card, rowi);
		let columnClass = 'column'+(game.getColumnIndex(card, rowi)+1);

		if(isLast)
		{
		    cls = 'last ';
		}

		cls += columnClass;

		return cls;
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
	    return {
		game,
		cardClass,
		getFreecell,
		getHome
	    };
	}
	
    }).mount('#app');

