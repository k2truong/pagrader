# pagrader [![Build Status](https://travis-ci.org/k2truong/pagrader.svg?branch=master)](https://travis-ci.org/k2truong/pagrader)

This is a web application to help save time grading introductory programming assignments. 

<b>Brief description of the problem</b>

1. Students submitted assignments that are stored on a server
2. Tutors SSH into server, compiled and ran each program manually
3. Grades were then individually sent through email to the students and professor

This application helps solve this problem by allowing the professor to log into the application which will then internally SSH into the school's server and run my grading script on the server. The grading script will compile each of the student's program and merge the output/input into a file on the school's server. (We keep these files on the school's server because we are only using heroku's and mlab's free tier so we want to preserve as much space as possible.) Graders are then able to log into the web application and view these files while adding grades/comments that they can submit. 


#Development
## Installation

    npm install

## Environment Variables
1. `MONGOLAB_URI` (You can either point to a local MongoDB or use a free dev tier from https://mlab.com/)
2. `SSH_SERVER_INFO` (This is the SSH Server that the SSH Accounts are used on. Ask me for info)
3. SparkPost (Ask me for info)
4. `SSH_TEST_INFO` (This is the SSH Info to run SSH tests on)

## Development Server

    npm run dev

## Building and Running Production Server

    npm run build
    npm run start

## Testing
For testing client side code

    npm run test

For testing API's (Windows)

    npm run win-test-node

For testing API's (Non-Windows)

    npm run test-node

## Debugging the grading script (Java / C Script)
When trying to debug infinite loop programs please verify that you don't leave any processes running

Check for the processes running by using this command

    ps aux | grep <ACCOUNT>
    
Kill any processes that should not be running

    kill -15 <PID>

## Contributing

Please help contribute by submitting feedback, bugs, or pull requests!

#### Plugins to install with Sublime IDE (Development)

1. Package Control
2. Babel
3. Git
4. Sass
6. SublimeLinter
7. SublimeLinter-contrib-eslint


This uses a boilerplate from https://github.com/erikras/react-redux-universal-hot-example so please take a look here before contributing!
