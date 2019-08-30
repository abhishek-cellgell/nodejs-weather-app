const express = require('express')
const path = require('path')
const hbs = require('hbs')

const api = require('./utils/api')
const app = express()
const port = process.env.PORT | 3000

// define paths for express config
const publicFolderPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// setup static directory to serve
app.use(express.static(publicFolderPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Abhishek Kumar'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Abhishek Kumar'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Abhishek Kumar',
        helpText: 'This is help text'
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Help - 404 Page',
        message: 'Help topic not found',
        name: 'Abhishek Kumar'
    })
})

// weather api
app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'please provide address !'
        })
    }

    api.geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error })
        }

        api.weather(latitude, longitude, (err, forecast) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                forecast,
                location,
                address: req.query.address
            })
        })
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 Page',
        message: '404 Page not found!',
        name: 'Abhishek Kumar'
    })
})

app.listen(port, () => {
    console.log('Server is running up at: ' + port)
})