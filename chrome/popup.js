var worker = null;
var shouldClose = false;
function getPassWithWorker(master, salt, cb) {
	if (worker != null) {
		worker.terminate();
		worker = null;
	}
	worker = new Worker('worker.js');
	worker.onmessage = function(e) {
		worker.terminate();
		worker = null;
		cb(e.data);
		if (shouldClose) {
			window.close();
		}
	};
	worker.postMessage({master: master, salt: salt, iterations: 1000});
}

var hueWorker = null;
function setHue(master) {
	if (hueWorker != null) {
		hueWorker.terminate();
		hueWorker = null;
	}
	hueWorker = new Worker('worker.js');
	console.log('hi')
	hueWorker.onmessage = function(e) {
		console.log('bye')
		hueWorker.terminate();
		hueWorker = null;
		rotate = e.data.split('').map(function (x) { return x.charCodeAt(0) }).reduce(function (a,b) { return a+b }) % 360;
		$('img').first().css('-webkit-filter', 'hue-rotate('+rotate+'deg)');
	};
	hueWorker.postMessage({master: master, salt: 'hue', iterations: 1});
}

// Page functionality.
function update(e) {
	shouldClose = false;
	if (e && e.keyCode == 13) {
		shouldClose = true;
		if (worker == null) {
			window.close();
		}
		return;
	}
	$('#output').addClass('hide');
	var pass = "";
	if ($('#password').val().length < 3 || $('#salt').val().length < 1) {
		$('#output').text("Enter a master password and site key to generate your password.")
		$('img').first().css('-webkit-filter', 'hue-rotate(0deg)');
	} else {
		setHue($('#password').val())
		getPassWithWorker($('#password').val(), $('#salt').val(), function (pass) {
			chrome.tabs.getSelected(null, function(tab) {
				chrome.tabs.sendRequest(tab.id, {password: pass});
			});
			$('#output').html("Password to use<br /><span>"+pass+"</span><br /><label><input id='show' type='checkbox' /> Show password</label>");
		});
	}
	
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {password: ""});
	});
		
}

chrome.tabs.getSelected(null, function(tab) {
	chrome.tabs.sendRequest(tab.id, {loading: true}, function (res) {
		if (res.autofill) {
			$('#autofill').show();
		}
	});
});

$(function () {
	$('#password').keyup(update);
	$('#salt').keyup(update);
	$('#show').live('change', function () {
		!$('#show').is(':checked') ? $("#output").addClass('hide') : $("#output").removeClass('hide');
	});
	chrome.tabs.getSelected(null, function(tab) {
		// Guess the best URL
		var url = tab.url.split('/');
		var domain = url[2].split('.');
		var salt = "";
		for (i = domain.length - 1; i >= 0; i--) {
			salt = domain[i] + '.' + salt;
			if (domain[i].length > 3 && salt.length > 7) {
				break;
			}
		}
		$('#salt').val(salt.substring(0,salt.length-1));
	});
	update();
	$('#password').focus();
});
