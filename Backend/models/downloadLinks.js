const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const downloadLinksSchema = new Schema({
    fileUrl: {
        type: String,
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }
});

module.exports = mongoose.model('DownloadLinks', downloadLinksSchema);