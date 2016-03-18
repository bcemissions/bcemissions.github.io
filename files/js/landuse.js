var landuse;
var landuse_labels = ['Population', 'Total area', 'Net area', 'Federal parks', 'Provincial parks', 'Local parks', 'ALR', 'Other'];

function landuse_chart_initialize(data) {
	var fin = function () {
        this.flag = landuse.g.flag(this.attrs.x+this.attrs.width/2, this.attrs.y+this.attrs.height/2, 
        		landuse_labels[this.code]+": "+this.km+"kmsq ("+this.pct+"%)", 5);
        this.attr('stroke-width','1px').attr('stroke','#000');
    },
    fout = function () {
        this.flag.animate({opacity: 0}, 300, function () {this.remove();});
        this.attr('stroke-width','0').attr('stroke','#eee');
    },
    sfin = function () {
        this.flag = landuse.g.flag(this.attrs.x+this.attrs.width/2, this.attrs.y+this.attrs.height/2, 
        		this.text, 5);
        this.attr('stroke-width','1px').attr('stroke','#000');
    },
    extraattrs = function(obj, code, km, total) {
    	obj.code = code;
    	obj.km = Math.round(km*100)/100;
    	obj.total = total;
    	obj.pct = Math.min(Math.round(obj.km / obj.total * 10000,2)/100, 100);
    };
	
	var colors = ['#eee','#F3E5AB', '#F7E98E', '#138808', '#00A86B', '#4CBB17', '#B8860B', '#C2B280'];
	landuse = Raphael("landuse_canvas");
	var scale = 30.0;
	//landuse.text(100,10, "Scale: "+scale+" by "+scale+"px = 1kmsq").attr('font-size','14px');
	for(var i=0; i < data.length; i++) {
		data[i] /= 100.0;
	}
	var padtop = 25;
	var total = data[1];
	var dim = Math.sqrt(total)*scale;
	//var net_dim = Math.ceil(Math.sqrt(data[2]))*scale;
	var net_dim = data[2]/(dim/scale)*scale; // Don't ceil() this...I don't know why I tried in the first place.
	var net_diff_width = dim - net_dim;
	landuse.setSize(899, dim+padtop+10);
	
	var startx = landuse.width/2 - dim / 2;
	var starty = padtop;
	
	var totalrect = landuse.rect(startx, starty, dim, dim);
	totalrect.attr('fill', colors[1]).attr('stroke-width','0').hover(fin,fout);
	extraattrs(totalrect, 1, data[1], data[1]);
	
	var netrect = landuse.rect(startx, starty, net_dim, dim);
	netrect.attr('fill', colors[2]).attr('stroke-width','0').hover(fin,fout);
	extraattrs(netrect, 2, data[2], data[1]);
	
	var samplerect = landuse.rect(startx, starty, scale, scale).attr('stroke','#999');
	samplerect.text = "Scale: "+scale+" by "+scale+"px = 1kmsq";
	samplerect.attr('fill', colors[0]).hover(sfin, fout);
	
	var y = starty;
	var divisor =  net_diff_width/scale;
	var parksarea = data[3] + data[4] + data[5];
	var parksheight = parksarea/(divisor) * scale;
	var x = startx+net_dim;
	for(var i=3; i < 6; i++) {
		var width = data[i]/(parksheight/scale) * scale;
		var rect = landuse.rect(x, y, width, parksheight);
		rect.attr('fill', colors[i]).attr('stroke-width','0').hover(fin,fout);
		extraattrs(rect, i, data[i], data[1]);
		x += width;
	}
	y += parksheight;
	for(var i=6; i < 8; i++) {
		var height = data[i] / divisor * scale;
		var rect = landuse.rect(startx+net_dim, y, net_diff_width, height).hover(fin,fout);
		rect.attr('fill', colors[i]).attr('stroke-width','0');
		extraattrs(rect, i, data[i], data[1]);
		y += height;
	}
}

$(function() {
	landuse_chart_initialize(landuse);
});