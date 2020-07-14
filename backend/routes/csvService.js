//const siteUrl = "https://yahoo.com";
//const axios = require("axios");
//const cheerio = require("cheerio");
//var blockspring = require("blockspring");
var multer = require('multer');
const fs = require('fs');
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


var topWordsStore = {};
var textStore = "";
var fileNames = [];
var files = [];

const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, './uploads/');
        },

        // By default, multer removes file extensions so let's add them back
	filename: function(req, file, cb) {

	    files.push(file);
	    fileNames.push(file.originalname);
            cb( null, file.originalname);;
        }
    });


let upload = multer({dest: './uploads/', storage: storage}).single('file');

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
            var file = "../uploads/"+fileNames[fileNames.length-1];

            var fs = require('fs');
            var fileStream = fs.createReadStream(file);
            fileStream.on('error', function(err) {
                    console.log('File Error', err);
		});
            uploadParams.Body = file;
            var path = require('path');
            uploadParams.Key = fileNames[fileNames.length-1] + Date.now();

            s3.upload (uploadParams, function (err, data) {
                    if (err) {
                        console.log("Error", err);
                    } if (data) {
                        console.log("Upload Success", data.Location);
                    }
		});

	    res.end('File is uploaded');
	});

}