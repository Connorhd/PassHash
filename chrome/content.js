var lastFocus = null;
chrome.extension.onRequest.addListener(
	function(request, sender, sendResponse) {
		if (request.loading) {
			lastFocus = document.querySelector('input:focus');
			if (lastFocus != null) {
				sendResponse({autofill: true});
			}
		} else {
			if (lastFocus != null)
				lastFocus.value = request.password;
				
			sendResponse({});
		}
		
	}
);
