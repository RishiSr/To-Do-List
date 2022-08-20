const mongoose = require("mongoose");

mongoose.connect(`mongodb+srv://Rishi:${process.env.PASSWORD}@cluster0.5gomwqr.mongodb.net/?retryWrites=true&w=majority`).then(() => {
    console.log("DB Connected");
});
