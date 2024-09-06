import { Router } from 'express'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'
import * as tmdbCtrl from '../controllers/tmdb.js'

const router = Router()

/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)
router.get('/movie', checkAuth, tmdbCtrl.movieSearch)
router.get('/celeb/:name', checkAuth, tmdbCtrl.celebSearch)
router.get('/recommendations', checkAuth, tmdbCtrl.recommendations)

export { router }