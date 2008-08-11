var huluSeries = new Array();

function getHuluSeries() {
	var req = new XMLHttpRequest();
	req.open("GET", "http://www.hulu.com/widgets", false);
	req.send();
	if (req.status == 200) {
		var data = req.responseText;

		var start = data.indexOf('<select id="hulu-tv-movies" class="widget-select-box">');
		data = data.substr(start);
		data = data.substr(0, data.indexOf('</select>'));

		var series = data.match(/value="([0-9]+)">([^<]+)<\/option>/gi);

		for (var i=0; i<series.length; i++) {
			data = series[i].match(/value="([0-9]+)">([^<]+)<\/option>/i);
			//debug.trace(data);
			huluSeries[i] = new seriesData(data[1], data[2]);
		}

	}
}

function seriesData(id, name) {
	this.id_ = id;
	this.name_ = name;

	// Cleanup series name - remove HTML
	this.name_ = this.name_.replace("&amp;", "&");
}

seriesData.prototype.getID = function() {
	return this.id_;
};

seriesData.prototype.getName = function() {
	return this.name_;
};