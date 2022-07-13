import express from "express";
import bodyParser from "body-parser";

import index from "../controllers/index";

export default express.Router()
    .use(bodyParser.json())
    .get('/', index)
;