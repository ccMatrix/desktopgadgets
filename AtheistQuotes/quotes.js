var quoteList = [];

function Quote( n, q ) {
	this.name = n;
	this.quote = q;
}

function requestQuotes() {
	var quotesData = storage.openText("quotes.csv").split("\n");
	while (quoteList.length > 0) {
		quoteList.pop();
	}
	for (var i=0; i<quotesData.length; i++) {
		var data = quotesData[i].split("|");
		var q = new Quote( data[0], data[1] );
		quoteList.push( q );
	}

	displayQuote();
}
