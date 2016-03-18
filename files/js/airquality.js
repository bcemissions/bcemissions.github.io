var x_axes_o3 = [1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007];
var x_axes_pm = [1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007];

var airquality_o3_canvas;
var airquality_pm_canvas;

var previousPoint = null;

function nullify_zeroes(arr) {
	var has_something = false;
	for(var i=0; i < arr.length; i++) {
		for(var k=0; k < arr[i].data.length; k++) {
			if(arr[i].data[k][1] == 0) {
				arr[i].data[k] = null;
			} else {
				has_something = true;
			}
		}
	}
	return has_something;
}

function drawcenterlabel(canvas, plot, text) {
	var o = plot.pointOffset({ x: -0.5, y: 0.5});
	canvas.append('<div style="position:absolute;left:' + 200 + 'px;top:' + (o.top-18) + 'px;color:#666">'+text+'</div>');
}

function airquality_chart_initialize(o3, pm) {
	airquality_o3_canvas = $("#airquality_o3_canvas");
	airquality_pm_canvas = $("#airquality_pm_canvas");
	var has_o3 = nullify_zeroes(o3);
	var has_pm = nullify_zeroes(pm);
	var plot = $.plot(airquality_o3_canvas, o3, {xaxis:{ticks:x_axes_o3},yaxis:{min:10}, series: {lines: { show: true }, points: { show: true }}, grid: { hoverable: true, clickable: true }, legend:{noColumns:3,container:$('#airquality_legend')} });
	if(!has_o3) {
		drawcenterlabel(airquality_o3_canvas, plot, 'No stations reported ozone readings in this municipality.')
	}
	
	function showTooltip(x, y, contents) {
        $('<div id="tooltip">' + contents + '</div>').css( {
            position: 'absolute',
            display: 'none',
            top: y,
            left: x + 10,
            border: '1px solid #fdd',
            padding: '2px',
            'background-color': '#fee',
            opacity: 0.80
        }).appendTo("body").fadeIn(200);
    }
	
	function hover(event, pos, item) {
        if (item) {
            if (previousPoint != item.datapoint) {
                previousPoint = item.datapoint;
                
                $("#tooltip").remove();
                var x = item.datapoint[0].toFixed(2),
                    y = item.datapoint[1].toFixed(2);
                
                showTooltip(item.pageX, item.pageY, Math.round(x) + ": " + y + " ppb");
            }
        }
        else {
            $("#tooltip").remove();
            previousPoint = null;            
        }
	};
	
	function hover2(event, pos, item) {
        if (item) {
            if (previousPoint != item.datapoint) {
                previousPoint = item.datapoint;
                
                $("#tooltip").remove();
                var x = item.datapoint[0].toFixed(2),
                    y = item.datapoint[1].toFixed(2);
                
                showTooltip(item.pageX, item.pageY, Math.round(x) + ": " + y + " &micro;g/m<sup>3</sup>");
            }
        }
        else {
            $("#tooltip").remove();
            previousPoint = null;            
        }
	};
	
	airquality_o3_canvas.bind("plothover", hover);
	
	var plot = $.plot(airquality_pm_canvas, pm, {xaxis:{min:x_axes_pm[0],ticks:x_axes_pm}, yaxis:{min:0}, series: {lines: { show: true }, points: { show: true }}, grid: { hoverable: true, clickable: true }, legend:{show:false} });
	if(!has_pm) {
		drawcenterlabel(airquality_pm_canvas, plot, 'No stations reported fine particulate matter readings in this municipality.')
	}
	airquality_pm_canvas.bind("plothover", hover2);
}

$(function() {
	if(data_availability_check(airquality_o3, 'airquality') ) {
		airquality_chart_initialize(airquality_o3, airquality_pm);
	}
});