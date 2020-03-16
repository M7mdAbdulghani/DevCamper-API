const express = require("express");
const dotenv = require("dotenv");
//This is our custom logger middleware
//const logger = require("./middleware/logger");
//Now this is the third party logger middleware
const morgan = require("morgan");
const app = express();

//Routes Files
const bootcamps = require("./routes/bootcamps");

//Load variables from env
dotenv.config({ path: "./config/config.env" });

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

//Mount Routes
app.use("/api/v1/bootcamps", bootcamps);

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
app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
