const { db } = require("./../connect");
const moment = require("moment-timezone");

const getCompanyFeatures = async (req, res) => {
  try {
    const { company_id } = req.params;

    if (!company_id) {
      return res.status(400).json({
        status: "fail",
        message: "company_id required",
      });
    }

    const [rows] = await db.promise().query(
      `SELECT 
        business_analytics,
        instagram_enabled,
        facebook_enabled,
        twitter_enabled,
        youtube_enabled
      FROM company_features
      WHERE company_id = ?`,
      [company_id]
    );

    if (!rows.length) {
      return res.status(404).json({
        status: "fail",
        message: "Features not found",
      });
    }

    res.json({
      status: "success",
      data: rows[0],
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const updateCompanyFeatures = (req, res) => {
  const { company_id } = req.params;

  if (!company_id) {
    return res.status(400).json({
      status: "fail",
      message: "company_id required",
    });
  }

  const {
    business_analytics,
    instagram_enabled,
    facebook_enabled,
    twitter_enabled,
    youtube_enabled,
  } = req.body;

  const updatedAt = moment()
    .tz("Asia/Kolkata")
    .format("YYYY-MM-DD HH:mm:ss");

  // check record exists
  db.query(
    "SELECT id FROM company_features WHERE company_id = ?",
    [company_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: err.message,
        });
      }

      if (!result.length) {
        return res.status(404).json({
          status: "fail",
          message: "Company features not found",
        });
      }

      const fields = [];
      const values = [];

      if (business_analytics !== undefined) {
        fields.push("business_analytics = ?");
        values.push(business_analytics);
      }

      if (instagram_enabled !== undefined) {
        fields.push("instagram_enabled = ?");
        values.push(instagram_enabled);
      }

      if (facebook_enabled !== undefined) {
        fields.push("facebook_enabled = ?");
        values.push(facebook_enabled);
      }

      if (twitter_enabled !== undefined) {
        fields.push("twitter_enabled = ?");
        values.push(twitter_enabled);
      }

      if (youtube_enabled !== undefined) {
        fields.push("youtube_enabled = ?");
        values.push(youtube_enabled);
      }

      // always update updated_at
      fields.push("updated_at = ?");
      values.push(updatedAt);

      values.push(company_id);

      db.query(
        `UPDATE company_features SET ${fields.join(", ")} WHERE company_id = ?`,
        values,
        (updateErr) => {
          if (updateErr) {
            return res.status(500).json({
              status: "error",
              message: updateErr.message,
            });
          }

          return res.json({
            status: "success",
            message: "Features updated successfully",
            updated_at: updatedAt,
          });
        }
      );
    }
  );
};


module.exports = { getCompanyFeatures, updateCompanyFeatures };