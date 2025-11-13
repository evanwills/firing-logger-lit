
import { nanoid } from 'nanoid';

// const offset = -60000; // 1 minute in the past
// const offset = 10000; // 10 seconds in the future
// const offset = 300000; // 5 minutes in the future
const offset = 1800000; // 30 minutes in the future

const userID = 'wfj_myxTAVfy';
// const userID = nanoid();

const cookieName = 'SessionID';


export default {
  plugins: [
    {
      name: 'set-session-cookie',
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          // Only set for certain routes if you want

          const expires = new Date(Date.now() + offset).toUTCString();

          res.setHeader(
            'Set-Cookie',
            [
              `UserID=${userID}; expires=${expires}; Path=/; SameSite=Strict`,
              `${cookieName}=${nanoid()}; expires=${expires}; Path=/; HttpOnly; SameSite=Strict`,

              // `${cookieName}Kilns=${userID}; expires=${expires}; Path=/kilns;`,
              // `${cookieName}Firings=${userID}; expires=${expires}; Path=/firings;`,
              // `${cookieName}Programs=${userID}; expires=${expires}; Path=/programs;`,
            ],
          );
          next();
        });
      },
    },
  ],
  server: {
    port: 5181,
  },
};
