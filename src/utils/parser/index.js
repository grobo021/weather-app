const colors = require('colors');
const dictionary = require('./dictionary.js');
colors.enable();

const getFeel = (temp) => {
    if (temp < 5) {
        return colors.blue('shivering cold');
    } else if (temp >= 5 && temp < 15) {
        return colors.cyan('pretty cold');
    } else if (temp >= 15 && temp < 25) {
        return colors.blue.inverse('moderately cold');
    } else if (temp >= 25 && temp < 32) {
        return colors.yellow('quiet warm');
    } else if (temp >= 32 && temp < 40) {
        return colors.red('very hot');
    } else {
        return colors.red.inverse('super hot');
    }
};

const getColor = (temp) => {
    if (temp < 5) {
        return colors.blue(String(temp));
    } else if (temp >= 5 && temp < 15) {
        return colors.cyan(String(temp));
    } else if (temp >= 15 && temp < 25) {
        return colors.blue.inverse(String(temp));
    } else if (temp >= 25 && temp < 32) {
        return colors.yellow(String(temp));
    } else if (temp >= 32 && temp < 40) {
        return colors.red(String(temp));
    } else {
        return colors.red.inverse(String(temp));
    }
};

const getPrefix = (code) => {
    const findPrefix = dictionary.find((item) => {
        if (item.codes.indexOf(Number(code)) > -1) {
            return true;
        }
    });

    return findPrefix.prefix || '';
};

const getWeather = (response) => {
    if (response.location) {
        const { location, condition, code, temperature } = response;
        return `Right now ${getPrefix(code)} ${colors.bold(condition.toLowerCase())} in ${colors.bold(location)}. It is ${getFeel(temperature)} at ${getColor(temperature)} degrees celsisus...`;
    }
};

const forecastWeather = (response, data) => {
    if (response.location) {
        const { location, condition, code } = response;
        const regEx = new RegExp(data.weather, 'i');
        const testConditions = regEx.test(condition);
        return `${testConditions ? 'Yes' : 'No'}, ${getPrefix(code)} ${colors.bold(condition.toLowerCase())} today in ${location}`;
    }
};

module.exports = { getWeather, forecastWeather };
