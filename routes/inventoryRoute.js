// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildByInvId);

//error router
router.get("/trigger-error", (req, res, next) => {
    console.log("Router passed test");
    invController.triggerError(req, res, next);
});

module.exports = router;