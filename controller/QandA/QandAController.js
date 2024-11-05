import QandA from "../../model/QandA/QandA.js";
export const createQandA = async (req, res) => {
  try {
    const { courseId, userEmail, QandAText } = req.body;


    if (!courseId || !userEmail) {
      return res.status(400).json({ message: "Missing required fields" });
    }


    if (courseId === null || courseId === undefined) {
      return res.status(400).json({ message: "courseId cannot be null or undefined" });
    }


    const newQandA = new QandA({
      courseId,
      userEmail,
      QandAText,
    });

    const savedQandA = await newQandA.save();
    res.status(201).json({
      message: "QandA created successfully!",
      QandA: savedQandA,
    });
  } catch (error) {

    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate key error: " + error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

export const getQandAByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;

    const qandas = await QandA.find({ courseId: courseId });
    res.status(200).json(qandas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQandAByUserEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const qandas = await QandA.find({ userEmail: email });

    if (!qandas || qandas.length === 0) {
      return res.status(404).json({ message: "No QandA found for this email." });
    }

    res.status(200).json(qandas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllQandA = async (req, res) => {
  try {

    const qandas = await QandA.find();

    if (qandas.length === 0) {
      return res.status(404).json({ message: "No QandA found." });
    }

    res.status(200).json(qandas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateQandA = async (req, res) => {
  try {
    const { id } = req.params;
    const { courseId, userEmail, QandAText } = req.body;


    const qanda = await QandA.findById(id);

    if (!qanda) {
      return res.status(404).json({ message: "QandA not found" });
    }

    qanda.courseId = courseId || qanda.courseId;
    qanda.userEmail = userEmail || qanda.userEmail;
    qanda.QandAText = QandAText || qanda.QandAText;

    const updatedQandA = await qanda.save();
    res.status(200).json({
      message: "QandA updated successfully!",
      QandA: updatedQandA,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const replyToQandA = async (req, res) => {
  try {
    const { QandAId } = req.params;
    const { replyText, repliedBy } = req.body;

    if (!replyText || !repliedBy) {
      return res.status(400).json({ message: "Missing required fields" });
    }


    const qanda = await QandA.findById(QandAId);
    if (!qanda) {
      return res.status(404).json({ message: "QandA not found" });
    }

    qanda.replies.push({
      replyText,
      repliedBy,
    });

    const updatedQandA = await qanda.save();
    res.status(200).json({
      message: "Reply added successfully!",
      QandA: updatedQandA,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a reply within a Q&A
export const updateQandAReply = async (req, res) => {
  try {
    const { QandAId, replyId } = req.params;
    const { replyText } = req.body;

    // Tìm QandA theo QandAId
    const qanda = await QandA.findById(QandAId);
    if (!qanda) return res.status(404).json({ message: "QandA not found" });

    // Tìm reply dựa trên replyId tùy chỉnh
    const reply = qanda.replies.find(reply => reply.replyId === replyId);
    if (!reply) return res.status(404).json({ message: "Reply not found" });

    // Cập nhật replyText
    reply.replyText = replyText || reply.replyText;

    // Lưu thay đổi
    const updatedQandA = await qanda.save();
    res.status(200).json({ message: "Reply updated successfully!", QandA: updatedQandA });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteQandA = async (req, res) => {
  try {
    const { id } = req.params;

    const qanda = await QandA.findByIdAndDelete(id);

    if (!qanda) {
      return res.status(404).json({ message: "QandA not found" });
    }

    res.status(200).json({ message: "QandA deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteQandAReply = async (req, res) => {
  try {
    const { QandAId, replyId } = req.params;


    const qanda = await QandA.findById(QandAId);
    if (!qanda) {
      return res.status(404).json({ message: "QandA not found" });
    }


    const replyIndex = qanda.replies.findIndex((reply) => reply.replyId === replyId);
    if (replyIndex === -1) {
      return res.status(404).json({ message: "Reply not found" });
    }


    qanda.replies.splice(replyIndex, 1);


    const updatedQandA = await qanda.save();
    res.status(200).json({
      message: "Reply deleted successfully!",
      QandA: updatedQandA,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
