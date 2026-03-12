# End of Module Project

## Project Description
This is a post manager with the ability to add comment, moderate, use tags, have notifications...

## You need : 
node.js, nestjs

## Installation : 
Clone from github, run "npm i" from the root of the project, create a .env file with the following structure : 
PORT=
DATABASE_URL=
NODE_ENV=

You can also run "npm run seed" create a database with basic informations

run "npm run build" 

## Documentation
Use "/api#/" to get to the documentation

## Seed data : 
Users : 
admin => username = admin, password = admin
moderator => username = moderator, password = moderator
writer => username = writer, password = writer

## Tests

"npm run test"
NOTE : I had a problem where i couldn't do e2e tests because of an incompatibility between jest and v4, instead I did 5 route tests and 3 more unit tests