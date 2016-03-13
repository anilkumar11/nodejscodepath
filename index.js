var http = require('http')
var request = require('request')
var fs = require('fs')
var argv=require('yargs').argv

var localhost = '127.0.0.1'
var logfile = argv.logfile? fs.createWriteStream(argv.logfile) : process.stdout
var host  = argv.host || '127.0.0.1' 
var port = argv.port || (host === localhost ? 8000 : 80) 
var scheme = 'http://' 
var destinationUrl = scheme+host+':'+port

//console.log(argv)

var echoServer = http.createServer(function(req, res){
	logfile.write('echoServer')
	for (var header in req.headers){
		res.setHeader(header, req.headers[header])
	}
	logfile.write(JSON.stringify(req.headers))
	req.pipe(res);
})

echoServer.listen(8000)
logfile.write('echoServer listeing @ 127.0.0.1:8000')

var proxyServer = http.createServer(function(req, res){
	logfile.write('proxyServer')
	logfile.write(JSON.stringify(req.headers))

	var url = destinationUrl;
	if(req.headers['x-destination-url']){
		url = 'http://'+req.headers['x-destination-url'] 
	}

	var options = {
		url : url + req.url
	}

	req.pipe(request(options)).pipe(res)
})

proxyServer.listen(9000)
logfile.write('proxyServer listeing @ 127.0.0.1:9000')

