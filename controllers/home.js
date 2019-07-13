var studentSchema = require('../models/student');
var mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
var path = require('path');

exports.index = (req,res) => {
	res.redirect('http://localhost:4000/students');
};

exports.getAllDetails = (req,res) => {
	studentSchema.find({},(err,find) => {
		if(err) {
			console.log(err);
		} else {
			console.log(find);
			res.render('home',{
				title: 'Student Details',
				data: find
			});
		}
	})
};

exports.register = (req,res) => {
	res.render('index',{
		title: 'Register Form'
	});
}

exports.studentRegister = (req,res) => {
	console.log("request",req.body);
	var user_id = (Math.floor(Math.random() * (9999 - 1000)) + 1000);
	var data = new studentSchema({
		user_id: user_id,
		name: req.body.name,
		age: req.body.age,
		location: req.body.location.toLowerCase(),
		department: req.body.department
	});

	data.save((error,saved) => {
		if(error) {
			console.log(error);
		} else {
			console.log("saved",saved);
			res.redirect('http://localhost:4000/students');
		}
	})
};

exports.editStudent = (req,res) => {
	console.log("edit user",req.body);
	studentSchema.findOne({
		user_id: req.query.userId
	},(err,find) => {
		if(err) {
			console.log(err);
		} else {
			res.send({
				data: find
			});
		}
	})
};


exports.studentUpdate = (req,res) => {
	console.log("update user request",req.body);
	studentSchema.updateOne({
		user_id: req.body.user_id
	},{
		$set: {
			name: req.body.name,
			age: req.body.age,
			location: req.body.location.toLowerCase(),
			department: req.body.department
		}
	},(err,updated) => {
		if(err) {
			console.log(err);
		} else {
			res.redirect('http://localhost:4000/students');
		}
	})
};

exports.deleteStudent = (req,res) => {
	console.log("delete request", req.body);
	studentSchema.deleteOne({
		user_id: req.body.user_id
	},(err,deleted) => {
		if(err) {
			console.log(err);
		} else {
			console.log(deleted);
			res.send({
				status: 200,
				message: 'successfully deleted'
			});
		}
	})
}

exports.studentFile = (req,res) => {
	 let sampleFile;
	  let uploadPath;

	  if (Object.keys(req.files).length == 0) {
	    res.status(400).send('No files were uploaded.');
	    return;
	  }

	  console.log('req.files >>>', req.files); // eslint-disable-line

	  sampleFile = req.files.sampleFile;
	  console.log("dir name",__dirname);

	  // uploadPath = __dirname + '/uploads/' + sampleFile.name;
	  uploadPath = path.join(__dirname, '../uploads/' + sampleFile.name);


	  sampleFile.mv(uploadPath, function(err) {
	    if (err) {
	      return res.status(500).send(err);
	    }
	    const csvFilePath = path.join(__dirname, '../uploads/' + sampleFile.name)
		const csv=require('csvtojson');
		csv()
		.fromFile(csvFilePath)
		.then((jsonObj)=>{
		    console.log(jsonObj);
		    var count = 0;
		    for(var i=0; i<jsonObj.length; i++) {
		    	count += 1;
		    	var user_id = (Math.floor(Math.random() * (9999 - 1000)) + 1000);
		    	var csvData = new studentSchema ({
		    		user_id: user_id,
		    		name: jsonObj[i].name,
					age: jsonObj[i].age,
					location: jsonObj[i].location.toLowerCase(),
					department: jsonObj[i].department
		    	})
		    	csvData.save((error,saved) => {
		    		if(error) {
		    			return res.status(500).send(error);
		    		}
		    		console.log(saved);
		    	})
		    }
		    res.redirect('http://localhost:4000/students');
		})
	  });
};

exports.locationFilter = (req, res) => {
	// console.log(req.body);
	var filter = req.body.location;
	console.log(filter);
	var myquery = {'location': {'$regex': ''+ filter +''}};
	studentSchema.find(myquery,(err,find) => {
		if(err) {
			console.log(error);
		} else {
			res.send(find);
		}
	})
}