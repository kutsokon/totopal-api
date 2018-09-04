# Totopal API

Idiomatic, stateless [REST API](https://www.restapitutorial.com/) example (made with Express + Mongoose), containing CRUD, validation, auth, etc. All data schemas are pseudo-football, very simplified and have no sense. The main intention of this repo to create basic, plain API example. It was made looking back to [Building a RESTful API with Node.js](https://www.youtube.com/watch?v=0oXYLzuucwE&list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q) video tutorial.

This repo is functionality complete — PRs and issues welcome!

# Getting started

To get the Node server running locally:

- Clone this repo
- `npm install` or `yarn` to install all required dependencies
- If you use docker you can just run `docker-compose up` and find running API on 3000 port or if you prefer to use mongodb on your local machine you are still able to install MongoDB Community Edition ([instructions](https://docs.mongodb.com/manual/installation/#tutorials)) and run it by executing `mongod`. In this case you need to change mongoURI and run npm commands manually to start the local server: `npm run start` or `yarn startr`

# Code Overview

## Dependencies

- [expressjs](https://github.com/expressjs/express) - The server for handling and routing HTTP requests.
- [cors](https://github.com/expressjs/cors) - CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options.
- [joi](https://github.com/hapijs/joi) - Object schema validation.
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Lib to help to hash passwords.
- [chalk](https://github.com/chalk/chalk) - Terminal string styling done right.
- [winston](https://github.com/winstonjs/winston) - A logger for CRUD operations and errors.
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - For generating JWTs used by authentication.
- [mongoose](https://github.com/Automattic/mongoose) - For modeling and mapping MongoDB data to javascript.

## Application Structure

The application structure here is resource-oriented, every item has it's own folder with model - `*.model.js`, routes - `*.route.js` and controller - `*.controller.js`

- `app.js` - The entry point to our application. This file defines our express server. It also requires the routes and models we'll be using in the application.
- `db/` - Connects the server to MongoDB using mongoose.
- `routes/` - This folder combines all routes from other `*.route.js` files inside folders.
- `middleware` - Express middlewares.
- `utils/` - Logger, helpers, erc.
- `user/` - This folder contains user data interaction and all authentication logic .

## Error Handling

In `routes/error.js`, we define a error-handling middleware for handling Express's `errorHandler`. This middleware will handle all requests to nonexistent routes with a 404 status code.

## Routes structure

There are three pseudo resources. Countrie, leagues and teams, each one has it's own controller with request handlers, as indicated in the diagram:

| Method | Route          | Action                 |
| :----- | :------------- | :--------------------- |
| GET    | /countries     | get all countries      |
| GET    | /countries/:id | get particular country |
| POST   | /countries     | add country            |
| PUT    | /countries/:id | update country         |
| DELETE | /countries/:id | remove country         |

## Authentication

Requests are authenticated using the `Authorization` header with a valid JWT. We define an express middleware in `middleware/auth.js` that can be used to authenticate protected requests. Only routes with POST, PUT, REMOVE methods are protected. Routes with GET method are free to use.

The `checkAuth` middleware checks if [jwt token](https://jwt.io/) is present and verifies it. The payload of the JWT can then be accessed from `req.userData` in the endpoint.

So, to get permission you need to signup sending POST request to `/v1/signup` route with your username and password, then login through sending POST request to `/v1/login` route. In return you will get the token starting with `Bearer` according to the [convention](https://swagger.io/docs/specification/authentication/bearer-authentication/). So if you want to have an access to protected routes and regarding to the best practices you need to send following requests with the token in your headers:
`Authorization: Bearer eyJhsInR5cCI3IkpXQGdtYWlsLmNvbSIsInVzZXJJZCI6IjViOGRhNzFlZmE2ZjFmMGEzMDVjMmIxZCIsImlhdCI6MTUzNjAxMdAyMSwiZXhwIjoxNTM2MDEzNjIxfQ.dXtr7Ur0Xv2uCRxwl`
