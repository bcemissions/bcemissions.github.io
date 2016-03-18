$(function() {
	if(!data_availability_check(trash, 'trash') ) {
		return;
	}
	
	var r = Raphael('trash_canvas');
	var start = [2,2];
	var width = 895;
	var total = trash[0] + trash[1];
	var twidth = width * (trash[0]/total);
	var trect = r.rect(start[0], start[1], twidth, 70);
	trect.attr('fill', '#5b4a40');
	
	var cwidth = width * (trash[1]/total);
	var crect = r.rect(start[0]+twidth, start[1], cwidth, 70);
	crect.attr('fill', 'orange');
});