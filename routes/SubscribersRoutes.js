// routes/SubscriptionRoutes.js
const express = require('express');
const router = express.Router();
const SubscribersController = require('../controllers/SubscribersController');

// Endpoint for creating a new subscription
router.post('/subscribe', SubscribersController.purchaseSubscriptions);
router.get('/getByUser/:userId', SubscribersController.getUserSubscriptions);
// router.get("/getAll", SubscribersController.getAllSubscription);
router.put("/updatestatus/:userId", SubscribersController.updateSubscription);
router.delete("/delete/:userId", SubscribersController.deleteSubscription);
router.post("/confirmPayment", SubscribersController.confirmPayment);

module.exports = router;
