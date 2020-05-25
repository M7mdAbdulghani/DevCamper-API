const mongoose = require("mongoose");

const connectDB = async () => {
  //Using Promises (With Handleing Exceptions using .catch)
  //   mongoose
  //     .connect(process.env.MONGO_URI, {
  //       useCreateIndex: true,
  //       useUnifiedTopology: true,
  //       useFindAndModify: false,
  //       useNewUrlParser: true
  //     })
  //     .then(conn => console.log(`MongoDB Connected ${conn.connection.host}`))
  //     .catch(err => console.log(err.message));
  /****************************************************************** */
  //Using Async Await (With Try Catch)
  //   try {
  //     const conn = await mongoose.connect(process.env.MONGO_URI, {
  //       useCreateIndex: true,
  //       useUnifiedTopology: true,
  //       useFindAndModify: false,
  //       useNewUrlParser: true
  //     });
  //     console.log(`MongoDB Connected ${conn.connection.host}`);
  //   } catch (err) {
  //     console.log(err.message);
  //   }
  /****************************************************************** */
  //Making this file clean and hnadle the exception in server.js
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true
  });

  console.log(
    `MongoDB Connected ${conn.connection.host}`.cyan.underline.italic
  );
};

module.exports = connectDB;
