import { Router } from 'express'
import { decodeUserFromToken, checkAuth } from '../middleware/auth.js'
import * as movieConsCtrl from '../controllers/movieConcepts.js'

const router = Router()

/*---------- Public Routes ----------*/
router.get('/', movieConsCtrl.index)
router.get('/:movieConId', movieConsCtrl.show)

/*---------- Protected Routes ----------*/
router.use(decodeUserFromToken)

router.post('/', checkAuth, movieConsCtrl.create)
router.post('/:movieConId/comments', checkAuth, movieConsCtrl.createComment)

router.put('/:movieConId', checkAuth, movieConsCtrl.update)
router.put('/:movieConId/comments', checkAuth, movieConsCtrl.updateComment)

router.delete('/:movieConId', checkAuth, movieConsCtrl.delete)
router.delete('/:movieConId/comments/:commentId', checkAuth, movieConsCtrl.deleteComment)

export { router }