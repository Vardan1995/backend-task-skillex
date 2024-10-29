import Routes from './router.js';
import * as express from 'express';


export default (apiRouter) => {
    const router = express.Router();
    apiRouter.use('/combinations', router);
    Routes(router);
};
