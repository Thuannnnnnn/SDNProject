import CoursePurchased from '../../model/coursePurchased/coursePurchasedModel.js';
import { v4 as uuidv4 } from 'uuid';

export const addCoursePurchase = async (req, res) => {
  const { userEmail, courseId } = req.body;
  if (!courseId) {
    return res.status(400).json({ message: 'Course ID is required.' });
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

    res.status(201).json({ message: 'Course purchased successfully.', coursePurchase });
  } catch (error) {
    res.status(500).json({ message: 'Error purchasing course.', error });
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
  const { email } = req.params;

  try {
    const coursePurchases = await CoursePurchased.find({ userEmail: email }).populate('courses._id');

    if (coursePurchases.length === 0) {
      return res.status(404).json({ message: 'No course purchases found for this email' });
    }

    res.status(200).json(coursePurchases);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
