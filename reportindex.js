var reset = false;

function fail(why) {
	if(typeof why !== 'string') {
		why = "Unknown error";
	}
	$(".concl").html("<strong><span style=\"color:#FF0000;\">Failure</span>: " + why + "</strong>");
	$(".loading").fadeOut("fast", function() {
		$(".concl").fadeIn("fast");
	});
}

function success(who, usesleft, what) {
	var success_string = "";
	if(what == true) {
		success_string += "<strong>Report Submissions <span style=\"color:#008000;\">Succeeded</span>!</strong><br />";
	} else {
		success_string += "<strong>Report Submissions <span style=\"color:#ff0000;\">Failed</span>!</strong><br /><small>You were not charged.</small><br />";
	}
	
	success_string += "<strong>Key Owner</strong>: ";
	success_string += who + "<br />";
	success_string += "<strong>Key Uses Remaining</strong>: ";
	success_string += usesleft + "<br />";
	
	$("#steam64").val('');
	//$("#match").val('');
	
	$(".concl").html(success_string);
	$(".loading").fadeOut("fast", function() {
		$(".concl").fadeIn("fast");
	});
}

function understandApiRequest(data) {
	if(data["error"]) {
		error = "";
		switch(data["error"]) {
			case 1:
			case 2:
			case 3:
				error = "Invalid parameters";
			break;
			case 4:
				error = "Internal server error";
			break;
			case 5:
				error = "Reportbot key invalid";
			break;
			case 6:
				error = "Could not calculate usage";
			break;
			case 7:
				error = "Reportbot key use limit exceeded";
			break;
			case 8:
				error = "Failed to retrieve key information";
			break;
			case 9:
				error = "Reports succeeded, key error";
			break;
			case 1000:
				error = "Steam is whitelisted";
			break;
			default:
				error = "Unknown error";
			break;
		}
		fail(error);
	} else if(data["status"]) {
		success(data["username"], data["uses_left"], data["status"]);
	} else {
		fail("Unknown error");
	}
}

function sendApiRequest() {
	$.post("/api", {
		key: $("#key").val(),
		steam64: $("#steam64").val(),
		match: $("#match").val()
	}, null, "json")
		.done(understandApiRequest)
		.fail(fail);
}

function ban() {
	if(reset) {
		$(".concl").hide();
	}
	reset = true;
	$(".default").fadeOut("fast", function() {
		$(".loading").fadeIn("fast", function() {
			sendApiRequest();
		});
	});
	
}