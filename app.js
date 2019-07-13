var express    = require('express');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');
var path       = require('path');
var dotenv     = require('dotenv');
var sass       = require('node-sass-middleware');
const fileUpload = require('express-fileupload');
var app        = express();

// controllers--->>>>>
var homeController = require('./controllers/home');

dotenv.config({
  path: '.env'
});

var port = process.env.PORT;

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/uploads/'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {
  useCreateIndex: true,
  useNewUrlParser: true
});
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/',homeController.index);
app.get('/students',homeController.getAllDetails);
app.get('/registration',homeController.register);
app.get('/student/id',homeController.editStudent);
app.post('/student/register',homeController.studentRegister);
app.post('/student/upload',homeController.studentFile);
app.post('/student/delete',homeController.deleteStudent);
app.post('/student/update',homeController.studentUpdate);

//filter
app.post('/find/location',homeController.locationFilter);

var server    = app.listen(port,(err,res) => {
	console.log("app listening on port" + port);
});

module.exports = app;