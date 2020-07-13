//const siteUrl = "https://yahoo.com";
//const axios = require("axios");
//const cheerio = require("cheerio");
//var blockspring = require("blockspring");
var multer = require('multer');
const fs = require('fs');
var formidable = require('formidable');
const csv = require('fast-csv');

let upload = multer({dest: './uploads/'}).single('file');

var topWordsStore = {};
var textStore = "";

const storage = multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, 'uploads/');
        },

        // By default, multer removes file extensions so let's add them back
	filename: function(req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });


exports.uploadFile = async function(req, res) {
    console.log("uploading attempt");
    //console.log(req.body.file.name);
    upload(req, res, function (err) {
	    console.log(req.body);
	    if (err) {
		console.log("erraaa "+err.field);
		return res.end(err.toString());
	    }
 
	    res.end('File is uploaded');
	});
    //console.log(req.file);
    //console.log(Object.keys(req));
    /*
    upload(req, res, function(err) {
	
	    if (req.fileValidationError) {
		return res.send(req.fileValidationError);
	    }
	    else if (!req.body) {
		return res.send('Please select a file to upload');
	    }
	    else if (err instanceof multer.MulterError) {
		return res.send(err);
	    }
	    else if (err) {
		return res.send(err);
	    }


        const fileRows = [];
        // open uploaded file
	console.log(req.body);
	csv.parseFile(req.body.path)
        .on("data", function (data) {
                fileRows.push(data); // push each row
	    })
        .on("end", function () {
                console.log(fileRows)
                    fs.unlinkSync(req.file.path);   // remove temp file
		//process "fileRows" and respond
	    });

	res.send("pooply");
	}); */

}