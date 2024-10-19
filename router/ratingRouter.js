import express from 'express';
import { createRating, getAverageRatingForCourse, hasUserProvidedFeedbackAndRating, getRatingByUserEmail, getRatingsCountByType, updateRating } from '../controller/rating/feedbackandRatingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const ratingRouter = express.Router();

// Create a new rating
ratingRouter.post('/', authMiddleware, createRating);



ratingRouter.get('/course/:courseId/average',authMiddleware , getAverageRatingForCourse);


// Check if user has provided feedback and rating for a course
ratingRouter.get('/has-provided/:userEmail/:courseId', authMiddleware, hasUserProvidedFeedbackAndRating);

// Get rating by user email
ratingRouter.get('/userRating/:userEmail', authMiddleware, getRatingByUserEmail);

// Get the number of ratings of each type from 1 to 5
ratingRouter.get('/course/:courseId/ratings-count', authMiddleware, getRatingsCountByType);

// Update an existing rating
ratingRouter.put('/:ratingId', authMiddleware, updateRating);

export default ratingRouter;