const express = require('express');
const homeRouter = express.Router();
const path = require('path');

// Homepage GET route
homeRouter.get('/', (request, response) => {
    response.sendFile(path.resolve('./static/index.html'));
})

module.exports = homeRouter;