/*
 * BCEmissions.ca commute mode graph
 * Carson Lam
 */

var commute_mode_canvas, pie = new Array(), cmc_box, cmc_year_texts, cmc_name_texts, cmc_desc_texts,
sector_names = ['Driving','Other','Taxicab','Motorcycling','Carpool passenger','Public transit system','Walking','Biking'],
sector_names_pt = ['drove','used an alternate form of transportation','rode taxis','rode a motorcycle','carpooled','took public transit','walked','biked'],
provstats = [79,0,0,0,8,10,7,2],
commute_base_radius = 170,
commute_increment_radius = 40;

function commute_mode_chart_initialize(data) {
	commute_mode_canvas = Raphael("commute_mode_canvas");
	var mid_x = 280;
	var mid_y = 580/2-15; // Height of 580 hardcoded because canvas.height doesn't return a correct value in IE.
	var r = commute_mode_canvas;
	var colors = ['#465945', '#4D5D53', '#87A96B', '#50C878', '#00A86B', '#228B22', '#29AB87', '#00A550'];
	cmc_box = $('#commute_mode_box');
	cmc_year_texts = $('#commute_mode_box .commute_mode_year');
	cmc_name_texts = $('#commute_mode_box .commute_mode_name');
	cmc_desc_texts = $('#commute_mode_box .desc');
	
	for(var i=data.length-1; i >= 0; i--) {
		var d = data[i];
		//var df = [d.driver, d.passenger, d.transit, d.walk, d.bike, d.motorcycle, d.taxicab, d.other];
		var df = [d.driver, d.other, d.taxicab, d.motorcycle, d.passenger, d.transit, d.walk, d.bike];
		var p = commute_mode_canvas.g.piechart(mid_x, mid_y, commute_base_radius + i*commute_increment_radius, df, {colors:colors});
		pie.push(p);
		p.hover(
		   function() {
			cmc_box.hide();
			this.sector.stop();
			this.sector.scale(1.1, 1.1, this.cx, this.cy);
			this.sector.attr('stroke-width', 3);
			cmc_year_texts.text(sector_names[this.inx]);
			var parent_inx = (this.r - commute_base_radius) / commute_increment_radius;
			var parent_inx_inv = Math.abs(pie.length-1 - parent_inx);
			var data = commute_modes[parent_inx];
			var gpct = Math.round((this.value / this.total)  * 1000) / 10;
			cmc_name_texts.text(data.year);
			var show_prev_stat = parent_inx_inv != pie.length-1;
			var prevtext = "";
			if(show_prev_stat) {
				//var previous_stat = pie[parent_inx_inv+1].items[0][this.inx].value.value;
				//var pct = Math.round((this.value - previous_stat) / previous_stat * 100,1);
				var prevdata = commute_modes[parent_inx-1];
				var prevvalue = pie[parent_inx_inv+1].items[0][this.inx].value.value;
				var previous_total_commuters = prevdata.total_commuters;
				var delta = this.value - prevvalue;
				var deltapct = Math.round((delta/prevvalue)*1000)/10;
				var delta_dir_verb = delta > 0 ? 'more' : 'fewer';
				var pc2 = delta > 0 ? '+' : '';
				var chgstmt = deltapct > 1000000 ? "This was a new way of commuting in this municipality" : "This was a change of <strong>"+pc2+deltapct+"%</strong>"
				var deltatext = delta != 0 ? "<p><strong>" + numcomma(Math.abs(delta)) + "</strong> " + delta_dir_verb + " people used this mode of transportation compared to "+prevdata.year+". "+chgstmt+".</p>" : "<p>No change from "+prevdata.year+".</p>";
				var pct = Math.round( ((this.value / this.total) - (prevvalue / previous_total_commuters) )* 1000) / 10;
				var psign = pct>0 ? '+' : '';
				var prevtext = deltatext+"<p>After adjusting for population, this was a change of <strong>" + psign + pct + "%</strong> among all commuters.</p>";
			}
			var extra = '';
			if(data.year==2006 && (this.inx == 0 || this.inx > 3)) {
				extra = '<p>In 2006, ' + provstats[this.inx] + '% of commuters in BC ' + sector_names_pt[this.inx] + '.</p>';
			}
			cmc_desc_texts.html("<p>In <strong>" + data.year + "</strong> there were <strong>" + numcomma(data.total_commuters) + "</strong> total commuters.<p><p><strong>" + numcomma(this.value.value) + "</strong> of them " + sector_names_pt[this.inx] + ". They comprised <strong>"+gpct+"%</strong> of the commuting population.</p>" + prevtext + extra);
			cmc_box.fadeIn('slow');
		}, function() {
			this.sector.animate({scale: [1, 1, this.cx, this.cy]}, 500, "bounce");
			this.sector.attr('stroke-width', 1);
		});
	}
}

$(function() {
	if(data_availability_check(commute_modes, 'commute_mode') ) {
		commute_mode_chart_initialize(commute_modes);
		$("#select_commute_mode").change(function(e) {
			var box = $("#commute_mode_moreinfo > div");
			switch($("#select_commute_mode").val()) {
			case "none":
				box.slideUp('fast');
				break;
			default:
				box.slideUp('fast');
				$('#commute_mode_moreinfo_'+$("#select_commute_mode").val()).slideDown('fast');
				$('#commute_mode_moreinfo_extra').slideDown('fast');
				$('#commute_to_field').change();
				break;
			}
		});
		$("#commute_mode_moreinfo > div").hide();
	}
});