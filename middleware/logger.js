//Middleware (Example)
/*
    - We created a variable called logger
    - This variable is set to a function (middleware)
    - All middlewares has these 3 parameters (req, res, next)
    - We initialize a varaible inside req object
    - That variable we will have access to it through all routes
    - As an example in GET Bootcamps route, we can return req.hello in json response 
    - After that (which is extremely helpful), we have to call the next() function. 
*/
const logger = (req, res, next) => {
  //req.hello = "Hello World";
  console.log(`${req.method} ${req.protocol}://${req.get("host")}${req.url}`);
  next();
};

module.exports = logger;
