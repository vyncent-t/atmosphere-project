$(document).ready(function () {
	let searchbutton = $("#youtubesearchbutton");
	let searchinput = $("#youtubesearch");
	let userVisualChoice;
	let clientLoaded = false
    // spotify data logic
let spotify_token = ''

	//replace this with project account key later

	// use the id from the JSON search api
	function youtubePlayer() {
		if (!clientLoaded) {loadClient()}
		else {execute()}
		console.log(userVisualChoice)
	}

		function loadClient() {
			// debugger
			gapi.client.setApiKey("AIzaSyD3zSXnL-OmdY16kUbJdV5Jrik9WI50LPg");
			gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
			.then(function() { console.log("YOUTUBE: GAPI client loaded for API"); execute(); },
			function(err) { console.error("Error loading GAPI client for API", err); });
		}

	function execute() {
		gapi.client.youtube.search.list(
            {"q": `${searchinput.val()} meditation`} )
			.then(function(response) {
				// Handle the results here (response.result has the parsed body).
				// debugger
				console.log("Response", response);
				let youtubeIDCode = response.result.items[0].id.videoId
				console.log(youtubeIDCode)

		let iframe = $("<iframe>");
		let youtubeContent = $("#youtubeContent");
		let youtubeURL = `https://www.youtube.com/embed/${youtubeIDCode}?controls=0&mute=1&showinfo=0&rel=0&autoplay=1&loop=1`;
		youtubeContent.empty()
		iframe.attr("src", youtubeURL);
		iframe.attr("width", "560");
		iframe.attr("height", "315");
		iframe.attr("frameborder", "0");
		iframe.appendTo(youtubeContent);
			},
				function(err) { console.error("Execute error", err); debugger });
			}
	searchbutton.on("click", youtubePlayer);
});

//spotify logic

var redirect_uri = "https://vyncent-t.github.io/atmosphere-project/"; 

var client_id = "50885eb87ce14757bdde10e7fb01f91a"; 
var client_secret = "4acdaecbdc96463bbe8daee8d938550c"; 


const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token";


function onPageLoad(){
   

    if ( window.location.search.length > 0 ){
        handleRedirect();
        $('#authbutton').hide()
    }
        }

function handleRedirect(){
    let code = getCode();
    fetchAccessToken( code );
    window.history.pushState("", "", redirect_uri); 
}

function getCode(){
    let code = null;
    const queryString = window.location.search;
    if ( queryString.length > 0 ){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    return code;
}

//Concatenated urls to retrieve authorization,access and refresh tokens.
function requestAuthorization(){

    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url; // Show Spotify's authorization screen
}

function fetchAccessToken( code ){
    let body = "grant_type=authorization_code";
    body += "&code=" + code; 
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthorizationApi(body);
}

function refreshAccessToken(code){
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthorizationApi(body);
}

//Header for Authorization call
function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}



function handleAuthorizationResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        if ( data.access_token != undefined ){
            spotify_token = data.access_token;
             //localStorage.setItem("access_token", access_token);
        }
        if ( data.refresh_token  != undefined ){
            refresh_token = data.refresh_token;
             //localStorage.setItem("refresh_token", refresh_token);
        }
        onPageLoad();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}


function spotifyAlbumSearch (genre) {
//Object that holds all the spotify IDs for each genre
var genres = {

}

    function getRandomKey(object){
    var objectKeys = Object.keys(object);
    var randomPosition = Math.floor(Math.random()*objectKeys.length);
    return objectKeys[randomPosition];
}

 //debugger
    console.log('Print data from albums');
    genreChoice = genre;
    fetch(`https://api.spotify.com/v1/search?query=${genreChoice}&type=playlist`, {headers: {'Authorization': `Bearer ${spotify_token}`}})
    .then(response => response.json()).then(
        function (data) {
            console.log(data)
    var playlistA = data.playlists.items[0].id
    console.log(`PLAYLIST CODE: ${playlistA}`)

    var playlistB = data.playlists.items[1].id
    console.log(`PLAYLIST CODE: ${playlistB}`)

    var playlistC = data.playlists.items[2].id
    console.log(`PLAYLIST CODE: ${playlistC}`)

    var playlistD = data.playlists.items[3].id
    console.log(`PLAYLIST CODE: ${playlistD}`)

    var playlistCodes = [playlistA,playlistB,playlistC,playlistD]
    console.log(`Playlist codes: ${playlistCodes}`)


    console.log(genres)
    var randomPositionGenre = Math.floor(Math.random()*playlistCodes.length);
    var randomPlaylist = playlistCodes[randomPositionGenre]
    console.log(randomPlaylist)

    // Build url to have iframe embedded
    var songFind = $("<iframe>");
    var spotifyIframe = $("#spotify-frame");
    let songFindAddy = `https://open.spotify.com/embed/playlist/${randomPlaylist}`;

        spotifyIframe.empty();
		songFind.attr("src", songFindAddy);
		songFind.attr("width", "300");
		songFind.attr("height", "380");
		songFind.attr("frameborder", "0");
        songFind.attr("allowtransparency", "true");
        songFind.attr("allow", "encrypted-media");
		songFind.appendTo(spotifyIframe);
	console.log(songFindAddy);
        });
}

//Event listener for the ul genre selections
$("#genre-list").on("click", 'li', function(event){
    console.log(event);
    // Gets the value attribute that was selected
    var choiceValue = event.currentTarget.getAttribute("value");
    console.log(choiceValue);
    spotifyAlbumSearch(choiceValue);
});