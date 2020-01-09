const http = require("http");
const fs = require("fs");
const morgan = require("morgan");
const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const csv = require("csv-parser");
const dotenv = require("dotenv");
const upload = multer({ dest: "tmp/csv/" });
const app = express();
const Users = require("./model");

app.use(morgan("dev"));

dotenv.config();

// database configuration and connection
const DB = process.env.DATABASE_LOCAL;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("DB connection successful!");
  })
  .catch(err => {
    console.log("an erro occurred:  ", err);
  });

// uploading a csv file
app.post("/upload-csv", upload.single("file"), function(req, res) {
  const userData = [];

  // open uploaded file
  fs.createReadStream(req.file.path, { headers: true })
    .pipe(csv())
    .on("data", function(data) {
      userData.push(data); // push each row to userData
    })
    .on("end", function() {
      // insert data into mongodb
      console.log("The data i want: ", userData);
      let formattedData = {};
      userData.map((cur, index) => {
        const { email } = cur;
        formattedData = cur;
        // insert data in the db
        const newUsers = new Users(formattedData);
        newUsers
          .save()
          .then(users => {
            return res.status(200).json({
              message: `Data upload successfully`,
              users: cur
            });
          })
          .catch(error => {
            return res.status(200).json({
              message: `An error occurred: ${error}`,
              status: "Fail"
            });
          });
      });

      fs.unlinkSync(req.file.path); //delete the temp file
    });
});
const port = process.env.PORT;
// Start the server
app.listen(port, function() {
  console.log("Server running on port:", port);
});
