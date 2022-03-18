const express = require('express');
const server = express();
const port = 3001;
const bodyParser = require('body-parser');
const fs = require('fs');

server.set('port', process.env.PORT || 3001);

server.get('/', (request, response) => {
    response.json('Welcome to our nut butter e-commerce app');
})

// Listen for 3001
server.listen(port, () => {
    console.log(`Server started on port ${port}.`)
});
