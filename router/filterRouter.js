import express from "express";
import { getCoursesByPriceAsc, getCoursesByPriceDesc,getCoursesByRatingDesc } from "../controller/filter/filterController.js";

const FilterRouter = express.Router();

FilterRouter.get("/getCoursesByPriceAsc", getCoursesByPriceAsc);
FilterRouter.get("/getCoursesByPriceDesc", getCoursesByPriceDesc);
FilterRouter.get("/getCoursesByRatingDesc", getCoursesByRatingDesc);
export default  FilterRouter;