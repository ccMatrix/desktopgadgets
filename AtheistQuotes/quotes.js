var quoteList = [];

function Quote( n, q ) {
	this.name = n;
	this.quote = q;
}

function requestQuotes() {
	var quotesUrl = "http://www.chrisbeach.co.uk/viewQuotes.php";
	labelQuote.innerText = strLoading;
	labelName.innerText = GADGET_NAME;
	var req = new XMLHttpRequest();
	req.open("GET", quotesUrl, true);
	req.onReadyStateChange = function () {
    if (req.readyState == 4) {
      if (req.status == 200) {
        readQuotes(req.responseText);
      }
      else {
        debug.gadget.error("Error loading page\n");
      }
    }
  };
	req.send(null);
}

function readQuotes(html) {
	var regEx = "<!-- Entry::getAuthorHTML\\(\\) -->([^<]*)</td>\n<td>([^<]*)</td>";
	while (quoteList.length > 0) {
		quoteList.pop();
	}
	var data = false;
	while (true) {
		data = html.match( regEx );
		if (!data) break;
		var q = new Quote( data[1].trim(), data[2].trim() );
		quoteList.push( q );
		html = html.replace( data[0], "" );
	}
	displayQuote();
}