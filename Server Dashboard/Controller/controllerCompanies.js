const { db } = require("./../connect");
const moment = require("moment-timezone");

const getCompanyFeatures = (req, res) => {
  const { company_id } = req.params;

  if (!company_id) {
    return res.status(400).json({
      status: "fail",
      message: "company_id required",
    });
  }

  db.query(
    `SELECT 
      business_analytics,
      instagram_enabled,
      facebook_enabled,
      twitter_enabled,
      youtube_enabled
    FROM company_features
    WHERE company_id = ?`,
    [company_id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({
          status: "error",
          message: err.message,
        });
      }

      if (!rows.length) {
        // No record found, return database column defaults (all ON)
        return res.json({
          status: "success",
          data: {
            business_analytics: 1,
            instagram_enabled: 1,
            facebook_enabled: 1,
            twitter_enabled: 1,
            youtube_enabled: 1,
          },
        });
      }

      return res.json({
        status: "success",
        data: rows[0],
      });
    }
  );
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
        // Record does not exist, insert a new one
        const createdAt = updatedAt;
        return db.query(
          `INSERT INTO company_features 
           (company_id, business_analytics, instagram_enabled, facebook_enabled, twitter_enabled, youtube_enabled, created_at, updated_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            company_id,
            business_analytics !== undefined ? business_analytics : 1,
            instagram_enabled !== undefined ? instagram_enabled : 1,
            facebook_enabled !== undefined ? facebook_enabled : 1,
            twitter_enabled !== undefined ? twitter_enabled : 1,
            youtube_enabled !== undefined ? youtube_enabled : 1,
            createdAt,
            updatedAt
          ],
          (insertErr) => {
            if (insertErr) {
              return res.status(500).json({
                status: "error",
                message: insertErr.message,
              });
            }
            return res.json({
              status: "success",
              message: "Features created successfully",
              updated_at: updatedAt,
            });
          }
        );
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