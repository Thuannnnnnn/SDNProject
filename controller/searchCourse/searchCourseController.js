import Course from "../../model/course/courseModel.js";

export const searchCourse = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const courses = await Course.find({
      $or: [
        { courseName: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    });

    if (!courses) {
      return res.status(404).json({ message: 'No courses found' });
    }

    const coursesWithImage = courses.map(course => ({
      ...course._doc,
      posterLink: course.posterLink,
    }));

    if (!coursesWithImage) {
      return res.status(500).json({ message: 'Unable to process search results' });
    }

    res.json(coursesWithImage);
  } catch (error) {
    console.error('Error searching courses:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
