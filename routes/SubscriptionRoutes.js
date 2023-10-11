const express = require("express");

const SubscriptionController = require("../controllers/SubscriptionController");

const router = express.Router();

router.post("/createSubscription", SubscriptionController.createSubscription);
router.get("/getAllSubscription", SubscriptionController.getAllSubscription);
router.get("/getSubscriptionById/:id", SubscriptionController.getSubscriptionById);
// router.get("/getSubscriptionByUserId/:userId", SubscriptionController.getSubscriptionByUserId);
router.put("/updateSubscription/:id", SubscriptionController.updateSubscription);
router.delete("/deleteSubscription/:id", SubscriptionController.deleteSubscription);

module.exports = router;

