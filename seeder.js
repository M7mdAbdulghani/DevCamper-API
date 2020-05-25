const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const colors = require("colors");

//Load env vars
dotenv.config({ path: "./config/config.env" });

//Load Models
const Bootcamp = require("./models/Bootcamp");

//Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useNewUrlParser: true,
});

//Read JSON Data
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

//Import / Destroy Data
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    console.log("Data Imported...".green.inverse);
    process.exit(1);
  } catch (error) {
    console.error(error);
  }
};

const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    console.log("Data Destroyed...".red.inverse);
    process.exit(1);
  } catch (error) {
    console.error(error);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else {
  deleteData();
}
