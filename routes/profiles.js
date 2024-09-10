import { Router } from 'express'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'
import * as profilesCtrl from '../controllers/profiles.js'

const router = Router()

/*---------- Public Routes ----------*/


/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)

router.get('/', checkAuth, profilesCtrl.index)
router.get('/:id', checkAuth, profilesCtrl.show)

router.put('/:id/add-photo', checkAuth, profilesCtrl.addPhoto)
router.put('/add-actor', checkAuth, profilesCtrl.addActor)
router.put('/add-genre', checkAuth, profilesCtrl.addGenre)
router.put('/add-director', checkAuth, profilesCtrl.addDirector)
router.put('/add-movie', checkAuth, profilesCtrl.addMovie)
router.put('/add-to-watch-list', checkAuth, profilesCtrl.addToWatchList)

router.delete('/favActors/:actorId', checkAuth, profilesCtrl.removeActor)
router.delete('/favDirectors/:directorId', checkAuth, profilesCtrl.removeDirector)
router.delete('/favMovies/:movieId', checkAuth, profilesCtrl.removeMovie)
router.delete('/watchList/:movieId', checkAuth, profilesCtrl.removeFromWatchList)
router.delete('/favGenres/:genreId', checkAuth, profilesCtrl.removeGenre)

export { router }
