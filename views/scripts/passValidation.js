
	var $password = $("#password");
	var $confirmPass = $("#confirm_password");

	//Check the length of the Password
	function checkLength() {
		return $password.val().length > 8;
	}

	//Check to see if the value for pass and confirmPass are the same
	function samePass() {
		return $password.val() === $confirmPass.val();
	}

	//If checkLength() is > 8 then we'll hide the hint
	function PassLength() {
		if (checkLength()) {
			$password.next().hide();
		} else {
			$password.next().show();
		}
	}

	//If samePass returns true, we'll hide the hint
	function PassMatch() {
		if (samePass()) {
			$confirmPass.next().hide();
		} else {
			$confirmPass.next().show();
		}
	}
	function canSubmit() {
		return samePass() && checkLength();
	}
	function enableSubmitButton() {
		$("#submit").prop("disabled", !canSubmit());
	}
	//Calls the enableSubmitButton() function to disable the button
	enableSubmitButton();

	$password.keyup(PassLength).keyup(PassMatch).keyup(enableSubmitButton);
	$confirmPass.focus(PassMatch).keyup(PassMatch).keyup(enableSubmitButton);
	// function CheckPassword(pass, confirmPass) {
	// 	var passw = /^[A-Za-z]\w{7,14}$/;
	// 	if (pass.value.match(confirmPass)) {
	// 		a.
	// 		return true;
	// 	}
	// 	else {
			
	// 		return false;
	// 	}
	// }

