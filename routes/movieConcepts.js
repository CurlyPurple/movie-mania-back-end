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
router.delete('/:movieConceptId', checkAuth, movieConceptsCtrl.delete)
router.post('/:movieConceptId/comments', checkAuth, movieConceptsCtrl.createComment)
router.put('/:movieConceptId/comments', checkAuth, movieConceptsCtrl.updateComment)
router.delete('/:movieConceptId/comments/:commentId', checkAuth, movieConceptsCtrl.deleteComment)

export { router }