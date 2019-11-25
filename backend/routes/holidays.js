const express = require("express");
const router = express.Router();

const HolidayController = require("../controllers/holidayController");

router.post("/addHolidays", HolidayController.addHolidays);
router.get("/getAllHolidays", HolidayController.getAllHolidays);

module.exports = router;
