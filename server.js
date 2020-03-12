const express = require("express");
const dotenv = require("dotenv");
const app = express();

//Load variables from env
dotenv.config({ path: "./config/config.env" });

//Run the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
