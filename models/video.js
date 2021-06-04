import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const videoSchema = mongoose.Schema({
    writer: { type: Schema.Types.ObjectId, ref: 'User'},
    title: { type: String, maxlength:50 },
    description: { type: String },
    privacy: { type: Number },
    filePath: { type: String },
    // category: String,
    views: { type: Number, default: 0 },
    duration: { type: String },
    thumbnail: { type: String }
}, { timestamp: true })

export default mongoose.model("Video", videoSchema);