var huluSeries = new Array();

function getHuluSeries() {
	var req = new XMLHttpRequest();
	req.open("GET", "http://r.hulu.com/shows.xml?only=id,name&videos_count_gt=0&type[]=clip&type[]=episode&hide_expired=true&sort=name&items_per_page=500", false);
	req.send();
	if (req.status == 200) {
		var data = req.responseXml;

		var shows = data.getElementsByTagName('show');
    if (shows.length > 0) {
      for (var i = 0; i < shows.length; ++i) {
        var show = shows[i];
        var id = show.childNodes[0].firstChild.nodeValue;
        var name = show.childNodes[1].firstChild.nodeValue;
        huluSeries[i] = new seriesData(id, name);
      }
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