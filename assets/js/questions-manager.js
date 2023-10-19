const n = 20;
const difficulty = 'hard';
const generateRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
fetch(`https://opentdb.com/api.php?amount=${n}&category=18&difficulty=${difficulty}`).then(res => res.json())
    .then(res => {
        console.log(res);
        console.log(res.results[generateRandomNumber(0, n - 1)]) // codice per gestire le domande
    });