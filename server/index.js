const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/dev');
const pushRentalsToDb = require('./fake-db');
const Rental = require('./models/rental');

const rentalRoutes = require('./routes/rentals');

mongoose.connect(config.DB_url, { useNewUrlParser: true }).then(() => {

	mongoose.connection.db.listCollections({name: 'rentals'})
    .next(function(err, collinfo) {
        if (collinfo) {
            // The collection exists
        } else {
        	const fakeDb = new FakeDb();
			fakeDb.pushRentalsToDb();
        }
    });

});

const app = express();

// Middleware
app.use('/api/v1/rentals', rentalRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, function(){
	console.log('server running')
});

