import { createCombinations } from './controller.js';
export default (router) => {
    // ----------------------------------------------------------------------------------------------
    router.post('/', createCombinations);
    // ----------------------------------------------------------------------------------------------
};