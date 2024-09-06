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
router.post('/add-actor', checkAuth, profilesCtrl.addActor)
router.post('/add-genre', checkAuth, profilesCtrl.addGenre)
router.post('/add-director', checkAuth, profilesCtrl.addDirector)
router.post('/add-movie', checkAuth, profilesCtrl.addMovie)
router.post('/add-to-watch-list', checkAuth, profilesCtrl.addToWatchList)


export { router }
