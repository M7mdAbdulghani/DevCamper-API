const express = require("express");
const dotenv = require("dotenv");
//This is our custom logger middleware
//const logger = require("./middleware/logger");
//Now this is the third party logger middleware
const morgan = require("morgan");
const colors = require("colors");
const fileupload = require("express-fileupload");
const errorHandler = require("./middleware/error");
const connectDB = require("./config/db");
const app = express();

//Body Parser
app.use(express.json());

//Load variables from env
dotenv.config({ path: "./config/config.env" });

//Routes Files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");

//Connect to database
connectDB();

//To be able to use that middleware, we have to use this line
//app.use(logger);

//This is for using third party logger (morgan) middleware
//We want to use it only for development envirenment
/*
    Morgan supports a handful of pre-defined logged formats 
    with well-know names/structures. 
    combined, common, dev, short, tiny. 
    That string is telling morgan which log format you'd like it to use.
*/
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Express file upload
app.use(fileupload());

//Serve Static Files
app.use(express.static(__dirname + "/public"));

//Mount Routes
/*
    This means use bootcamps router (bootcamps variable)
    for any URL that begins with /api/v1/bootcamps
*/
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

//Error Handler
app.use(errorHandler);

//Routes
// app.get("/", (req, res) => {
//   //Res.send -> Default Response Content Type is HTML
//   //res.send("Hello World");
//   //**************************** */

//   //So we can do like this
//   //res.send("<h1>Hello World</h1>");
//   //**************************** */

//   //We can send json also (The content type here will be application/json) express will automatically know
//   //Without the need for JSON.stringfy()
//   //res.send({ successful: true });
//   //**************************** */

//   //But it is better to use res.json
//   //res.json({ successful: true });
//   //**************************** */

//   //If we want to send status code (This will send only the status)
//   //res.sendStatus(400);
//   //**************************** */

//   //Usually we wanted to send also the data and error messages like this (Preferred Way)
//   res.status(200).json({ successful: true, data: { id: 1 } });
// });

//Run the server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow
      .bold
  );
});

//Handelling Global unhandledRejection Promises
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  server.close(() => process.exit(1));
});
