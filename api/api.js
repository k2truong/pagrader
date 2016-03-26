import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import config from '../src/config';
import * as actions from './actions/index';
import {mapUrl} from './utils/url.js';
import PrettyError from 'pretty-error';
import http from 'http';
import SocketIo from 'socket.io';
import secrets from './config/secrets.js';
import passport from 'passport';
import initPassport from './passport/init';
import mongoose from 'mongoose';
import { closeSSHConnection } from './ssh/connection';

const isProd = process.env.NODE_ENV === 'production';
const pretty = new PrettyError();

const app = express();
const server = new http.Server(app);
const io = new SocketIo(server);
io.path('/ws');

export default new Promise((resolve, reject) => {
  mongoose.connect(secrets.db, (dbErr) => {
    if (dbErr) {
      console.log('MongoDB ERROR: Could not connect to ' + secrets.db);
      console.log(dbErr);
      reject(dbErr);
    } else {
      console.log('==> 💻  Mongoose connected to ' + secrets.db);

      if (isProd) {
        app.set('trust proxy', 1);
      }

      app.use(session({
        secret: secrets.session,
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 60000,
          secure: isProd
        },
      }));

      app.use(bodyParser.json());

      app.use(passport.initialize());
      app.use(passport.session());

      // Initialize Passport
      initPassport(passport);

      app.use((req, res) => {
        const splittedUrlPath = req.url.split('?')[0].split('/').slice(1);

        const {action, params} = mapUrl(actions, splittedUrlPath);

        if (action) {
          action(req, params)
            .then((result) => {
              if (result instanceof Function) {
                result(res);
              } else {
                res.json(result);
              }
            }, (reason) => {
              if (reason && reason.redirect) {
                res.redirect(reason.redirect);
              } else {
                console.error('API ERROR:', pretty.render(reason));
                res.status(reason.status || 500).json(reason);
              }
            });
        } else {
          res.status(404).end('NOT FOUND');
        }
      });

      const bufferSize = 100;
      const messageBuffer = new Array(bufferSize);
      let messageIndex = 0;

      if (config.apiPort) {
        const runnable = app.listen(config.apiPort, (err) => {
          if (err) {
            console.error(err);
          }
          console.info('----\n==> 🌎  API is running on port %s', config.apiPort);
          console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort);
          resolve(runnable);
        });

        io.on('connection', (socket) => {
          socket.emit('news', {msg: `'Hello World!' from server`});

          socket.on('history', () => {
            for (let index = 0; index < bufferSize; index++) {
              const msgNo = (messageIndex + index) % bufferSize;
              const msg = messageBuffer[msgNo];
              if (msg) {
                socket.emit('msg', msg);
              }
            }
          });

          // sshConnections();
          // console.log(`${socket.id} Connected from Socket --------`);
          socket.on('disconnect', () => {
            closeSSHConnection(socket.id);
            // console.log(`${socket.id} Disconnected from Socket --------`);
          });

          socket.on('msg', (data) => {
            data.id = messageIndex;
            messageBuffer[messageIndex % bufferSize] = data;
            messageIndex++;
            io.emit('msg', data);
          });
        });

        runnable.on('close', () => {
          mongoose.disconnect();
        });

        io.listen(runnable);
        // const socketListener = io.listen(runnable);
        // socketListener.set('authorization', (handshakeData, accept) => {
        //   console.log('Logged in~~~~~~');
        //   // if (handshakeData.headers.cookie) {
        //   //   handshakeData.cookie = cookie.parse(handshakeData.headers.cookie);
        //   //   handshakeData.sessionID = connect.utils.parseSignedCookie(handshakeData.cookie['express.sid'], 'secret');
        //   //   if (handshakeData.cookie['express.sid'] === handshakeData.sessionID) {
        //   //     return accept('Cookie is invalid.', false);
        //   //   }
        //   // } else {
        //   //   return accept('No cookie transmitted.', false);
        //   // }
        //   accept(null, true);
        // });
      } else {
        console.error('==>     ERROR: No PORT environment variable has been specified');
      }
    }
  });
});
