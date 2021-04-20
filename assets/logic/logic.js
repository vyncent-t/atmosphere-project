$(document).ready(function () {
	let iframe = $("<iframe>");
	let searchbutton = $("#youtubesearchbutton");
	let searchinput = $("#youtubesearch");
	let videoIDcode = searchinput.val();
	let main = $("#ytfield");

	// use the id from the JSON search api
	function youtubePlayer() {
		
		// videoIDcode = searchinput.val();
		// console.log(videoIDcode);

		//need api that takes user input and parses for video ID code

		let youtubeURL = `https://www.youtube.com/embed/${videoIDcode}`;
		iframe.attr("src", youtubeURL);
		iframe.attr("width", "560");
		iframe.attr("height", "315");
		iframe.attr("frameborder", "0");
		iframe.appendTo(main);
	}
	searchbutton.on("click", youtubePlayer);
});



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

function refreshPlaylists(){
    callApi( "GET", PLAYLISTS, null, handlePlaylistsResponse );
}

function handlePlaylistsResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        removeAllItems("playlists");
        data.items.forEach(item => addPlaylist(item));
        document.getElementById('playlists').value=currentPlaylist;
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



//Object that holds all the spotify IDs for each genre
var genres = {

    classical: {
        beethoven: "2wOqMjp9TyABvtHdOSOTUS",
        bocelli: "3EA9hVIzKfFiQI0Kikz2wo",
        pavarotti: "0Y8KmFkKOgJybpVobn1onU",
        mozart: "4NJhFmfw43RLBLjQvxDuRS"
    },
    softRock: {
        fleetwoodMac: "08GQAI4eElDnROBrJRGE0X",
        extreme: "6w7j5wQ5AI5OQYlcM15s2L",
        neilDiamond: "7mEIug7XUlQHikrFxjTWes",
        ericCarmen: "2ekjTXgjxbWwBX5lTAj4DU"
    },
    jazzBlues: {
        dukeElling: "4F7Q5NV6h5TSwCainz8S5A",
        ellaFitz: "5V0MlUE1Bft0mbLlND7FJz",
        louisArm: "19eLuQmk9aCobbVDHc6eek",
        rayCharles: "1eYhYunlNJlDoQhtYBvPsi"
    },
    rhythmAndBlues: {
        laurynHill: "2Mu5NfyYm8n5iTomuKAEHl",
        boyz2Men: "6O74knDqdv3XaWtkII7Xjp",
        aliciaKeys: "3DiDSECUqqY1AuBP8qtaIa",
        mackMorrison: "6V3F8MZrOKdT9fU686ybE9"
    },

    indieElectric: {
        xx: "3iOvXCl6edW5Um0fXEBRXy",
        prettyLights: "4iVhFmG8YCCEHANGeUUS9q",
        wet: "2i9uaNzfUtuApAjEf1omV8",
        shallou: "7C3Cbtr2PkH2l4tOGhtCsk"
    }


}
function getRandomKey(object){
    var objectKeys = Object.keys(object);
    var randomPosition = Math.floor(Math.random()*objectKeys.length);
    return objectKeys[randomPosition];
}


//Event listener for the ul genre selections
$("#genre-list").on("click", function(event){
    console.log(event);
    // Gets the value attribute that was selected
    var choiceValue = event.target.getAttribute("value");
    console.log(choiceValue);

    // Gets random genre choices from object
    var randomClassical = genres.classical[getRandomKey(genres.classical)];

    var randomSoftRock = genres.softRock[getRandomKey(genres.softRock)];

    var randomJazzBlue = genres.jazzBlues[getRandomKey(genres.jazzBlues)];

    var randomRandB = genres.rhythmAndBlues[getRandomKey(genres.rhythmAndBlues)];

    var randomIndieElec = genres.indieElectric[getRandomKey(genres.indieElectric)];

    // Build url to have iframe embedded
    var songFind = $("<iframe>");
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

		songFind.attr("src", songFindAddy);
		songFind.attr("width", "300");
		songFind.attr("height", "380");
		songFind.attr("frameborder", "0");
        songFind.attr("allowtransparency", "true");
        songFind.attr("allow", "encrypted-media");
		songFind.appendTo($("#refresh-btn"));
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