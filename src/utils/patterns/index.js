const patternDic = [{
    pattern: '\\b(?<greeting>Hi|Hello|Hey|Namaste|Hola)\\b',
    intent: 'Hello'
}, {
    pattern: '\\b(Bye|Exit|Quit|Leave)\\b',
    intent: 'Exit'
}, {
    pattern: '\\blike\\sin\\s\\b(?<city>.+)\\b',
    intent: 'CurrentWeather'
}, {
    pattern: '\\b(?<weather>haze|rain|rainy|sunny|cloudy|snow|thunderstorms|windy|drizzle)\\b\\sin\\s\\b(?<city>[a-z]+[ a-z]+?)\\btoday$',
    intent: 'WeatherForecast'
}, {
    pattern: '\\b(?<weather>haze|rain|rainy|sunny|cloudy|snow|thunderstorms|windy|drizzle)\\b\\s\\btoday\\sin\\s\\b(?<city>[a-z]+[ a-z]+?)$',
    intent: 'WeatherForecast'
}];

module.exports = patternDic;
