const Subscriber = require("../models/SubscribersModels");
const User = require("../models/UserModel");
const Subscription = require("../models/SubscriptionModel");
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const dotenv = require('dotenv');


dotenv.config();


const purchaseSubscriptions = async (req, res) => {
    try {
        const {userId,subscriptionId} = req.body;

        const existingSubscriber = await Subscriber.findOne({
            userId,
            expiryDate: { $gt: new Date() }, // Check if the expiry date is in the future
        });
        const user = await User.findById({ _id:req.body.userId});
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        if (existingSubscriber) {
            return res.status(400).json({ error: "Subscription already exists for this user." });
        }


        const existingSubscription = await Subscription.findById(req.body.subscriptionId);
        if(!existingSubscription) {
            return res.status(404).json({error: "Subscription not found"});
        }

       
        const today = new Date();
        let expiryDate = new Date();

        if (existingSubscription.subscriptionType === 'monthly') {
            expiryDate.setMonth(today.getMonth() + 1);
        } else if (existingSubscription.subscriptionType === 'yearly') {
            expiryDate.setFullYear(today.getFullYear() + 1);
        }

        // Set time to the end of the day to ensure accurate expiry date
        expiryDate.setHours(23, 59, 59, 999);
        // Create a payment intent in Stripe
        // const paymentIntent = await stripe.paymentIntents.create({
        //     amount: existingSubscription.price * 100,
        //     currency: 'usd',
        //     description: 'Subscription Purchase',
        //     payment_method_types: ['card'],
        // });

        const localExpiryDate = expiryDate.toLocaleString('en-US', { timeZone: 'Asia/Karachi' });

        // Create a new subscriber in your database
        const newSubscriber = new Subscriber({
            userId,
            subscriptionId,
            subscriptionTitle: existingSubscription.subscriptionTitle,
            expiryDate: localExpiryDate,

        });

          // Save the new subscription to the database
        await newSubscriber.save();

        // const serverTime = new Date();
        // const localTime = serverTime.toLocaleString('en-US', { timeZone: 'Asia/Karachi' }); // Replace 'Your_Local_Timezone' with your actual timezone


  
        res.json({
            success: true,
            message: 'Subscription created successfully.',
            newSubscriber,
            // serverTime: serverTime.toISOString(), // Server time in UTC
            // localTime: localTime,

            // clientSecret: paymentIntent.client_secret,
            // paymentIntentId: paymentIntent.id,
        });

    } catch (error) {   
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const getUserSubscriptions = async (req, res) => {
    try {
        const { userId } = req.params;

        const userSubscriptions = await Subscriber.find({ userId })
        .select('-subscriptionId'); // Exclude 'status' and 'subscriptionId'

        if (!userSubscriptions) {
            return res.status(404).json({ error: "No subscriptions found" });
        }


        res.json({message: "success",userSubscriptions})

    }   catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const updateSubscription = async (req, res) => {
    try {   
        const {userId} = req.params;
        const users = await User.find();

        const updatedSubscription = await Subscriber.findOne({ userId });
        if (!updatedSubscription) {
            return res.status(404).json({ error: "Subscription not updated" });
        }
            
        await Subscriber.updateOne({userId}, req.body);
        res.json({ massage: "Subscription Updated successfully", updatedSubscription });
        } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Internal server error" });   
        }
    };

    const deleteSubscription = async (req, res) => {
        try {
            const {userId} = req.params;
            const users = await User.find();

            const deleteSubscription = await Subscriber.findOne({userId});
            if(!deleteSubscription) {
                return res.status(404).json({error: "Subscription not found"});
            }
            await Subscriber.deleteOne({userId});
            res.json({massage : "Subscription deleted"});
        } catch (error) {
            res.status(500).json({error: "Internal server error"});
            
        }
    };
    const confirmPayment = async (req, res) => {
        try {
            const { paymentMethodId, paymentIntentId } = req.body;
    
            // Confirm payment in Stripe
            const confirmedPayment = await stripe.paymentIntents.confirm(paymentIntentId, {
                payment_method: paymentMethodId,
            });
    
            if (confirmedPayment.status === 'succeeded') {
                // Update subscriber's permission status in your database
                const subscriber = await Subscriber.findOne({ paymentIntentId });
                if (subscriber) {
                    subscriber.permission = 'succeed';
                    await subscriber.save();
                }
    
                res.json({ success: true, message: 'Payment confirmed and permission updated.' });
            } else {
                res.json({ success: false, message: 'Payment confirmation failed.' });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };

module.exports ={
    purchaseSubscriptions,
    getUserSubscriptions,
    updateSubscription,
    deleteSubscription,
    confirmPayment
};

