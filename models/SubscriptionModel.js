const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
{
    created: {
        type: Date,
        default: Date.now
    },
    subscriptionTitle: {
        type: String,
    },
    subscriptionDescription: {
        type:String,
        required:true
    },
    subscriptionType: {
        type: String,
    },
    subscriptionPrice: {
        type: Number,
        required:true
    },
    isActive: {
        type: Boolean,
        default: true
    }
},
    // {timestamps:true}
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;