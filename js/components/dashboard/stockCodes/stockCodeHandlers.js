(function(){
	//
	// functions
	//
	var toggleVisibilityField = function(e) {
		// search for the stockCodeParent div
		var element = e.target.parentElement;
		// the next child of the elemnts
		var littleBro = $(element).next();
		if(e.target.value && littleBro) {
			littleBro.show();
			return;
		}
		// this could be made recursive so we dont care how many sibblings there are
		if(!e.target.value && littleBro) {
			// this is the next input of the current
			var littleBroInput = littleBro.children().last();
			// swap values, and do the same for third sibbling if any
			if(littleBroInput.val()) {
				e.target.value = littleBroInput.val();
				var thirdBrother = littleBro.next();
				// if no other brother just clear the seconds value
				if(thirdBrother) {
					var thirdBrotherInput = thirdBrother.children().last();
					if(thirdBrotherInput.val()) {
						littleBroInput.val(thirdBrotherInput.val());
						thirdBrotherInput.val('');
					}
					else {
						littleBroInput.val('');
						thirdBrother.hide();
					}
				}
				else {
					littleBroInput.val('');
				}
			}
			else
				littleBro.hide();
		}
	};
	
	//
	// events
	//
	window.addEventListener('load', function () {
		$(document.getElementById('inputContainer')).children().each(function(i, stockCodeElement) {
			stockCodeElement.lastElementChild.addEventListener('search', toggleVisibilityField);
			stockCodeElement.lastElementChild.addEventListener('focusout', toggleVisibilityField);
		});
	})
}())
