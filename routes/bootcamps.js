const express = require("express");
const router = express.Router();
const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  deleteBootcamps,
  getBootcampsInRadius,
} = require("../controllers/bootcamps");

//Include other resource routers
const coursesRouter = require("./courses");

//Re-route to other resource routers
router.use("/:bootcampId/courses", coursesRouter);

router.route("/radius/:city/:distance").get(getBootcampsInRadius);

router
  .route("/")
  .get(getBootcamps)
  .post(createBootcamp)
  .delete(deleteBootcamps);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

//Bootcamps Routes
// router.get("/", (req, res) => {
//   res.status(200).json({ success: true, message: "Show all bootcamps" });
// });

// router.get("/:id", (req, res) => {
//   res
//     .status(200)
//     .json({ success: true, message: `Show bootcamp ${req.params.id} ` });
// });

// router.post("/", (req, res) => {
//   res.status(200).json({ success: true, message: "Create new bootcamp" });
// });

// router.put("/:id", (req, res) => {
//   res
//     .status(200)
//     .json({ success: true, message: `Update bootcamp ${req.params.id}` });
// });

// router.delete("/:id", (req, res) => {
//   res
//     .status(200)
//     .json({ success: true, message: `Delete bootcamp ${req.params.id}` });
// });

module.exports = router;
