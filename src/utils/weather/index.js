import axios from 'axios';

const formatData = (data) => {
    return {
        location: `${data.location.name}, ${data.location.country}`,
        temperature: data.current.temperature,
        condition: data.current.weather_descriptions[0],
        code: data.current.weather_code
    };
};

const getWeather = (location) => {
    return new Promise( async (resolve, reject) => {
        try {
            const weatherConditions = await axios.get(
                'http://api.weatherstack.com/forecast', {
                params: {
                    access_key: '491356017811be58e81373304fd6ee46',
                    query: location
                }
            });
            resolve(formatData(weatherConditions.data));
        } catch (error) {
            reject(error);
        }
    });
};

export { getWeather as default };
