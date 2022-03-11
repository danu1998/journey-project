const express = require("express");
const { register, login, checkAuth } = require("../controllers/auth");
const {
  addUserBookmark,
  getUserBookmark,
  deleteUserBookmark,
} = require("../controllers/bookmark");
const {
  getJourneys,
  getJourney,
  addJourney,
  deleteJourney,
  updateJourney,
  getUserJourney,
} = require("../controllers/journey");
const {
  getProfiles,
  getProfile,
  updateProfile,
} = require("../controllers/profile");
const { auth } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");
const router = express.Router();

router.get("/journeys", getJourneys);
router.get("/journey/:id", getJourney);
router.post("/journey", auth, uploadFile("image"), addJourney);
router.delete("/journey/:id", deleteJourney);
router.patch("/journey/:id", auth, uploadFile("image"), updateJourney);
router.get("/journeyuser/", auth, getUserJourney);

router.get("/profiles", auth, getProfiles);
router.get("/profile/:id", getProfile);
router.patch("/profile/:id", auth, uploadFile("image"), updateProfile);

router.post("/bookmark", auth, addUserBookmark);
router.get("/bookmarkuser", auth, getUserBookmark);
router.get("/bookmark/:id", deleteUserBookmark);

router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);
module.exports = router;
