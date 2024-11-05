import Course from "../../model/course/courseModel.js";
import FeedbackAndRating from "../../model/rating/feedbackAndRatingModel.js";

export const getCoursesByPriceDesc = async (req, res) => {
  try {
    const courses = await Course.find().sort({ price: -1 });

    if (!courses.length) {
      return res.status(404).json({ message: "No courses found" });
    }

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses by price (desc):", error);
    res.status(500).json({ message: "Server error" });
  }
};
export const getCoursesByPriceAsc = async (req, res) => {
  try {
    const courses = await Course.find().sort({ price: 1 });

    if (!courses.length) {
      return res.status(404).json({ message: "No courses found" });
    }

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses by price (asc):", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCoursesByRatingDesc = async (req, res) => {
  try {
    // Aggregate để tính tổng điểm và số lượng đánh giá cho mỗi khóa học
    const ratings = await FeedbackAndRating.aggregate([
      {
        $group: {
          _id: "$courseId",
          totalRatingPoints: { $sum: "$ratingPoint" },
          ratingCount: { $sum: 1 },
        },
      },
      {
        $project: {
          averageRating: { $divide: ["$totalRatingPoints", "$ratingCount"] },
        },
      },
      { $sort: { averageRating: -1 } } // Sắp xếp giảm dần theo averageRating
    ]);

    // Lấy danh sách courseId đã sắp xếp
    const courseIds = ratings.map((rating) => rating._id);

    // Lấy thông tin chi tiết các khóa học theo thứ tự đã sắp xếp
    const courses = await Course.find({ courseId: { $in: courseIds } });

    // Sắp xếp lại theo thứ tự averageRating dựa trên thứ tự trong `ratings`
    const coursesWithRating = courseIds.map(courseId => {
      const course = courses.find(c => c.courseId === courseId);
      const ratingInfo = ratings.find(r => r._id === courseId);
      return {
        ...course._doc,
        averageRating: ratingInfo ? ratingInfo.averageRating : null,
      };
    });

    res.json(coursesWithRating);
  } catch (error) {
    console.error("Error fetching courses by rating:", error);
    res.status(500).json({ message: "Server error" });
  }
};

