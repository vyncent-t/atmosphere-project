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


var redirect_uri = "https://vyncent-t.github.io/atmosphere-project/"; //will redirect to this uri after authorization

//client credentials needed for authorization
var client_id = "50885eb87ce14757bdde10e7fb01f91a"; 
var client_secret = "4acdaecbdc96463bbe8daee8d938550c"; 



const AUTHORIZE = "https://accounts.spotify.com/authorize" //api call url for authorization
const TOKEN = "https://accounts.spotify.com/api/token";    //api call url used to retrieve access token
const PLAYLISTS = "https://api.spotify.com/v1/me/playlists"; //api call url used for playlists


//function onPageLoad(){
    // client_id = localStorage.getItem("client_id");
    // client_secret = localStorage.getItem("client_secret");
    
    //if ( window.location.search.length > 0 ){
        //handleRedirect();
       
        
    //}
   
        //}


//function handleRedirect(){
    //let code = getCode();
    //fetchAccessToken( code );
   
//}

//function getCode(){
    //let code = null;
    //const queryString = window.location.search;
    //if ( queryString.length > 0 ){
       // const urlParams = new URLSearchParams(queryString);
        //code = urlParams.get('code')
   // }
   // return code;
//}

//concatenation of authorization url with our specific credentials, redirect uri and scope of access that we require.
function requestAuthorization(){
    let url = AUTHORIZE;
    url += "?client_id=" + client_id;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url; // Show Spotify's authorization screen
}

//fetch access token
function fetchAccessToken( code ){
    let body = "grant_type=authorization_code";
    body += "&code=" + code; 
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + client_id;
    body += "&client_secret=" + client_secret;
    callAuthorizationApi(body);
}

//refresh access token
function refreshAccessToken(code){
    // refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + client_id;
    callAuthorizationApi(body);
}

//call authorization api 
function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(client_id + ":" + client_secret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}


//after authorization has been granted, parses the response into our data variable and grabs the access/refresh token from the data if successful.
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
        //onPageLoad();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}




//function used to call the various apis needed 
function callApi(method, url, body, callback){
    var xhr = new XMLHttpRequest();
    xhr.open(method,url,true);
    xhr.setRequestHeader('Content-Type','application/json');
    xhr.setRequestHeader('Authorization','Bearer ' +access_token);
    xhr.send(body);
    xhr.onload = callback;
}

//using the above function to call the playlists api.
function refreshPlaylists(){
    callApi( "GET", PLAYLISTS, null, handlePlaylistsResponse );
}

//after the playlists api is called, the response is parsed into our data variable. Then goes through the item tab of the object and adds those playlists to the body. Calls the refresh of the access token if access has ran out.
function handlePlaylistsResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        removeAllItems("playlists");
        data.items.forEach(item => addPlaylist(item));
        
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}


//adds the playlists in the above function
function addPlaylist(item){
    let node = document.createElement("option");
    node.value = item.id;
    node.innerHTML = item.name + " (" + item.tracks.total + ")";
    document.getElementById("playlists").appendChild(node); 
}

//necessary to keep the playlists from being added multiple times.
function removeAllItems(elementId){
    var node = document.getElementById(elementId);
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}
