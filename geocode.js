var NodeGeocoder = require('node-geocoder');

var options = {
 provider: 'google',

 httpAdapter: 'https',
 apiKey: 'AIzaSyAJw4dXGz1eT7rHN2ov6oY90hV4c-trNAI', 
 formatter: null
};
var geocoder = NodeGeocoder(options);
geocoder.geocode('pappakudi tirunelveli')
 .then(function(res) {
   console.log("secound response",res);
 })
 .catch(function(err) {
   console.log(err);
 });