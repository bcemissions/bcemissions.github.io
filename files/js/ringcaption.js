var highlightFillOpacity = 0.6;

function RingCaption(ring, num, label, num_commuters, total_commuters) {

	this.text_ = '<h1>'+label + '</h1><div class="detail">'+numcomma(num_commuters)+' commuters</div>' +
	'<div class="detail" style="font-size:2em;">'+Math.round((num_commuters/total_commuters)*100)+'%</div>';
	this.ring_ = ring;
	this.map_ = map;
	this.num = num;
	
	this.div_ = null;

	this.setMap(map);
}

RingCaption.prototype = new google.maps.OverlayView();

RingCaption.prototype.onAdd = function() {
	var div = document.createElement('DIV');
	div.innerHTML = this.text_;
	div.setAttribute('class', 'range_ring_caption');
	
	this.div_ = div;
	
	var panes = this.getPanes();
	panes.overlayLayer.appendChild(div);
}

RingCaption.prototype.draw = function() {
	var overlayProjection = this.getProjection();
	var bounds = this.ring_.getBounds();
	var sw = overlayProjection.fromLatLngToDivPixel(bounds.getSouthWest());
	var ne = overlayProjection.fromLatLngToDivPixel(bounds.getNorthEast());
	var div = this.div_;
	$(div).hide();
	div.style.left = (5+ne.x)+'px';
	div.style.top = (ne.y-(ne.y-sw.y)/2-50)+'px';
}

RingCaption.prototype.show = function() {
	this.ring_.setOptions({fillOpacity:highlightFillOpacity, fillColor:'#F4C430'});
	//this.div_.style.visibility = 'visible';
	$(this.div_).fadeIn('slow');
}

RingCaption.prototype.hide = function() {
	//this.ring_.setOptions({fillOpacity:0, fillColor:'#F4C430'});
	$(this.div_).fadeOut('fast');
}