import { Permissions } from '../../common/enums/permissions.enum'
import authenticationMiddleware from '../../middleware/authentication.middleware'
import cardController from './card.controller'
import cardMidlleware from './card.middleware'
import express from 'express'

const router: express.Router = express.Router()

router.post('/', authenticationMiddleware.authenticateToken(),
    authenticationMiddleware.authorizePermissionList(Permissions.CREATE_CARD), 
    cardMidlleware.addCard,
    cardController.createCard)
router.route('/:id')
    .get(authenticationMiddleware.authenticateToken(),
        authenticationMiddleware.authorizePermissionCard(Permissions.GET_CARD),
        cardController.getCardById)
    .put(authenticationMiddleware.authenticateToken(),
        authenticationMiddleware.authorizePermissionCard(Permissions.UPDATE_CARD),
        cardController.updateById)
    .delete(authenticationMiddleware.authenticateToken(),
        authenticationMiddleware.authorizePermissionCard(Permissions.DELETE_CARD),
        cardController.deleteCardById)

export default router