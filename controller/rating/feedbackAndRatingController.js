import FeedbackAndRating from '../../model/rating/feedbackAndRatingModel.js';
import mongoose from 'mongoose';

// Create a new rating
export const createRating = async (req, res) => {
  const { userEmail, ratingPoint, courseId, feedback } = req.body;

  if (typeof ratingPoint !== 'number' || ratingPoint < 1 || ratingPoint > 5) {
    return res.status(400).json({ message: 'ratingPoint must be a number between 1 and 5' });
  }

  if (typeof feedback !== 'string') {
    return res.status(400).json({ message: 'feedback must be a string' });
  }

  try {
    const newRating = new FeedbackAndRating({
      _id: new mongoose.Types.ObjectId(),
      userEmail,
      ratingPoint,
      courseId,
      feedback,
    });

    await newRating.save();
    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: 'Error creating rating', error: error.message });
  }
};

// Calculate average rating for a course
export const getAverageRatingForCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const ratings = await FeedbackAndRating.find({ courseId });

    if (ratings.length === 0) {
      
      return res.status(404).json({ message: 'No ratings found for this course' });
    }

    const totalPoints = ratings.reduce((sum, rating) => sum + rating.ratingPoint, 0);
    const averageRating = totalPoints / ratings.length;

    res.status(200).json({
      courseId,
      totalRatings: ratings.length,
      averageRating: averageRating.toFixed(2)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating average rating', error: error.message });
  }
};

// Check if user has provided feedback and rating for a course
export const hasUserProvidedFeedbackAndRating = async (req, res) => {
  const { userEmail, courseId } = req.params;

  try {
    const rating = await FeedbackAndRating.findOne({ userEmail, courseId });

    if (!rating) {
      return res.status(200).json({ hasProvidedFeedbackAndRating: false });
    }

    res.status(200).json({ hasProvidedFeedbackAndRating: true });
  } catch (error) {
    res.status(500).json({ message: 'Error checking feedback and rating', error: error.message });
  }
};

// Get rating by user email
export const getRatingByUserEmail = async (req, res) => {
  const { userEmail } = req.params;

  try {
    const ratings = await FeedbackAndRating.find({ userEmail });

    if (ratings.length === 0) {
      return res.status(404).json({ message: 'No ratings found for this user' });
    }

    res.status(200).json(ratings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ratings', error: error.message });
  }
};

// Get the number of ratings of each type from 1 to 5
export const getRatingsCountByType = async (req, res) => {
  const { courseId } = req.params;

  try {
    const ratings = await FeedbackAndRating.find({ courseId });

    if (ratings.length === 0) {
      return res.status(404).json({ message: 'No ratings found for this course' });
    }

    const ratingsCount = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    ratings.forEach(rating => {
      ratingsCount[rating.ratingPoint]++;
    });

    res.status(200).json(ratingsCount);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ratings count', error: error.message });
  }
};

// Update an existing rating
export const updateRating = async (req, res) => {
  const { ratingId } = req.params;
  const { ratingPoint, comment } = req.body;

  if (typeof ratingPoint !== 'number' || ratingPoint < 1 || ratingPoint > 5) {
    return res.status(400).json({ message: 'ratingPoint must be a number between 1 and 5' });
  }

  try {
    const updatedRating = await FeedbackAndRating.findByIdAndUpdate(
      ratingId,
      { ratingPoint, comment, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedRating) {
      return res.status(404).json({ message: 'Rating not found' });
    }

    res.status(200).json(updatedRating);
  } catch (error) {
    res.status(500).json({ message: 'Error updating rating', error: error.message });
  }
};