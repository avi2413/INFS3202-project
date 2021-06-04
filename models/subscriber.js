import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const subscriberSchema = mongoose.Schema({
    userTo: { type: Schema.Types.ObjectId, ref: 'User'},
    userFrom: { type: Schema.Types.ObjectId, ref: 'User'}
}, { timestamp: true })

export default mongoose.model("Subscriber", subscriberSchema);