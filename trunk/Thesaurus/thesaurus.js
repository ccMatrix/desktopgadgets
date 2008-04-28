/* Constants for supported languages */
var LANG_GERMAN = "de";
var LANG_DUTCH = "nl";
var LANG_SPANISH = "es";
var LANG_SLOVENIAN = "si";
var LANG_SLOVAKIAN = "sk";
var LANG_ENGLISH = "us";

/* List of supported and implemented languages */
var LANG_SUPPORTED = new Array(LANG_ENGLISH, LANG_GERMAN, LANG_DUTCH, LANG_SPANISH);

/* Error codes */
var ERROR_NOTFOUND = "1";
var ERROR_WEBSITE = "2";

/* 
 * Thesaurus class constructor. Initializes attributes and sets languages
 */
function Thesaurus(lang) {
	this.language = lang;
	this.lookupReg = null;
	this.callback = null;
}

/*
 * Lookup word in the current language
 * lookupUrl will be set based on the language
 * regular expression is set based on the language/query page
 * asynchronous request will call callback function when done
 */
Thesaurus.prototype.lookup = function(word) {
	var lookupUrl = "";
	var req = new XMLHttpRequest();

	// Set attributes based on language
	switch (this.language) {
		case LANG_GERMAN:
			lookupUrl = "http://www.openthesaurus.de/overview.php?word=%s";
			this.lookupReg = new RegExp("<li class=\"synsetlist\">([^\n]*)");
			break;
		case LANG_DUTCH:
			lookupUrl = "http://www.opentaal.org/opentaalbank/thesaurus/multimatch.php?word=%s";
			this.lookupReg = new RegExp("<li>([^\r\n]*)", "gi");
			break;
		case LANG_SPANISH:
			lookupUrl = "http://openthes-es.berlios.de/multimatch.php?word=%s";
			this.lookupReg = new RegExp("\t<a accesskey=[^>]*>([^\r\n]*)", "gi");
			break;
		case LANG_SLOVENIAN:
			lookupUrl = "http://193.2.66.133:85/overview.php?search=1&word=%s";
			this.lookupReg = new RegExp("<li class=\"synsetlist\">([^\n]*)");
			break;
		case LANG_SLOVAKIAN:
			lookupUrl = "http://kobalt.jurajbednar.com/~zdpo/thesaurus/multimatch.php?word=%s";
			this.lookupReg = new RegExp("<li>([^\r\n]*)", "gi");
			break;
		case LANG_ENGLISH:
			lookupUrl = "http://www.googledesktopgadgets.com/scripts/aiksaurus.php?lookup=%s";
			this.lookupReg = new RegExp("([^$]*)", "gi");
			break;
	}
	// Call lookup URL with parameter
	lookupUrl = lookupUrl.replace("%s", escape(word));
	req.open("GET", lookupUrl, true);
	var thesaurus = this;
	// Readystatechange will be fired when call is returned
	// Parses returned page using regular expressions set for current language
	req.onreadystatechange = function () {
			if (req.readyState == 4) {
				if (req.status == 200) {
					var data = req.responseText;
					var result = "";
					var match = thesaurus.lookupReg.exec(data);
					if (!match) {
						thesaurus.callback(ERROR_NOTFOUND);
						return;
					}
					
					while (match) {
						data = data.replace(match[0], "");
						match = match[1];
						match = match.replace(/(<)([^>]*)(>)/gi, "");
						result = result + match + "\n\n";
						if (data.length == 0) break;
						match = thesaurus.lookupReg.exec(data);
					}
					result.trim()+"\n";
					thesaurus.callback(result);
				}
				else {
					thesaurus.callback(ERROR_WEBSITE);
				}
			}
		};
	req.send();
}