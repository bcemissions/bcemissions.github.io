/*
 * BCEmissions.ca commute distance section.
 * Sorry for the mess. This code grew from guess-and-check.
 * Carson Lam
 */
var inx = 0;
var map, ring0, ring1, ring2, ring3, ring4, ring0cap, ring1cap, ring2cap, ring3cap, ring4cap, focusedRingCap;

function resetRings(ringnum) {
	var off = {fillOpacity:0, fillColor:'#F4C430'};
	var inactive = {fillOpacity:0.5, fillColor:'#ffffff'};

	if(focusedRingCap != null && focusedRingCap.num != ringnum) {
		focusedRingCap.hide();
	}

	// Joining these setoptions with the hides below will mess up the event zindexes??
	ring4.setOptions(off);
	ring3.setOptions(off);
	ring2.setOptions(off);
	ring1.setOptions(off);
	ring0.setOptions(off);
	if(focusedRingCap!=ring4cap) ring4cap.hide();
	if(focusedRingCap!=ring3cap) ring3cap.hide();
	if(focusedRingCap!=ring2cap) ring2cap.hide();
	if(focusedRingCap!=ring1cap) ring1cap.hide();
	if(focusedRingCap!=ring0cap) ring0cap.hide();

	if(ringnum==1) {
		ring0.setOptions(inactive);
	}
	if(ringnum==2) {
		ring0.setOptions(inactive);
		ring1.setOptions(inactive);
	}
	if(ringnum==3) {
		ring0.setOptions(inactive);
		ring1.setOptions(inactive);
		ring2.setOptions(inactive);
	}
	if(ringnum==4) {
		ring0.setOptions(inactive);
		ring1.setOptions(inactive);
		ring2.setOptions(inactive);
		ring3.setOptions(inactive);
	}
}
	  
function commute_distances_initialize(lat, lng) {
    var latlng = new google.maps.LatLng(lat, lng);
    var myOptions = {
      zoom: 11,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scrollwheel: false,
      scaleControl:true,
      navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
    };
    map = new google.maps.Map(document.getElementById("commute_distance_map"), myOptions);
	var commute_ring_options = {
		center: latlng,
		map: map,
		fillOpacity: 0.0,
		fillColor: '#F4C430',
		strokeWeight: 10,
		strokeColor: '#E49B0F',
		strokeOpacity: 1,
		zIndex: 100
	};

	var total_commuters = commute_distances[inx].total_commuters;
	
	// Add to map in reverse order, because events seem to ignore zIndexes...
	commute_ring_options.radius = 50000;
	commute_ring_options.strokeWeight = 0;
	commute_ring_options.zIndex--;
	ring4 = new google.maps.Circle(commute_ring_options);
	ring4cap = new RingCaption(ring4, 4, '25km+', commute_distances[inx].dist_gt25km, total_commuters);
	
	commute_ring_options.strokeWeight = 5;
	commute_ring_options.radius = 25000;
	commute_ring_options.zIndex--;
	ring3 = new google.maps.Circle(commute_ring_options);
	ring3cap = new RingCaption(ring3, 3, '15&ndash;25km', commute_distances[inx].dist_15to25km, total_commuters);
	
	commute_ring_options.radius = 15000;
	commute_ring_options.zIndex--;
	ring2 = new google.maps.Circle(commute_ring_options);
	ring2cap = new RingCaption(ring2, 2, '10&ndash;15km', commute_distances[inx].dist_10to15km, total_commuters);
	
	commute_ring_options.radius = 10000;
	commute_ring_options.zIndex--;
	ring1 = new google.maps.Circle(commute_ring_options);
	ring1cap = new RingCaption(ring1, 1, '5&ndash;10km', commute_distances[inx].dist_5to10km, total_commuters);
	
	commute_ring_options.radius = 5000;
	commute_ring_options.zIndex--;
	ring0 = new google.maps.Circle(commute_ring_options);
	ring0cap = new RingCaption(ring0, 0, '< 5km', commute_distances[inx].dist_lt5km, total_commuters);
	
	google.maps.event.addListener(ring0, 'mouseover', function(evt) {
	    resetRings(0);
		ring0.setOptions({fillOpacity:highlightFillOpacity});
		ring0cap.show();
	});
	google.maps.event.addListener(ring0, 'click', function(evt) {
	    focusedRingCap = ring0cap;
	    resetRings(0);
	    map.setZoom(12);
	    ring0cap.show();
	});
	
	google.maps.event.addListener(ring1, 'mouseover', function(evt) {
		resetRings(1);
		ring1cap.show();
	});
	google.maps.event.addListener(ring1, 'click', function(evt) {
	    focusedRingCap = ring1cap;
	    resetRings(1);
	    map.setZoom(11);
	    ring1cap.show();
	});
	
	google.maps.event.addListener(ring2, 'mouseover', function(evt) {
		resetRings(2);
		ring2cap.show();
	});
	google.maps.event.addListener(ring2, 'click', function(evt) {
	    focusedRingCap = ring2cap;
	    resetRings(2);
	    map.setZoom(10);
	    ring2cap.show();
	});
	
	google.maps.event.addListener(ring3, 'mouseover', function(evt) {
		resetRings(3);
		ring3cap.show();
	});
	google.maps.event.addListener(ring3, 'click', function(evt) {
	    focusedRingCap = ring3cap;
	    resetRings(3);
	    map.setZoom(10);
	    ring3cap.show();
	});
	
	google.maps.event.addListener(ring4, 'mouseover', function(evt) {
		resetRings(4);
		ring4cap.show();
	});
	google.maps.event.addListener(ring4, 'click', function(evt) {
	    focusedRingCap = ring4cap;
	    resetRings(4);
	    map.setZoom(9);
	    ring4cap.show();
	});
	
	google.maps.event.addListener(map, 'mouseout', function(evt) {
		if(focusedRingCap==null) {
	    	resetRings(0);
		} else {
	    	resetRings(focusedRingCap.num);
	    	focusedRingCap.show();
		}
	});
}

var gc_from, gc_to, marker_from, marker_to, pline_straight, pline_straight_dist, pline_path;

function toRad(deg) {
	return deg * (6.28318/360);
}

function commute_geocode_straightline(del) {
	if(pline_straight!=null) {
		pline_straight.setMap(null);
	}
	if(gc_from==null || gc_to==null || del) {
		$('#commute_distance td.button').removeClass('hover').html('');
		return;
	}
	pline_straight = new google.maps.Polyline(
			{map:map, path:[gc_from, gc_to]}		
	);
	// Implementation of Haversine formula stolen from
	// http://www.1stwebdesigner.com/tutorials/distance-finder-google-maps-api/
	var R = 6371;
	var dLat = toRad(gc_to.lat()-gc_from.lat());
	var dLon = toRad(gc_to.lng()-gc_from.lng());
	var dLat1 = toRad(gc_from.lat());
	var dLat2 = toRad(gc_to.lat());
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
	        Math.cos(dLat1) * Math.cos(dLat1) *
	        Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	pline_straight_dist = R * c;
	
	var dist = Math.round(pline_straight_dist*10)/10;
	var f;
	if(dist < 5) {
		f = 'lt5';
	} else if(dist < 10) {
		f = '5to10';
	} else if(dist < 15) {
		f = '10to15';
	} else if(dist < 25) {
		f = '15to25';
	} else {
		f = 'gt25';
	}
	var commute_mode = $('#select_commute_mode').val();
	$('#commute_distance .button').removeClass('hover').html('');
	
	var rounddist = dist*2;
	var es;
	var bits = {'transit':['As a transit user', 8],
			'drive':['As a single driver',293],
			'carpool':['As a carpooler', 43],
			'motorcycle':['As a motorcyclist',119],
			'taxi':['As a taxi rider', 293]};
	switch(commute_mode) {
	case 'none':
		es = 'If you specify your commute mode in the previous section, you can see an approximation of your carbon dioxide emissions.';
		break;
	case 'walk':
	case 'bike':
		es = 'Great! Since you ' + commute_mode + ' to and from work, your carbon emissions are negligible.';
		break;
	default:
		var bit = bits[commute_mode];
		es = bit[0]+', you generate approximately<br/><strong>2 &times; '+dist+'km &times; '+bit[1]+'g/km = ' +
		Math.round(rounddist*bit[1]) + 'g</strong> of carbon dioxide from your daily commute.';
	}
	$('#survey_cd_'+f).addClass('hover').html('<strong>'+dist+'km</strong>');
	var ds = $('#distance_survey_desc');
	ds.hide();
	ds.html(
			'<p>The median commute distance in BC is 6.5km. Your round-trip commute is <strong>over ' + rounddist + 'km</strong> long.'+
			'<p>'+es+'</p>');
	ds.slideDown('fast');
}

function commute_tool_setstatusfield(status, field) {
	var s = status != google.maps.GeocoderStatus.OK;
	if(s) {
		field.html('&#x2718;');
	} else {
		field.html('&#x2714;');
	}
	return s;
}

function commute_geocode_cb_to(gr, gs) {
	if(!commute_tool_setstatusfield(gs, $('#commute_to_field_status'))) {
		gc_to = gr[0].geometry.location;
		if(marker_to != null) {
			marker_to.setMap(null);
		}
		marker_to = new google.maps.Marker({map:map, flat:true, position:gc_to});
		commute_geocode_straightline(false);
	}
}

function commute_geocode_cb_from(gr, gs) {
	if(!commute_tool_setstatusfield(gs, $('#commute_from_field_status'))) {
		gc_from = gr[0].geometry.location;
		if(marker_from != null) {
			marker_from.setMap(null);
		}
		marker_from = new google.maps.Marker({map:map, flat:true, position:gc_from});
		commute_geocode_straightline(false);
	}
}

function commute_geocode(addr_field, type) {
	var geocoder = new google.maps.Geocoder();
	var req = {address:addr_field.val(), language:'en', region:'ca'};
	geocoder.geocode(req, type ? commute_geocode_cb_from : commute_geocode_cb_to);
}

$(function() {
	if(data_availability_check(commute_distances, 'commute_distance') ) {
		commute_distances_initialize(sc[0], sc[1]);
	}
	addDefaultTextEvents('#commute_from_field, #commute_to_field');
	
	$('#commute_from_field').change(function() {
		var obj = $(this);
		if(obj.hasClass('defaultTextActive') || obj.val() == '') {
			if(marker_from!=null) {
				marker_from.setMap(null);
			}
			commute_geocode_straightline(true);
			$('#'+obj.attr('id')+'_status').text('');
			return;
		}
		commute_geocode($(this), true);
	});
	
	$('#commute_to_field').change(function() {
		var obj = $(this);
		if(obj.hasClass('defaultTextActive') || obj.val() == '') {
			if(marker_to!=null) {
				marker_to.setMap(null);
			}
			commute_geocode_straightline(true);
			$('#'+obj.attr('id')+'_status').text('');
			return;
		}
		commute_geocode($(this), false);
	});
});