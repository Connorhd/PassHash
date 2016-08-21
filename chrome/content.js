chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		if (request.loading) {
			if (document.activeElement.tagName == 'INPUT') {
				sendResponse({autofill: true});
			} else {
				sendResponse({autofill: false});
			}
		} else {
			if (document.activeElement.tagName == 'INPUT')
				document.activeElement.value = request.password;

			sendResponse({});
		}
	}
);
