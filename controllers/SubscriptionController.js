const Subscription = require("../models/SubscriptionModel");


const createSubscription = async (req, res) => {
    try {
        const { subscriptionTitle, subscriptionDescription, subscriptionPrice, subscriptionType } = req.body;

    
        // Set time to the end of the day to ensure accurate expiry date

        const newSubscription = new Subscription({
            subscriptionTitle, subscriptionDescription, subscriptionPrice, subscriptionType, isActive: true
        });

        
        await newSubscription.save();
  


        // const stripePlan = await stripe.products.create({
        //     name: subscriptionname,
        //     description: subscriptiondescription,
        // });

        // await stripe.plans.create({
        //     product: stripePlan.id,
        //     amount: price * 100,
        //     currency: 'usd',
        //     interval: 'month',
        // });
        res.status(201).json(newSubscription);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const getAllSubscription = async (req, res) => {
    try {
        const subscriptions = await Subscription.find();
        res.json({subscriptions});
    } catch (error) {
        res.status(500).json(error);
        
    }
};

const getSubscriptionById = async (req, res) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if(!subscription) {
            return res.status(404).json({error: "Subscripton not found"});
        }
        res.json(subscription);
    } catch (error) {
        res.status(500).json(error);
    }
};


const updateSubscription = async (req, res) => {
    try {   
        const updatedSubscription = await Subscription.findById(req.params.id);
        if (!updatedSubscription) {
            return res.status(404).json({ error: "Subscription not updated" });
        }
        await Subscription.updateOne({ _id: req.params.id }, req.body);
        res.json({ massage: "Subscription Updated successfully", updatedSubscription });   
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });   
    }
};

const deleteSubscription = async (req, res) => {
    try {
        const deleteSubscription = await Subscription.findById(req.params.id);
        if(!deleteSubscription) {
            return res.status(404).json({error: "Subscription not found"});
        }
        await Subscription.deleteOne({ _id:req.params.id});
        res.json({massage : "Subscription deleted"});
    } catch (error) {
        res.status(500).json({error: "Internal server error"});
        
    }
};

module.exports = {
    createSubscription,
    getAllSubscription,
    getSubscriptionById,
    updateSubscription,
    deleteSubscription,
};