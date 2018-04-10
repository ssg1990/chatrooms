var http = require('http');
var fs = require('fs');
var patc = require('path');
var mime = require('mime');
var cache = {};

var server = http.createServer(function(req, res){
    var filePath = false;
    if (req.url == '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + req.url;
    }
    var absPath = './' + filePath;
    serveStatic(res, cache, absPath);
})

function send404(res){
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('Error 404: resource not found');
    res.end();
}

function sendFile(response, filepath, fileContents) {
    response.writeHead(200, {'Content-Type': mime.lookup(path.basename(filepath))})
    response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
    if (cache[absPath]){
        sendFile(response, absPath, cache(absPath));
    } else {
        fs.exists(absPath, function(exists){
            if(exists){
                fs.readFile(absPath, function(err, data) {
                    if(err){
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absFile, data)
                    }
                })
            } else {
                send404(response);
            }
        })
    }
}

server.listen(3000, function(){
    console.log("Server listening on port 3000");
})