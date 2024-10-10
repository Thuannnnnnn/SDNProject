import CoursePurchased from '../../model/coursePurchased/coursePurchasedModel.js';
import { v4 as uuidv4 } from 'uuid';
export const addCoursePurchase = async (userEmail, courseId) => {
  if (!courseId) {
    return false;
  }
  try {
    let coursePurchase = await CoursePurchased.findOne({ userEmail });
    if (coursePurchase) {
      coursePurchase.courses.push({ courseId });
      await coursePurchase.save();
    } else {

      coursePurchase = new CoursePurchased({
        purchaseId: uuidv4(),
        userEmail,
        courses: [{ courseId }],
      });
      await coursePurchase.save();
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getAllCoursePurchases = async (req, res) => {
  try {
    const coursePurchases = await CoursePurchased.find().populate('courses._id');
    res.status(200).json(coursePurchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getCoursePurchaseById = async (req, res) => {
  try {
    const coursePurchase = await CoursePurchased.findById(req.params.id).populate('courses._id');
    if (!coursePurchase) {
      return res.status(404).json({ message: 'Course purchase not found' });
    }
    res.status(200).json(coursePurchase);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCoursePurchase = async (req, res) => {
  try {
    const coursePurchase = await CoursePurchased.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coursePurchase) {
      return res.status(404).json({ message: 'Course purchase not found' });
    }
    res.status(200).json(coursePurchase);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const deleteCoursePurchase = async (req, res) => {
  try {
    const coursePurchase = await CoursePurchased.findByIdAndDelete(req.params.id);
    if (!coursePurchase) {
      return res.status(404).json({ message: 'Course purchase not found' });
    }
    res.status(204).send({message:'Delete successfull'});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getCoursePurchasesByEmail = async (req, res) => {
  try {
    const email  = req.params.email;
    // Find course purchases by user email and populate course details
    const coursePurchases = await CoursePurchased.findOne({ userEmail: email }).populate(
      "courses.courseId" // Populates course details from the Course model
    );

    if (!coursePurchases) {
      return res.status(404).json({ message: "No course purchases found for this email" });
    }
    res.status(200).json({
      CoursePurchases: {
        ...coursePurchases.toObject(),
        courses: coursePurchases.courses || [],
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error occurred while finding course purchases!",
      Error: error.message || "Unknown error",
    });
  }
};
export const checkCourseOwnership = async (req, res) => {
  try {
    const userEmail = req.params.email;
    const courseId = req.params.courseId;
    const coursePurchase = await CoursePurchased.findOne({
      userEmail: userEmail,
      'courses.courseId': courseId
    });
    if (!coursePurchase) {
      return res.status(200).json({ ownsCourse: false });
    }
    return res.status(200).json({ ownsCourse: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};