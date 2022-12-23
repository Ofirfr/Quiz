import express from "express";
const app = express()
const port: number = 8000

app.get("/", (req, res) => {
    res.send("Hello world!");
});

// start the Express server
app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});