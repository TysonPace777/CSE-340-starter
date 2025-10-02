// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController.js")
const regValidate = require('../utilities/account-validation')

router.get("/login", utilities.handleErrors(accountController.buildLogin))
router.get("/registration", utilities.handleErrors(accountController.buildRegister))

router.post(
    "/registration", 
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
)

//error router
router.get("/trigger-error", (req, res, next) => {
    console.log("Router passed test");
    accountController.triggerError(req, res, next);
});

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accountController.loginAccount)
)

router.get(
  "/accounts",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccounts)
)

router.get(
  "/update",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
)

router.post(
  "/update",
  regValidate.updateRules(),
  regValidate.checkAccountUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

console.log("checkUpdateData:", regValidate.checkUpdateData);

router.post(
  "/update-password",
  regValidate.passwordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

router.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
});

module.exports = router;