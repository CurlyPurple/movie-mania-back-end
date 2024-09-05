import { genreObjects } from "../data/genres.js"

const BASE_URL = `${process.env.TMDB_BASE_URL}`
const API_KEY = `${process.env.TMDB_API_KEY}`

async function movieSearch(req, res) {
  try {
    const response = await fetch(`${BASE_URL}/search/movie?query=${req.body.title}&api_key=${API_KEY}`)
    const movies = await response.json()

    // filter movies based on predefined movie genres in the genreObjects array 
    // && filter out movies without poster_path
    const filteredMovies = movies.results.filter(movie =>
      movie.genre_ids.every(genreId => 
        genreObjects.some(genre => genreId === genre.id)
      ) 
      && 
      movie.poster_path
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
    const response = await fetch(`${BASE_URL}/search/person?query=${req.body.name}&api_key=${API_KEY}`)
    const celebs = await response.json()

    // massage data for celebs to pass appropriate json-data to front-end
    const celebResults = celebs.results.map(celeb => ({
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

export {
  movieSearch,
  celebSearch,
}