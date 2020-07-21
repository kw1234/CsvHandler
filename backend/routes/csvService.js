var multer = require('multer');
const fs = require('fs');
const homedir = require('os').homedir();
var formidable = require('formidable');
const csv = require('fast-csv');
const path = require("path");
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-west-2'});

/* start of AWS S3 configuration*/
s3 = new AWS.S3({apiVersion: '2006-03-01'});

// the files are uploaded to this S3 bucket called "csv-file"
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

var fileNames = [];
var files = [];

// this sets the upload destination of files to be the /tmp folder, locally at least
// after local storage the files are sent to the S3 bucket
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

// This code block clears the /tmp directory of all existing .csv files on initialization of the server
// I did this as an attempt to try and free memory on Google Cloud instance I'm using, but it doesn't solve my
// scalability problem
var directory = '/tmp';
fs.readdir(directory, (err, files) => {
	if (err) throw err;

	for (const file of files) {
	    if (file.includes(".csv")) {
		console.log(file);
		fs.unlink(path.join(directory, file), err => {
			if (err) throw err;
		    });
	    }
	}
    });


let upload = multer({dest: '/tmp', storage: storage}).single('file');

exports.uploadFile = async function(req, res) {
    console.log("uploading attempt");
    upload(req, res, function (err) {
	    if (err) {
		console.log(err.field);
		return res.end(err.toString());
	    }

	    const fileRows = [];

	    var uploadParams = {Bucket: "csv-file", Key: '', Body: ''};
            var file = "/tmp/"+fileNames[fileNames.length-1];

	    // the file uploaded to /tmp is retrieved as a stream to then upload to S3
            var fileStream = fs.createReadStream(file);

            uploadParams.Body = fileStream;
            var path = require('path');
            uploadParams.Key = Date.now() +"-"+ fileNames[fileNames.length-1];

	    // S3 upload
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

var colNames = [];
var fileRows = [];
var dictRows = {};
var dateStats = {};

exports.downloadFile = async function(req, res) {
    var fileKey = req.body.path;

    console.log('Trying to download file', fileKey);

    var options = {
        Bucket    : 'csv-file',
        Key    : fileKey,
    };

    res.attachment(fileKey);
    var s3FileData = {};
    
    // first the file is retrieved from S3
    s3.getObject(options).promise()
    .then(function(response) {
	    return response;
	})
    .then(function(file) {
	    // then the file is written to the /tmp file locally
	    fs.writeFileSync("/tmp/"+fileKey,file.Body,function (err) {                                                                                                                                                         
		    if (err) console.log("Error", err);
		    console.log('File successfully written to /tmp.');               
		}); 
	    return "/tmp/"+fileKey;
	})
    .then(function(filePath) {
	    colNames = [];                                                                                                                                                                                                           
	    fileRows = [];                                                                                                                                                                                                           
	    dictRows = [];                                                                                                                                                                                                           
	    text = "";                                                                                                                                                                                                               
            
	    index = 0;                                                                                                                                                                                                               
	    pageLimit = 30;                                                                                                                                                                                                          
	    pageRows = [];

	    var readStream = fs.createReadStream(filePath);

	    // parsing of the csv file to get useful information
	    fs.createReadStream(path.resolve(filePath))
		.pipe(csv.parse({ headers: true }))
		.on('error', error => console.error(error))
		.on('data', row => {
			var year = row.date.split("/")[2];
			if (!(year in dateStats)) dateStats[year] = 0;
			dateStats[year]++;
			console.log(dateStats[year]);
			colNames = Object.keys(row);
			fileRows.push(Object.values(row));
			if (pageRows.length >= pageLimit) {
			    dictRows[index] = pageRows;
			    index++;
			    pageRows = [];
			} else {
			    pageRows.push(row);
			}
			dictRows[index] = pageRows;
		    })
		.on('end', rowCount => {
			// send the result of the parsing to the frontend
			res.send({"colNames": colNames, "dictRows":dictRows[0], "rowCount":rowCount});
			console.log(`Parsed ${rowCount} rows`);
		    });
	})
    .catch(function(error) {
	    console.log("Failed!", error);
	    throw error;
	    res.send("GUGU", error);
	});
    //res.send({"colNames": colNames, "fileRows":fileRows, "dictRows":dictRows});
};

// this method is used to keep track of what files are currently on s3 and
// keep the displayed list on the frontend updated
exports.getFileNames = async function(req, res) {

    var allKeys = [];
    s3.listObjects(params, function(err, data) {
	    if (err) console.log(err, err.stack); // an error occurred                                                                                                                                                                  
	    else     
		//console.log(data.Contents);
	    data.Contents.forEach(elem => allKeys.push(elem.Key));
	    console.log(allKeys);
	    res.send({"fileNames": allKeys});
	});

};

exports.deleteFile = async function(req, res) {
    var fileName = req.body.fileName;
    console.log(req.body);
    
    var params = {
        Bucket    : 'csv-file',
        Key    : fileName,
    };

    s3.deleteObject(params, function(err, data) {
	    if (err) console.log(err, err.stack); // an error occurred
	    else     console.log(data);           // successful response
	});
};


// this method is used to retrieve the data page by page
// This is for scalability purposes as loading all the data to the frontend at once causes delays
exports.getPage = async function(req, res) {
    var index = req.body.index;
    console.log(index);
    res.send(dictRows[index]);
}