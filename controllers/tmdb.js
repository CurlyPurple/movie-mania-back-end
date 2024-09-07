import { genreObjects } from "../data/genres.js"
import { Profile } from "../models/profile.js"

const BASE_URL = `${process.env.TMDB_BASE_URL}`
const API_KEY = `${process.env.TMDB_API_KEY}`

async function movieSearch(req, res) {
  try {
    console.log(req.params.query)
    const response = await fetch(`${BASE_URL}/search/movie?query=${req.params.query}&api_key=${API_KEY}`)
    const movies = await response.json()

    // filter movies based on predefined movie genres in the genreObjects array 
    // && filter out movies without poster_path
    const filteredMovies = movies.results.filter(movie =>
      movie.genre_ids.length
      &&
      movie.genre_ids.every(genreId => genreObjects.some(genre => genreId === genre.id)) 
      && 
      movie.poster_path
      &&
      movie.release_date
    )

    // massage the movies object data to pass appropriate json-data to front-end
    const movieResults = filteredMovies.map(movie => {
      return {
        movieId: movie.id,
        title: movie.title,
        genreIds: movie.genre_ids,
        plot: movie.overview,
        rating: movie.vote_average/2,
        imageUrl: `https://image.tmdb.org/t/p/w185${movie.poster_path}`,
        releaseDate: movie.release_date,
      }
    })
    res.status(200).json(movieResults)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function celebSearch(req, res) {
  try {
    const response = await fetch(`${BASE_URL}/search/person?query=${req.params.query}&api_key=${API_KEY}`)
    const celebs = await response.json()
    
    //filtered celebs
    const filteredCelebs = celebs.results.filter(celeb => (
      celeb.profile_path
      &&
      celeb.popularity > 1
      &&
      celeb.known_for.length
    ))

    // massage data for celebs to pass appropriate json-data to front-end
    const celebResults = filteredCelebs.map(celeb => ({
      celebId: celeb.id,
      skill: celeb.known_for_department,
      name: celeb.name,
      imageUrl: `https://image.tmdb.org/t/p/w185${celeb.profile_path}`,
      knownFor: celeb.known_for.filter(work => work.media_type === 'movie')
        .map(movie => movie.title),
    }))
    res.status(200).json(celebResults)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

async function recommendations(req, res) {
  try {
    // get user profile
    const profile = await Profile.findById(req.user.profile)
    const celebs = [...profile.favActors, ...profile.favDirectors]
    // define a movies array and populate it based on results of API calls for finding movies for user's favorite celebs
    const movies = []
    for (const celeb of celebs) {
      const response = await fetch(`${BASE_URL}/person/${celeb.celebId}/movie_credits?api_key=${API_KEY}`)
      const results = await response.json()
      const celebMovies = celeb.skill === "Acting" ? 
        results.cast.filter(movie => movie.order < 3) 
        : 
        results.crew.filter(movie => movie.department === 'Directing')
      celebMovies.forEach(celebMovie => {
        if (movies.every(movie => movie.id !== celebMovie.id)) 
          movies.push(celebMovie)
      })
    }
    // filter based on the pre-defined movie-genres and user's favGenres
    const filteredMovies = movies.filter(movie =>
      movie.genre_ids.length
      &&
      movie.genre_ids.every(genreId => genreObjects.some(genre => genreId === genre.id))  
      &&
      profile.favGenres.some(genre => movie.genre_ids.includes(genre.genreId))
      && 
      movie.poster_path
      &&
      movie.release_date
    )
    // massage the movie objects to pass appropriate json-data for front-end rendering
    const recommendations = filteredMovies.map(movie => {
      return {
        movieId: movie.id,
        title: movie.title,
        genreIds: movie.genre_ids,
        plot: movie.overview,
        rating: movie.vote_average/2,
        imageUrl: `https://image.tmdb.org/t/p/w185${movie.poster_path}`,
        releaseDate: movie.release_date,
      }
    })
    // shuffle the array of movies before sending the json data to front-end
    recommendations.sort(()=> Math.random() - 0.5)
    res.status(200).json(recommendations)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}

export {
  movieSearch,
  celebSearch,
  recommendations,
}