const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review')

const campgroundSchema = new Schema({
    title: String,
    images:[
        {
            url:String,
            filename: String
        }
    ],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
});

campgroundSchema.post('findOneAndDelete', async function (doc) {
    // console.log("deleted and this is the post middleware")
    if(doc) {
        await Review.remove({
            _id: {
                $in: doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('Campground', campgroundSchema);