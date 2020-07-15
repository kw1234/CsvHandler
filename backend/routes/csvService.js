var multer = require('multer');
const fs = require('fs');
const homedir = require('os').homedir();
var formidable = require('formidable');
const csv = require('fast-csv');
const path = require("path");
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});


s3 = new AWS.S3({apiVersion: '2006-03-01'});

s3.listBuckets(function(err, data) {
	if (err) {
	    console.log("Error", err);
	} else {
	    console.log("Success", data.Buckets);
	}
    });

var params = {
    Bucket: "csv-file"
};
var allKeys = [];
s3.listObjects(params, function(err, data) {
	if (err) console.log(err, err.stack); // an error occurred
	else     console.log(data.Contents);
        data.Contents.forEach(elem => allKeys.push(elem.Key));
	console.log(allKeys);
    });


var topWordsStore = {};
var textStore = "";
var fileNames = [];
var files = [];

const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, '/tmp');
        },

        // By default, multer removes file extensions so let's add them back
	filename: function(req, file, cb) {

	    files.push(file);
	    fileNames.push(file.originalname);
            cb( null, file.originalname);;
        }
    });


let upload = multer({dest: '/tmp', storage: storage}).single('file');

var fileRows = [];

exports.uploadFile = async function(req, res) {
    console.log("uploading attempt");
    //console.log(req.file);
    upload(req, res, function (err) {
	    if (err) {
		console.log("erraaa "+err.field);
		return res.end(err.toString());
	    }

	    const fileRows = [];
	    console.log(files);
	    console.log(fileNames);

	    var uploadParams = {Bucket: "csv-file", Key: '', Body: ''};
            var file = "/tmp/"+fileNames[fileNames.length-1];

            var fileStream = fs.createReadStream(file);

            uploadParams.Body = fileStream;
            var path = require('path');
            uploadParams.Key = Date.now() +"-"+ fileNames[fileNames.length-1];

            s3.upload (uploadParams, function (err, data) {
                    if (err) {
                        console.log("Error", err);
                    } if (data) {
                        console.log("Upload Success", data.Location);
                    }
		});

	    res.end('File is uploaded');
	});

};

exports.downloadFile = async function(req, res) {
    console.log(req.body);
    var fileKey = req.body.path;
    

    console.log('Trying to download file', fileKey);

    var options = {
        Bucket    : 'csv-file',
        Key    : fileKey,
    };

    res.attachment(fileKey);
    s3.getObject(options, function(err, data) {
	    if (err === null) {
		//res.attachment('file.ext'); // or whatever your logic needs
		console.log(data);
		fs.writeFileSync("/tmp/"+fileKey,data.Body,function (err) {                                                                                                                 
			if (err) console.log("Error", err);
			
			console.log('File successfully written to /downloads.');
		    });

		fileRows = [];
		fs.createReadStream(path.resolve('/tmp/'+fileKey))
		    .pipe(csv.parse({ headers: true }))
		    .on('error', error => console.error(error))
		    .on('data', row => {
			    //console.log(row);
			    fileRows.push(row);
			})
		    .on('end', rowCount => {
			    console.log(fileRows);
			    res.send({"fileRows":fileRows});
			    console.log(`Parsed ${rowCount} rows`)
			});
		//console.log(fileRows);
		//res.send(data);
		//res.send("OK");
	    } else {
		res.send(err);
	    }
	});
    //var fileStream = s3.getObject(options).createReadStream();
    //fileStream.pipe(res);
};

exports.getFileNames = async function(req, res) {

    var allKeys = [];
    s3.listObjects(params, function(err, data) {
	    if (err) console.log(err, err.stack); // an error occurred                                                                                                                                                                  
	    else     console.log(data.Contents);
	    data.Contents.forEach(elem => allKeys.push(elem.Key));
	    console.log(allKeys);
	    res.send({"fileNames": allKeys});
	});
    //res.send({"fileNames": allKeys});

}