const Readline = require('readline');
const matcher = require('./utils/matchers/index.js');
const weather = require('./utils/weather/index.js');
const { getWeather, forecastWeather } = require('./utils/parser/index.js');

const rl = Readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

console.clear();
rl.setPrompt('> ');
rl.prompt();
rl.on('line', (reply) => {
    matcher(reply, async (data) => {
        switch (data.intent) {
            case 'Hello':
                console.log(`${data.entities.greeting} to you too! :)`);
                rl.prompt();
                break;

            case 'Exit':
                console.log('Bye! :)');
                process.exit(0);

            case 'CurrentWeather':
                console.log(`Checking Weather for ${data.entities.city}`);
                await weather(data.entities.city)
                    .then((response) => {
                        console.log(getWeather(response));
                    }).catch((e) => {
                        console.log(e);
                        console.log('I don\'t know about this location. Sorry..... :(');
                    });
                rl.prompt();
                break;

            case 'WeatherForecast':
                console.log('Let me check...');
                await weather(data.entities.city)
                    .then((response) => {
                        console.log(forecastWeather(response, data.entities));
                    }).catch((e) => {
                        console.log(e);
                        console.log('I don\'t know about this location. Sorry..... :(');
                    });
                rl.prompt();
                break;
            default:
                console.log('I don\'t understand what you are trying to say :(');
                rl.prompt();
                break;
        }
    });
});
