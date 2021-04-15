$(document).ready(function () {
	let iframe = $("<iframe>");
	let searchbutton = $("#youtubesearchbutton");
	let searchinput = $("#youtubesearch");
	let videoIDcode = searchinput.val();
	let main = $("#mainfield");

	// use the id from the JSON search api
	function youtubePlayer() {
		videoIDcode = searchinput.val();
		console.log(videoIDcode);
		let youtubeURL = `https://www.youtube.com/embed/${videoIDcode}`;
		iframe.attr("src", youtubeURL);
		iframe.attr("width", "560");
		iframe.attr("height", "315");
		iframe.attr("frameborder", "0");
		iframe.appendTo(main);
	}

	searchbutton.on("click", youtubePlayer);
});
