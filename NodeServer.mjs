import express from 'express'
import fs from 'node:fs'

const app = new express();

// Using the text middleware to interpret request body as text
app.use(express.text());

// Using the static middleware for static front-end hosting
app.use(express.static("public", { index: "Trivia.html" }));


// Location to store trivia files if we want the user to be able to submit their own quizzes
const triviaDir = `trivia`;

/*
 * Function handler for the GET /file API endpoint
 */
app.get("/trivia", async (request, response) => {
    let number = request.query.num;
    let category = request.query.cat;
    let difficulty = request.query.dif;
    const apiResponse = await fetch(`https://opentdb.com/api.php?amount=${number}&category=${category}&difficulty=${difficulty}&type=boolean`);
    const apiData = await apiResponse.json();
    response.json(apiData.results);
    /*If I had time I would add error handling for when the api does not return questions*/
    /*An example I found is the music category with hard difficulty and true false questions. This returns no questions*/
});

// Set the server to listen on port 3000
app.listen(3000, () => {
    console.log("listening on http://localhost:3000");
});