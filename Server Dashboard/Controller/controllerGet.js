const { db } = require("./../connect");


const getAllStudent = async (req, res) => {
  try {
    const query = `SELECT * FROM users ORDER BY id DESC `;

    db.query(query, (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({
          status: "Failure",
          message: "Database error occurred",
          error: err.message,
        });
      }

      return res.status(200).json({
        status: "Success",
        message: "All User fetched successfully",
        count: results.length,
        data: results,
      });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      status: "Failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
getAllStudent
};