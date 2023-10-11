const mongoose = require("mongoose");

const subscribersSchema = new mongoose.Schema(
{
    subscribeDate: {
        type: Date,
        default: Date.now
    },
    userId: {
        type:String,
        required:true
    },
    subscriptionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subscription'
    },
    subscriptionTitle: {
        type: String
    },
    status: { type: String, 
        enum: ['inprocess', 'active', 'declined'], 
        default: 'inprocess' 
    },
    expiryDate: {
        type: Date,
        required: true
    },
    paymentIntentId: {
        type: String,
    },  

},
    // {timestamps:true}
);

const Subscriber = mongoose.model("Subscriber", subscribersSchema);

module.exports = Subscriber;