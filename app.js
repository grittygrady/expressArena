const express = require('express');
const morgan = require('morgan');

const app = express();
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.send('Hellllooo Express!!');
});

app.get('/burgers', (req, res) => {
  res.send('We have juicy cheeseburgers!')
})

app.get('/pizza/pepperoni', (req, res) => {
  res.send('Your pizza is on the way!')
})

app.get('/pizza/pineapple', (req, res) => {
  res.send(`We don't serve that. Never call again!`)
})

app.get('/echo', (req, res) => {
  const responseText = `Here are some details of your request:
    Base URL: ${req.baseUrl}
    Host: ${req.hostname}
    Path: ${req.path}
  `;
  res.send(responseText);
});

app.get('/queryViewer', (req, res) => {
  console.log(req.query);
  res.send();
});

app.get('/greetings', (req, res) => {
  const name = req.query.name;
  const race = req.query.race;

  if(!name) {
    return res.status(400).send('Please provide a name')
  }
  if(!race) {
    return res.status(400).send('Please provide a race')
  }
  const greeting = `Greetings ${name} the ${race}, welcome to our kingdom!`
  res.send(greeting)
})

app.get('/sum', (req, res) => {
  const num1 = req.query.a;
  const num2 = req.query.b;
  const summedNumbers = parseInt(num1) + parseInt(num2);
  const feedback = `The sum of ${num1} and ${num2} is ${summedNumbers.toString()}.`;
  res.send(feedback);
})

app.get('/cipher', (req, res) => {
  const { text, shift } = req.query;

  if (!text) {
    return res.status(400).send('Must enter text')
  }

  if (!shift) {
    return res.status(400).send('Must enter a number to shift by')
  }

  const numShift = parseFloat(shift)

  if (Number.isNaN(numShift)) {
    return res.status(400).send('Must enter a number for the "shift" value')
  }

  const base = 'A'.charCodeAt(0);
  
  const cipher = text.toUpperCase().split('').map(char => {
    const code = char.charCodeAt(0);
    
    if (code < base || code > base + 26) {
      return char;
    }

    let diff = code - base;
    diff = diff + numShift;

    diff = diff % 26;
    const shiftedChar = String.fromCharCode(base + diff);
    return shiftedChar;
  }).join('');
  
  res
    .status(200)
    .send(cipher)
})

app.get('/lotto', (req, res) => {
  const { numbers } = req.query;

  if(!numbers) {
    return res
      .status(400)
      .send('Must enter 6 numbers to guess')
  }

  if(!Array.isArray(numbers)) {
    return res
      .status(400)
      .send('Must be an array of numbers')
  }

  const guesses = numbers
    .map(n => parseInt(n))
    .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20))

  if (guesses.length != 6) {
    return res
      .status(400)
      .send('Must guess 6 numbers between 1 and 20')
  }
  
  const stockNumbers = Array(20).fill(1).map((_, i) => i + 1)
  
  let winningNumbers = [];
  for(let i = 0; i < 6; i++) {
    const ran = Math.floor(Math.random() * stockNumbers.length);
    winningNumbers.push(stockNumbers[ran]);
    stockNumbers.splice(ran, 1);
  }

  let diff = winningNumbers.filter(n => !guesses.includes(n));;

  let responseText = '';

  switch(diff.length) {
    case 0:
      responseText = 'Wow, unbelievable! You could have won the mega millions!';
      break;
    case 1:
      responseText = 'Congrats! You win $100!';
      break;
    case 2:
      responseText = 'Congrats! You win a free ticket!';
      break;
    default:
      responseText = 'Sorry, you lose';
  }

  res.send(responseText);

})

app.listen(8000, () => {
  console.log('Express server is listening on port 8000!');
});