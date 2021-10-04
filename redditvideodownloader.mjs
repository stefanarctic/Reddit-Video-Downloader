
// Imports
import fs from 'fs';
import fetch from 'node-fetch';

// Variables
const ending = "/DASH_420.mp4";
const limit = 3;

const search_url = `https://www.reddit.com/r/Unity2D/top.json?limit=${limit}`;

let response_data = null;

let urls = [];

// URL class to be able to store two variables(url, title) in an object
class URL {
    constructor(url, title) {
        this.url = url;
        this.title = title;
    }
}

// Handles video data from downloadUrls function, creating a file with the name of the post and with it's video's content
function handleVideoData(data, url) {
    fs.appendFile(url.title, data, err => {
        if(err) throw err;
        console.log(`Created file ${url.title}`);
    });
}

// Loops trough all the urls in the urls array, fetches the content of the video and then call handleVideoData
function downloadUrls() {
    try {
        for(let i = 0; i < urls.length; i++) {
            const url = urls[i];
            fetch(url.url).then(res => res.text()).then(data => handleVideoData(data, url));
        }
    } catch(e) {
        console.error(e);
    }
}

// Handle the data that is got from top.json
function handleData(data) {
    response_data = data;
    console.log(response_data); // Just for debugging

    // Loop trough all the reddit posts and adds the title and the link to the video to an array called urls
    for(let i = 0; i < response_data.data.children.length; i++) {
        const arr = response_data.data.children[i];
        const url_data = arr.data.url_overridden_by_dest + ending;
        const url = new URL(url_data, arr.data.title + ".mp4");
        urls.push(url);
    }

    // Once that is done, call downloadUrls function
    downloadUrls();
}

// Fetch the top.json website and call handledata to handle the data
fetch(search_url).then(response => response.json()).then(data => handleData(data)).catch(error => console.error(error));