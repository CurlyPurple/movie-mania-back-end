import mongoose from 'mongoose'

const Schema = mongoose.Schema

const commentSchema = new Schema({
  content: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  author: { type: Schema.Types.ObjectId, ref: 'Profile' }
},{
  timestamps: true,
})

const movieConceptSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Profile' },
  title: {
    type: String,
    required: true
  },
  plot: String,
  genres: {
    type: [String],
    required: true
  },
  actors: [String],
  director: String,
  comments: [commentSchema],
},{
  timestamps: true,
})

const MovieConcept = mongoose.model('MovieConcept', movieConceptSchema)

export { MovieConcept }
