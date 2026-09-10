var cardImages = (function (exports) {
    'use strict';

    const width = 240;
    const height = 320;
    
    let cardBlobURLs = {}; 

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const cardContext = canvas.getContext('2d');

    cardContext.fillStyle = 'transparent';
    cardContext.fillRect(0, 0, width, height);
    canvas.toBlob(blob => cardBlobURLs['blank'] = URL.createObjectURL(blob));
		  
    cardContext.fillStyle = 'white';
    cardContext.fillRect(0, 0, width, height);
    const background = cardContext.getImageData(0, 0, width, height);

    const suits = [{colour:'black', character:'\u2660', letter:'s'}, {colour:'black', character:'\u2663', letter:'c'},
		   {colour:'red', character:'\u2665', letter:'h'}, {colour:'red', character:'\u2666', letter:'d'}];
    const values = ['a','2','3','4','5','6','7','8','9','10','j','q','k'];
    
    for(const suit of suits)
    {
	for(const value of values)
	{
	    cardContext.putImageData(background, 0, 0);
	    cardContext.fillStyle = suit.colour;
	    const cornerFontHeight = 32;
	    const margin = 5;
	    cardContext.font = `${cornerFontHeight}px "sans serif"`;
	    const cornerValueWidth = cardContext.measureText(value.toUpperCase()+suit.character).width;
	    cardContext.fillText(value.toUpperCase()+suit.character, margin, cornerFontHeight+margin);
	    cardContext.fillText(value.toUpperCase()+suit.character, width-cornerValueWidth-margin, cornerFontHeight+margin);
	    cardContext.fillText(value.toUpperCase()+suit.character, margin, height-margin*2);
	    cardContext.fillText(value.toUpperCase()+suit.character, width-cornerValueWidth-margin, height-margin*2);
	    const fontHeight = 120;
	    cardContext.font = `${fontHeight}px "sans serif"`;
	    const valueWidth = cardContext.measureText(value.toUpperCase()).width;
	    cardContext.fillText(value.toUpperCase(), width/2 - valueWidth/2, height/3 + fontHeight/3);
	    const suitWidth = cardContext.measureText(suit.character).width;
	    cardContext.fillText(suit.character, width/2 - suitWidth/2, 2*height/3 + fontHeight/3);

	    canvas.toBlob(blob => cardBlobURLs[suit.letter+value] = URL.createObjectURL(blob));
	}
    }
    
    exports.cardBlobURLs = cardBlobURLs;

    return exports;
})({});
