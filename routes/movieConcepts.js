import { Router } from 'express'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'
import * as movieConceptsCtrl from '../controllers/movieConcepts.js'

const router = Router()

/*---------- Public Routes ----------*/


/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)
router.get('/', checkAuth, movieConceptsCtrl.index)
router.post('/', checkAuth, movieConceptsCtrl.create)
router.get('/:movieConceptId', checkAuth, movieConceptsCtrl.show)
router.put('/:movieConceptId', checkAuth, movieConceptsCtrl.update)

export { router }