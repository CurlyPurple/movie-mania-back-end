import mongoose from 'mongoose'

const Schema = mongoose.Schema

const genreSchema = new Schema ({
  genreId: Number, 
  genreName: String
},{
  timestamps: true,
})

const celebSchema = new Schema({
  celebId: Number,
  skill: String,
  name: String,
  imageUrl: String,
  knownFor: [String],
},{
  timestamps: true,
})

const movieSchema = new Schema({
  movieId: Number,
  title: String,
  genreIds: [Number],
  plot: String,
  rating: String,
  imageUrl: String,
  releaseDate: String,
  videoKey: String,
  credits: { cast: [String], crew: String }
},{
  timestamps: true,
})

const profileSchema = new Schema({
  name: String,
  photo: String,
  favGenres: [genreSchema],
  favActors: [celebSchema],
  favDirectors: [celebSchema],
  favMovies: [movieSchema],
  watchList: [movieSchema],
  movieConcepts: [{ type: Schema.Types.ObjectId, ref: 'MovieConcept' }]
},{
  timestamps: true,
})

const Profile = mongoose.model('Profile', profileSchema)

export { 
  Profile,
  celebSchema,  
}
