const { createApp, ref } = Vue;

const app = createApp(
    {
	setup()
	{
	    const game = new Game();
	    return {
		game
	    };
	}
    }).mount('#app');

