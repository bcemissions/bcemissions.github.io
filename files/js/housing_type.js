var housing_type_canvas;

function housing_type_chart_initialize(data) {
	housing_type_canvas = Raphael("housing_type_canvas");
	
	var colors = ['#00b5ef','#58b6e7','#0087cd'],
	fin = function () {
        this.flag = housing_type_canvas.g.popup(this.bar.x, this.bar.y, numcomma(this.bar.value)).insertBefore(this);
    },
    fout = function () {
        this.flag.animate({opacity: 0}, 300, function () {this.remove();});
    };
	var new_data = Array();
	var bottom = housing_type_canvas.height-10;
	for(var i=0; i < data.length; i++) {
		var d = data[i];
		new_data.push([d.single, d.semi, d.row, d.duplex, d.lt5, d.gte5, d.other, d.moveable]);
		var t = housing_type_canvas.text(35+40*i,20, d.year);
		t.attr('fill', colors[i]);
		t.attr('font-size', '16px');
		t.attr('font-weight', 'bold');
	}
	// canvas width and height hardcoded because canvas.height and width don't return correct values in IE.
	housing_type_canvas.g.barchart(10,10,900,400, new_data, {type:'square', colors:colors}).hover(fin,fout);
}

$(function() {
	if(data_availability_check(housing_types, 'housing') ) {
		housing_type_chart_initialize(housing_types);
		$("#housing_type_moreinfo > div").hide();
		$("#select_housing_type").change(function(e) {
			var box = $("#housing_type_moreinfo > div");
			switch($("#select_housing_type").val()) {
			case "none":
				box.slideUp('fast');
				break;
			default:
				box.slideUp('fast');
				$('#housing_type_moreinfo_'+$("#select_housing_type").val()).slideDown('fast');
				$('#housing_type_moreinfo_extra').slideDown('fast');
				break;
			}
		});
	}
});