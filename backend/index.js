const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

//Routes imports


//Middleware imports

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/welcome', require('./routes/welcome'));
app.use('/api/bookings',require('./routes/bookings'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/amenities', require('./routes/amenities'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/users', require('./routes/users'));
app.use('/api/admin', require('./routes/admin'));


mongoose.connect('mongodb+srv://ananthalakshmi0588_db_user:Lakshmi@cluster0.hjwwtvq.mongodb.net/resortDB?retryWrites=true&w=majority')
.then(()=>{console.log('MongoDB connected sucessfully')})
.catch((err)=>{console.log('MongoDB connection error:' , err)});

app.listen(5000, ()=>{console.log("Server is Connected")});
