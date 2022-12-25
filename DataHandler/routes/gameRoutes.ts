import express from "express"

const router = express.Router();

import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient();

router.get("/getCurrentQuestion", async (req, res) => {
    const gameIdInput = +(req.query.gameId as string)
    console.log(gameIdInput)
    // check that game id is filled
    if (gameIdInput == undefined) {
        console.log("Received invalid gameId : " + gameIdInput)
        return res.status(400).send("No game Id in the request.")
    }

    const currentQuestion = await prisma.question.findFirst({
        select: {
            question: true
        },
        where: {
            gameId:gameIdInput,
            isOver:false
        },
    })
    console.log(currentQuestion)
    res.send(currentQuestion)
})

export {router as gameRouter};