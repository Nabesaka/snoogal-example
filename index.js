const fs = require('fs'),
      util = require('util'),
      path = require('path'),
      express = require('express'),
      exphbs = require('express-handlebars'),
      app = express(),
      PORT = 3000,
      Snoocore = require('snoocore');

const reddit = new Snoocore({
    userAgent: 'node:snoogal:v1.0 (by /u/veneficusunus)', // unique string identifying the app
    oauth: {
        type: 'script',
        key: process.env.REDDIT_KEY, // OAuth client key (provided at reddit app)
        secret: process.env.REDDIT_SECRET, // OAuth secret (provided at reddit app)
        username: process.env.REDDIT_USERNAME, // Reddit username used to make the reddit app
        password: process.env.REDDIT_PASSWORD, // Reddit password for the username
        // The OAuth scopes that we need to make the calls that we
        // want. The reddit documentation will specify which scope
        // is needed for evey call
        scope: [ 'read' ]
    }
});

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}))
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))
app.listen(PORT, (err) => {
    if (err) {
      return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${PORT}`)
})

app.get('/', (request, response, next) => {
    reddit('/r/aww').listing({
        limit: 48,
        sort: 'hot'
    }).then(function(result) {
        response.render('home', {
            slice: result
        });
    });
});

app.get('/id/:id', (request, response, next) => {
    reddit('/r/aww').listing({
        limit: 48,
        sort: 'hot',
        after: request.params.id || false
    }).then(function(result) {
        response.render('home', {
            slice: result
        });
    })
});
