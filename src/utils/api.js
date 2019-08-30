const request = require('request')

const geocode = (address, callback) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyC56etUNa7foT2yJOe1ln1OCLw6xc7SVgI`

    request({ url, json: true }, (err, { body }) => {
        if (err) {
            callback('Unable to connect to Geo API.', undefined)
        } else if (!body.results[0]) {
            callback('Unable to find location. Try another search.', undefined)
        } else {
            const { lat: latitude, lng: longitude } = body.results[0].geometry.location
            const loc = body.results[0].address_components
            let location = loc[0].long_name;
            if (loc[1]) {
                location += ', ' + loc[1].long_name
            }
            if (loc[2]) {
                location += ', ' + loc[2].long_name
            }
            if (loc[3]) {
                location += ', ' + loc[3].long_name
            }
            callback(undefined, {
                latitude,
                longitude,
                location
            })
        }
    })
}

const weather = (latitude, longitude, callback) => {
    let url = 'https://api.darksky.net/forecast/4552109c9bb98162c1227f4bc70a71c3/'
    url += latitude + ',' + longitude + '?units=si'

    request({ url, json: true }, (err, { body }) => {
        if (err) {
            callback('Unable to connect to Weather Api', undefined)
        } else if (body.error) {
            callback('Unable to find forecast data', undefined)
        } else {
            const { temperature, precipProbability } = body.currently
            const forecast = `${body.hourly.summary} It is currently ${temperature} degrees out. There is a ${precipProbability}% chance of rain.`
            callback(undefined, forecast)
        }
    })
}

module.exports = {
    geocode,
    weather
}