import express from "express"

const router = express.Router();

import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient();

import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()
const jwt_secret = process.env.jwt_token_secret || "secret"
router.get("/getCurrentQuestion", async (req, res) => {
    const gameIdInput = +(req.query.gameId as string)

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


router.get('/createGame', async (req, res) => {
    const gameName = req.query.gameName as string

    if (gameName == undefined) {
        return res.status(400).send("No game name in the request.")
    }

    const newGame = await prisma.game.create({
        data:{
            name: gameName,
        },
    })
    console.log(newGame)

    const gameOwnerToken = jwt.sign(JSON.stringify({gameId: newGame.id, owner:true}),jwt_secret)

    res.send(gameOwnerToken)
})

router.get('/joinGame', async (req, res) => {
    // get game id - check if good
    const gameId = +(req.query.gameId as string)
    if (gameId == undefined){
        return res.status(400).send("No gameId specified")
    }
    const gameExists = await prisma.game.findFirst({
        where:{
            id:gameId,
            isOver:false
        }
    })
    if (gameExists == undefined){
        return res.status(400).send("Game not found")
    }

    // get user name - check if available
    const userName = req.query.userName as string
    if (userName == undefined){
        return res.status(400).send("Username not found in request")
    }
    const userExists = await prisma.user.findFirst({
        where:{
            name:userName,
            gameId:gameId
        }
    })
    if (userExists){
        return res.status(400).send("User already exists")
    }

    // add new user to db

    await prisma.user.create({
        data:{
            name:userName,
            gameId:gameId
        }
    })

    // create token for user for game

    const jwtTokenForUser = jwt.sign(JSON.stringify({userName:userName,gameId:gameId}),jwt_secret)
    res.status(200).send(jwtTokenForUser)

})

export {router as gameRouter};