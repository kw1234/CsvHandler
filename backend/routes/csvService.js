//const siteUrl = "https://yahoo.com";
//const axios = require("axios");
//const cheerio = require("cheerio");
//var blockspring = require("blockspring");
var multer = require('multer');
const fs = require('fs');
var formidable = require('formidable');
const csv = require('fast-csv');
const path = require("path");

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
    console.log(req.file);
    upload(req, res, function (err) {
	    if (err) {
		console.log("erraaa "+err.field);
		return res.end(err.toString());
	    }

	    const fileRows = [];
	    console.log(files);
	    console.log(fileNames);
	    res.end('File is uploaded');
	});

}