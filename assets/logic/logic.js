$(document).ready(function () {
	let searchbutton = $("#youtubesearchbutton");
	let searchinput = $("#youtubesearch");
	let userVisualChoice;
	let clientLoaded = false

	//replace this with project account key later

	// use the id from the JSON search api
	function youtubePlayer() {
		if (!clientLoaded) {loadClient()}
		else {execute()}
		console.log(userVisualChoice)
	}

	// let youtubeKey = "AIzaSyD3zSXnL-OmdY16kUbJdV5Jrik9WI50LPg"

		function loadClient() {
			debugger
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

// POINT BEFORE THINGS BREAK AGAIN

//spotify logic

var redirect_uri = "https://vyncent-t.github.io/atmosphere-project/"; 

var client_id = "50885eb87ce14757bdde10e7fb01f91a"; 
var client_secret = "4acdaecbdc96463bbe8daee8d938550c"; // In a real app you should not expose your client_secret to the user



const AUTHORIZE = "https://accounts.spotify.com/authorize"
const TOKEN = "https://accounts.spotify.com/api/token";
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists";


function onPageLoad(){
    // client_id = localStorage.getItem("client_id");
    // client_secret = localStorage.getItem("client_secret");

    if ( window.location.search.length > 0 ){
        handleRedirect();
    }
   
        }
    


function handleRedirect(){
    let code = getCode();
    fetchAccessToken( code );
    window.history.pushState("", "", redirect_uri); // remove param from url
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

function requestAuthorization(){
    // client_id.value;
    // client_secret.value;

    // localStorage.setItem("client_id", client_id);
    // localStorage.setItem("client_secret", client_secret); 
	
	// In a real app you should not expose your client_secret to the user

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
    // refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthorizationApi(body);
}

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
        var data = JSON.parse(this.responseText);
        if ( data.access_token != undefined ){
            access_token = data.access_token;
            // localStorage.setItem("access_token", access_token);
        }
        if ( data.refresh_token  != undefined ){
            refresh_token = data.refresh_token;
            // localStorage.setItem("refresh_token", refresh_token);
        }
        onPageLoad();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}





function callApi(method, url, body, callback){
    var xhr = new XMLHttpRequest();
    xhr.open(method,url,true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.setRequestHeader('Authorization','Bearer ' +access_token);
    xhr.send(body);
    xhr.onload = callback;
}

// function refreshPlaylists(){
//     callApi( "GET", PLAYLISTS, null, handlePlaylistsResponse );
// }

function handlePlaylistsResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        removeAllItems("playlists");
        data.items.forEach(item => addPlaylist(item));
        // document.getElementById('playlists').value=currentPlaylist;
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function addPlaylist(item){
    let node = document.createElement("option");
    node.value = item.id;
    node.innerHTML = item.name + " (" + item.tracks.total + ")";
    document.getElementById("playlists").appendChild(node); 
}


function removeAllItems(elementId){
    var node = document.getElementById(elementId);
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

//Time is here
var currentTime=moment();
var now=currentTime.format('MMMM Do YYYY');
$("#time").text(now)
// spotify data logic
function spotifyAlbumSearch () {
    console.log('Print data from albums')
    genreChoice = 'lofi'
    fetch(`https://api.spotify.com/v1/search?query=${genreChoice}&type=playlist`)
    .then(response => response.json()).then(data => console.log(data))
}

let refreshButt = $('#refresh-btn')
refreshButt.on('click',spotifyAlbumSearch)


//Object that holds all the spotify IDs for each genre
var genres = {

    classical: {
        beethoven: "20GYbni2QFEhElzmJDVOLE",
        bocelli: "3uARqNN4bYqts3Ltg5Jku3",
        pavarotti: "4uqcr1BXoigCnQ9POw0YYP",
        mozart: "75GZdd2yVQRz1whnrq4tbK"
    },
    softRock: {
        fleetwoodMac: "0BwWUstDMUbgq2NYONRqlu",
        extreme: "7DKHQxJTI32UyCdDdGwvRC",
        neilDiamond: "6RfgcwsOUlWkGNAd6zjjYd",
        ericCarmen: "02CxAhdSRhzcm6XQ8m5RNp"
    },
    jazzBlues: {
        dukeElling: "5HRYqb7mp810fhgWiUL0uo",
        ellaFitz: "1vvnTmmNWnGmqvVFjVIINf",
        louisArm: "6mmv0gwumlFGWDGJXF4yEv",
        rayCharles: "2HoXseQsMnDKs1sDSB2BfH"
    },
    rhythmAndBlues: {
        laurynHill: "18XFe4CPBgVezXkxZP6rTb",
        boyz2Men: "7JnLsJWNUf50DGZ5JhBgbO",
        aliciaKeys: "6TqRKHLjDu5QZuC8u5Woij",
        mackMorrison: "6plavTFCGXv5vpy0jZVtOV"
    },

    indieElectric: {
        xx: "6Zw6NKh3oIUhDRMOyBmsUU",
        prettyLights: "5E5U9ckjlBvJ3qkNAAqESY",
        wet: "4vTrbwGUedO7SN3DqNOiYU",
        shallou: "4RY8E9iJR1Ec6d3FXqqodJ"
    }


}
function getRandomKey(object){
    var objectKeys = Object.keys(object);
    var randomPosition = Math.floor(Math.random()*objectKeys.length);
    return objectKeys[randomPosition];
}


//Event listener for the ul genre selections
$("#genre-list").on("click", 'li', function(event){
    console.log(event);
    // Gets the value attribute that was selected
    var choiceValue = event.currentTarget.getAttribute("value");
    console.log(choiceValue);

    // Gets random genre choices from object
    var randomClassical = genres.classical[getRandomKey(genres.classical)];

    var randomSoftRock = genres.softRock[getRandomKey(genres.softRock)];

    var randomJazzBlue = genres.jazzBlues[getRandomKey(genres.jazzBlues)];

    var randomRandB = genres.rhythmAndBlues[getRandomKey(genres.rhythmAndBlues)];

    var randomIndieElec = genres.indieElectric[getRandomKey(genres.indieElectric)];

    // Build url to have iframe embedded
    var songFind = $("<iframe>");
    var spotifyIframe = $("#spotify-frame");
    let songFindAddy = "https://open.spotify.com/embed/album/";

        if(choiceValue === "classical"){
            songFindAddy += randomClassical;
        } else if (choiceValue === "soft-rock"){
            songFindAddy += randomSoftRock;
        } else if (choiceValue === "jazz-blues"){
            songFindAddy += randomJazzBlue;
        } else if (choiceValue ==="rhythm-and-blues"){
            songFindAddy += randomRandB;
        } else if (choiceValue === "indie-electronic"){
            songFindAddy += randomIndieElec;
        };

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




//Event listener on ul to grab value of li selected and pick random number
// Use number to select song from genre Array
// Store selected song to add to URL
// Change html content for iframe with new concactonated iframe tag
    //Still left to do:
    // Get the Ids for each song.
    // Be able to get every artist's song by random selection(objects or array?)
    // For loop for the entire list
    // Final check to see if the embedding works
