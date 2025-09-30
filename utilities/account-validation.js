const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

const accountModel = require("../models/account-model")

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
      }),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  validate.loginRules = () => {
    return [
      body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required."),
      body("account_password")
        .trim()
        .notEmpty()
        .withMessage("Password is required.")
    ]
  }

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/registration", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

validate.checkLogData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

/* Classification rules */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please enter a classification name.")
      .isAlphanumeric()
      .withMessage("Classification name must not contain spaces or special characters."),
  ]
}

validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = validationResult(req)

  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

validate.inventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Please choose a classification."),
      
    body("inv_make")
      .trim()
      .notEmpty()
      .withMessage("Vehicle make is required."),
      
    body("inv_model")
      .trim()
      .notEmpty()
      .withMessage("Vehicle model is required."),
      
    body("inv_year")
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Enter a valid year between 1900 and 2099."),
      
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Enter a valid price."),
      
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Enter valid mileage."),
      
    body("inv_description")
      .trim()
      .notEmpty()
      .withMessage("Description is required."),
      
    body("inv_color")
      .trim()
      .notEmpty()
      .withMessage("Color is required."),
      
    body("inv_image")
      .trim()
      .notEmpty()
      .matches(/^\/[a-zA-Z0-9\/\-_\.]+$/)
      .withMessage("Enter a valid image path (e.g., /images/vehicles/no-image.png)."),
      
    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .matches(/^\/[a-zA-Z0-9\/\-_\.]+$/)
      .withMessage("Enter a valid thumbnail path (e.g., /images/vehicles/no-image.png)."),
  ];
};

validate.checkInventoryData = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(req.body.classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classificationList,
      ...req.body
    })
    return
  }
  next()
}

validate.checkUpdateData = async (req, res, next) => {
  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList(req.body.classification_id)
    const itemName = `${req.body.inv_make} ${req.body.inv_model}`
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      classificationList,
      inv_id: req.body.inv_id,
      ...req.body
    })
    return
  }
  next()
}

module.exports = validate