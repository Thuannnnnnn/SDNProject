import * as searchCourse from "../controller/searchCourse/searchCourseController.js";
import express from "express";

export const search = express.Router();

search.get('/searchCourse', searchCourse.searchCourse);