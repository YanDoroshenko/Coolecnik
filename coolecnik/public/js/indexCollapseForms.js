$('#signin').on('show.bs.collapse', function () {
	if ($('#register').is(":visible")) {
		$("#register").collapse('hide');
	}
	if ($('#anonplay').is(":visible")) {
		$("#anonplay").collapse('hide');
	}
});
$('#register').on('show.bs.collapse', function () {
	if ($('#signin').is(":visible")) {
		$("#signin").collapse('hide');
	}
	if ($('#anonplay').is(":visible")) {
		$("#anonplay").collapse('hide');
	}
});
$('#anonplay').on('show.bs.collapse', function () {
	if ($('#signin').is(":visible")) {
		$("#signin").collapse('hide');
	}
	if ($('#register').is(":visible")) {
		$("#register").collapse('hide');
	}
});