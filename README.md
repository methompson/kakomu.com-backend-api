#node-express-blog

A blog written in Node.js, with Express, wrapped in a Docker container for easy deployment.

Installation Steps:
Change the global.jwtSecret to something random or long in app.js
Change the run from start-dev to start in docker-compose.yml
Update the mysql password in environment in docker-compose.yml
Run each migration in the migrations folder in order in the mysql docker environment
Update the password in db.js to match the password in docker-compose.yml
run npm i in the backend/app folder to install all dependencies

TODOs: Update the program to use a production environment variable