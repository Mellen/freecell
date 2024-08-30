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
	    return {
		game,
		cardClass
	    };
	}
	
    }).mount('#app');

