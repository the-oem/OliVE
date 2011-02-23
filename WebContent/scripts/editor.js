/*
 * This is Olive's JavaScript file for editor.jsp only.
 * Dependencies: "/olive/scripts/master.js"
 */

var deleteVideoDialogContext;	// TODO Remove this global variable.
var video; // Global

// Called once the DOM is ready but before the images, etc. load.
// Failsafe jQuery code modified from: http://api.jquery.com/jQuery/#jQuery3
jQuery(function($) {
	attachDeleteVideoHandlers();
	attachVideoMenuHandlers();
	attachVideoClickHandlers();
	attachPlayerHandlers();
	enableDragAndDrop();
	attachContextMenuHandlers();
	getVideoInformation();
});

function attachDeleteVideoHandlers() {
	$('.delete-video').click(function () {
		$('#confirm-delete-video-dialog').dialog('open');
		deleteVideoDialogContext = this;	// This is a global variable.
	});
	
	$('#confirm-delete-video-dialog').dialog({
		autoOpen: false,
		resizable: false,
		height: 275,
		modal: true,
		buttons: {
			'Delete': function () {
				deleteVideo.call(deleteVideoDialogContext);	// We don't want the context to be the dialog element, but rather the element that triggered it.
				$(this).dialog('close');
			},
			Cancel: function () {
				$(this).dialog('close');
			}
		}
	});
}

function attachVideoMenuHandlers() {
	$('#upload-new-button').click(function () {
		openNewVideoForm();
	});
	
	attachSplitHandlers();
	$('#split-button').click(function() {
		$('#split-video-dialog-form').dialog('open');
	});
}

function attachVideoClickHandlers() {
	$('.video-container').click(function () {
		if ($(this).data('isSelected')) {
			console.log('unselecting this');
			unselect(this);
		} else {
			console.log('selecting this');
			// First, unselect all
			$('.video-container').each(function () {
				console.log(this);
				unselect(this);	// 'this' is a different 'this' than outside .each()
			});
			// Then, select this
			select(this);
		}
	});
	
	function select(element) {
		$(element).data('isSelected', true);
		$(element).css( {
			'background-color': '#edf4e6'	// A lighter version of the Olive color
		});
		addToSelected($(element).attr('id'));
		updatePlayerWithNewElement(element);
	}
	
	function unselect(element) {
		$(element).data('isSelected', false);
		$(element).css( {
			'background-color': ''
		});
		removeFromSelected($(element).attr('id'));
		updatePlayerWithNoElements();
	}
}

//Perform an addToSelected request
function addToSelected(id) {
	var videoName = id;	// TODO This works by definition (but the definition should probably change).
	var requestData = '{'
		+    '"command" : "addToSelected",'
		+    '"arguments" : {'
		+        '"video" : "' + videoName + '"'
		+      '}'
		+  '}';
	makeAjaxPostRequest(requestData, null, null);	// Defined in "/olive/scripts/master.js".
}

// Perform a removeFromSelected request
function removeFromSelected(id) {
	var videoName = id;	// TODO This works by definition (but the definition should probably change).
	var requestData = '{'
		+    '"command" : "removeFromSelected",'
		+    '"arguments" : {'
		+        '"video" : "' + videoName + '"'
		+      '}'
		+  '}';
	makeAjaxPostRequest(requestData, null, null);	// Defined in "/olive/scripts/master.js".
}

// Video tag codecs: http://www.webmonkey.com/2010/02/embed_audio_and_video_in_html_5_pages/
// Also: http://stackoverflow.com/questions/2425218/html5-video-tag-in-chrome-wmv
function updatePlayerWithNewElement(element) {
	$('#player-video').attr('type', 'video/mp4');	// TODO Get this from the database.
	$('#player-video').attr('poster', $(element).data('icon'));
	$('#player-video').attr('src', $(element).data('url'));
}

function updatePlayerWithNoElements() {
	$('#player-video').removeAttr('type');
	$('#player-video').removeAttr('poster');
	$('#player-video').removeAttr('src');
}

function attachPlayerHandlers() {
	video = document.getElementById('player-video');

	$('#videos-playpause').click(function () {
		if (video.paused) {
			video.play();
		} else {
			video.pause();
		}
	});
	
	$('#videos-volume-up').click(function () {
		if (video.volume < 0.85) { // Account for rounding errors
			video.volume += 0.1;
		} else {
			video.volume = 1.0; // Don't allow rounding errors
			$('#videos-volume-up').attr('disabled', 'disabled'); // Disable
		}
		$('#videos-volume-down').removeAttr('disabled'); // Enable
	});

	$('#videos-volume-down').click(function () {
		if (video.volume > 0.15) { // Account for rounding errors
			video.volume -= 0.1;
		} else {
			video.volume = 0.0; // Don't allow rounding errors
			$('#videos-volume-down').attr('disabled', 'disabled'); // Disable
		}
		$('#videos-volume-up').removeAttr('disabled'); // Enable
	});
}

function enableDragAndDrop() {
	// Modified from: http://jqueryui.com/demos/draggable/
	$('.video-container').draggable( {
		appendTo : 'body',
		scroll : false,
		connectToSortable : '#timeline',
		helper : 'clone',
		revert : 'invalid',
		snap : '#timeline'
	});
	
	$('#timeline').sortable( {
		revert : true,
		sort: function() {
			if($('#timeline').sortable('items').length > 0){
				$('#export-button').removeAttr('disabled');
			} else {
				$('#export-button').attr('disabled', 'disabled');
			}
		}
	});
}

function attachContextMenuHandlers() {
	$('.video-container').contextMenu('video-context-menu', {
		menuStyle : {
			border : '1px solid #000'
		},
		itemStyle : {
			fontFamily : 'Arial',
			backgroundColor : '#fff',
			color : 'black',
			border : 'none',
			padding : '1px'
		},
		itemHoverStyle : {
			color : '#fff',
			backgroundColor : '#00c',
			border : 'none'
		},
		bindings : {
			'split-video-menu-item' : function (t) {
				$('#split-video-dialog-form').dialog('open');
			}
		}
	});
}

// Perform a deleteVideo request
function deleteVideo() {
	var requestData = '{'
			+    '"command" : "deleteVideo",'
			+    '"arguments" : {'
			+        '"video" : "' + $(this).attr('id') + '"'
			+      '}'
			+  '}';
	makeAjaxPostRequest(requestData, function (responseData) {location.reload();}, null);	// Defined in "/olive/scripts/master.js".
}

//Perform a splitVideo request
function splitVideo(videoName, splitTimeInSeconds) {
	var requestData = '{'
			+    '"command" : "splitVideo",'
			+    '"arguments" : {'
			+        '"video" : "' + videoName + '",'
			+        '"splitTimeInSeconds" : ' + splitTimeInSeconds + ''
			+      '}'
			+  '}';
	makeAjaxPostRequest(requestData, function (responseData) {location.reload(); }, null);	// Defined in "/olive/scripts/master.js".
}

function attachSplitHandlers() {
	var videoName = $('#video-name'), splitTimeInSeconds = $('#split-time-in-seconds'), allFields = $(
			[]).add(videoName).add(splitTimeInSeconds), tips = $('.validateTips');

	function updateTips(t) {
		tips.text(t).addClass("ui-state-highlight");
		setTimeout(function() {
			tips.removeClass("ui-state-highlight", 1500);
		}, 500);
	}

	function checkLength(o, n, min, max) {
		if (o.val().length > max || o.val().length < min) {
			o.addClass("ui-state-error");
			updateTips("Length of " + n + " must be between " + min + " and "
					+ max + ".");
			return false;
		} else {
			return true;
		}
	}

	function checkRegexp(o, regexp, n) {
		if (!(regexp.test(o.val()))) {
			o.addClass("ui-state-error");
			updateTips(n);
			return false;
		} else {
			return true;
		}
	}
	
	function checkCondition(o, condition, n) {
		if (!condition) {
			o.addClass("ui-state-error");
			updateTips(n);
			return false;
		} else {
			return true;
		}
	}
	
	$('#split-video-dialog-form').dialog({
		autoOpen : false,
		height : 400,
		width : 400,
		modal : true,
		buttons : {
			'Split video' : function() {
				var bValid = true;
				allFields.removeClass('ui-state-error');

				bValid = bValid
						&& checkLength(videoName,
								'video-name', 1, 32);
				bValid = bValid
						&& checkLength(splitTimeInSeconds, 'split-time-in-seconds',
								0, 14400);
				bValid = bValid
						&& checkRegexp(videoName,
								/^([0-9a-zA-Z])+$/i,
								'Video name may consist of a-z, 0-9; and must begin with a letter.');
				bValid = bValid
						&& checkCondition(splitTimeInSeconds,
								!isNaN(splitTimeInSeconds.val()),
								'Split time (in seconds) must be a number.')
						&& checkCondition(splitTimeInSeconds,
								splitTimeInSeconds.val() > 0,
								'Split time (in seconds) must be greater than 0.')
						&& checkCondition(splitTimeInSeconds,
								splitTimeInSeconds.val() < 14400,
								'Split time (in seconds) must be less than 14400.');
				if (bValid) {
					splitVideo(videoName.val(), splitTimeInSeconds.val());
					$(this).dialog("close");
				}
			},
			Cancel : function() {
				window.location.reload(true);
				$(this).dialog('close');
			}
		},
		close : function() {
			allFields.val('').removeClass('ui-state-error');
		}
	});
}

function getVideoInformation() {
	var requestData = '{'
		+    '"command" : "getVideoInformation"'
		+  '}';
	makeAjaxPostRequest(requestData, function (responseData) {
		for (var i = 0; i < responseData.length; ++i) {
			$('#' + responseData[i].name).data('url', responseData[i].url);
			$('#' + responseData[i].name).data('icon', responseData[i].icon);
			$('#' + responseData[i].name).data('startTimeStoryboard', responseData[i].startTimeStoryboard);
		}
	}, null);	// Defined in "/olive/scripts/master.js".
}

function openNewVideoForm() {
	window.open("new-video-form.jsp", "videoUploadForm",
			"menubar=no,width=320,height=200,toolbar=no");
}