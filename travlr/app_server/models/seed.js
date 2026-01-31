// Bring in the DB connection(./db) and the Trip schema
const Mongooose = require('./db');
const Trip = require('./travlr');

// Read seed data from json file
var fs = require('fs');
var trips = JSON.parse(fs.readFileSync('./data/trips.json','utf8'));

// delete any existing records, then insert seed data
const seedDB = async () => {
  await Trip.deleteMany({});
  await Trip.insertMany(trips);
};

// Close the MongogoDB connection and exit
seedDB().then(async () => {
  await Mongooose.connection.close();
  process.exit(0);
});