import { Router } from 'express'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'
import * as profilesCtrl from '../controllers/profiles.js'

const router = Router()

/*---------- Public Routes ----------*/


/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)
router.get('/', checkAuth, profilesCtrl.index)
router.put('/:id/add-photo', checkAuth, profilesCtrl.addPhoto)
router.post('/add-actor', checkAuth, profilesCtrl.addActor)
router.post('/add-genre', checkAuth, profilesCtrl.addGenre)
router.post('/add-director', checkAuth, profilesCtrl.addDirector)

export { router }
