/*
 * BCEmissions.ca general JS tools
 * Carson Lam
 */
function numcomma(x) {
  var _x=x.toString();
  var _len=_x.length;
  var _ret="";
  for(var i=_len;i>0;i--)
  {
	if(!((_len-i)%3))
	{
	  _ret=","+_ret;
	}
	_ret=_x[i-1]+_ret;
  }
  _ret=_ret.substr(0,_ret.length-1);
  return _ret;
}

function data_availability_check(data, id) {
	if(data.length>0 && data[0] != 0) {
		return true;
	} else {
		$('#'+id+' .available').hide();
		$('#'+id+' .unavailable').show();
	}
	return false;
}

function addDefaultTextEvents(selector) {
	$(selector).focus(function(srcc)
	{
		if ($(this).val() == $(this)[0].title)
		{
			$(this).removeClass("defaultTextActive");
			$(this).val("");
		}
	});
			
	$(selector).blur(function()
	{
		// FF considers the default text to actually be there?
		if ($(this).val() == "" || $(this).val() == $(this)[0].title)
		{
			$(this).addClass("defaultTextActive");
			$(this).val($(this)[0].title);
		}
	});
	
	$(selector).blur(); 
}

function showTooltip(x, y, contents) {
	$('<div id="tooltip">' + contents + '</div>').css( {
		position: 'absolute',
		display: 'none',
		top: y + 5,
		left: x + 5,
		border: '1px solid #fdd',
		padding: '2px',
		'background-color': '#fee',
		opacity: 0.80
	}).appendTo("body").fadeIn(200);
}

$(function() {
	if($.browser.msie && $.browser.version < 8.0) {
		$('#ie_warning').show();
	}
	$('.footnotes, .infobox').hide();
	var fbars = $('.footnotes_bar, .footnotes_bar2');
	fbars.hover(function() { $(this).addClass('hover');}, function(){$(this).removeClass('hover');});
	fbars.click(function() {
		var t = $(this);
		t.toggleClass('clicked');
		t.next().slideToggle();
	});
});