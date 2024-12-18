import { NextFunction, Request, Response } from "express";
import { Card } from "./Card.entity";
import { List } from "../list/List.entity";
import { CustomSuccessfulResponse } from "../../middleware/successResponse.middleware";
import cardService from "./card.service";

class cardController {
    public async createCard(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const cardData = req.body
            const list: List = req.list
            const newCard = new Card()
            newCard.title = cardData.title
            newCard.description = cardData.description
            newCard.order = cardData.order
            newCard.list = list

            const response: CustomSuccessfulResponse = await cardService.addCard(newCard)
            res.status(response.status).json({
                message: response.message,
                data: response.data
            })
        } catch (error : unknown) {
            next(error)
        }
    }
    public async getCardById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const cardId: number = Number(req.params.id)
            const card : Card = await cardService.getCardById(cardId)
            res.status(200).json({
                message: 'Card found',
                data: card
            })
        } catch (error : unknown) {
            next(error)
        }
    }
    public async updateById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const card = new Card()
            const cardId: number = Number(req.params.id)
            const cardData = req.body
            card.title = cardData.title
            card.description = cardData.description
            card.order = cardData.order

            const response: CustomSuccessfulResponse = await cardService.updateCard(cardId, card)
            res.status(response.status).json({
                message: response.message,
                data: response.data
            })
        } catch (error : unknown) {
            next(error)
        }
    }
    public async deleteCardById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const cardId: number = Number(req.params.id)

            const response: CustomSuccessfulResponse = await cardService.deleteCard(cardId)
            res.status(response.status).json({
                message: response.message,
                data: response.data
            })
        } catch (error : unknown) {
            next(error)
        }
    }
}
export default new cardController()