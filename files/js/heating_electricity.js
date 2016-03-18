var he_colors = ['#00a95c','#0070b9','#fcb316','#a6aea4'];

function plot_he(id) {
	$('#'+id+'_canvas').html('');
	var unit = id=='electricity' ? 'kWh' : 'GJ',
	r = Raphael(id+'_canvas'),
	fin = function () {
		if(this.bar.value==0) {
			return;
		}
        this.flag = r.g.flag(this.bar.x, this.bar.y, numcomma(this.bar.value) + 't CO2 emitted').insertAfter(this);
    },
    fout = function () {
    	if(this.bar.value==0) {
			return;
		}
        this.flag.animate({opacity: 0}, 300, function () {this.remove();});
    };
    var dat = he[id];
    if(dat[0][1]==0 && dat[1][1]==0 && dat[2][1]==0 && dat[3][1]==0) {
    	r.text(10, 40, "No significant usage reported.").attr({'text-anchor':'start','font-size':'14px'});
    } else {
    	r.g.hbarchart(0,0,600,83, [ [dat[0][1]], [dat[1][1]], [dat[2][1]], [dat[3][1]] ],
			{colors:he_colors}).hover(fin,fout);
	
		var x = 10;
		var y = 19;
		var attrs = {'text-anchor':'start', 'font-weight':'bold', 'fill':'#eee'};
		var t = r.text(x,y, numcomma(dat[0][0]) +unit);
		t.attr(attrs);
		y += 15;
		t = r.text(x,y, numcomma(dat[1][0]) +unit);
		t.attr(attrs);
		y += 15;
		t = r.text(x,y, numcomma(dat[2][0]) +unit);
		t.attr(attrs);
		if(id=='electricity') {
			y += 15;
			t = r.text(x,y, numcomma(dat[3][0]) +unit);
			t.attr(attrs);
		}
    }
}

$(function() {
	plot_he('electricity');
	plot_he('gas');
	plot_he('wood');
	plot_he('oil');
	plot_he('propane');
});