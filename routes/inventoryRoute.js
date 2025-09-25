// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const invController = require("../controllers/invController")
const invValidate = require("../utilities/account-validation")

router.get("/", utilities.handleErrors(invController.buildManagement))

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
router.get("/detail/:invId", invController.buildByInvId);

//error router
router.get("/trigger-error", (req, res, next) => {
    console.log("Router passed test");
    invController.triggerError(req, res, next);
});

router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.addClassification)
)

router.get(
    "/add-classification",
    utilities.handleErrors(invController.buildAddClassification)
)

router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)

router.get(
    "/add-inventory",
    utilities.handleErrors(invController.buildAddInventory)
)

module.exports = router;