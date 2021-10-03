
const https = require('https');
const fs = require('fs');
const fetch = require('node-fetch');

const ending = "/DASH_420.mp4";
const limit = 3;

const search_url = `https://www.reddit.com/r/Unity2D/top.json?limit=${limit}`;

let response_data = null;

let urls = [];

class URL {
    constructor(url, title) {
        this.url = url;
        this.title = title;
    }
}

function handleData(data) {
    response_data = data;
    // fs.appendFile('data.txt', "" + response_data, function(err) {
    //     if(err) throw err;
    //     console.log("Wrote to data.txt");
    // });
    // fs.appendFile()
    console.log(response_data);

    for(let i = 0; i < response_data.data.children.length; i++) {
        const arr = response_data.data.children[i];
        const url_data = arr.data.url_overridden_by_dest + ending;
        const url = new URL(url_data, arr.data.title + ".mp4");
        urls.push(url);
    }

    downloadUrls();
}

function cb(message) {
    console.log("Logged message: " + message);
}

function downloadUrls() {
    for(let i = 0; i < urls.length; i++) {
        const url = urls[i];
        const file = fs.createWriteStream(url.title);
        const request = https.get(url.url, function(response, erorr) {
        if(erorr) throw erorr;
        response.pipe(file);
        file.on('finish', function() {
            file.close(cb);  // close() is async, call cb after close completes.
        });
        }).on('error', function(err) { // Handle errors
            fs.unlink(url.url); // Delete the file async. (But we don't check the result)
            if (cb) cb(err.message);
        });
    }
}

fetch(search_url).then(response => response.json()).then(data => handleData(data)).catch(error => console.error(error));