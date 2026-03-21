const { db } = require("./../connect");
const dotenv = require("dotenv");
const moment = require("moment-timezone");

const queryAsync = (query) => {
  return new Promise((resolve, reject) => {
    db.query(query, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// const getRevenueByRegion = async (req, res) => {
//   try {
//     const query = `
//     SELECT r.region_name,
//     SUM(cp.revenue) as revenue
//     FROM country_performance cp
//     JOIN countries c ON cp.country_id = c.id
//     JOIN regions r ON c.region_id = r.id
//     GROUP BY r.region_name
//     `;

//     const rows = await queryAsync(query);

//     res.status(200).json(rows);
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       message: "Server Error",
//       error: error.message,
//     });
//   }
// };

// const getRevenueByCountry = async (req, res) => {
//   try {
//     const query = `
//       SELECT c.country_name,
//       SUM(cp.revenue) as revenue
//       FROM country_performance cp
//       JOIN countries c ON cp.country_id = c.id
//       GROUP BY c.country_name
//       ORDER BY revenue DESC
//     `;

//     const rows = await queryAsync(query);

//     res.status(200).json(rows);

//   } catch (error) {

//     console.error(error);

//     res.status(500).json({
//       message: "Server Error",
//       error: error.message,
//     });

//   }
// };

// const getRevenueTrend = async (req, res) => {
//   try {

//     const query = `
//       SELECT month, channel, SUM(revenue) revenue
//       FROM country_performance
//       GROUP BY month, channel
//       ORDER BY month
//     `;

//     const rows = await queryAsync(query);

//     res.status(200).json(rows);

//   } catch (error) {

//     console.error(error);

//     res.status(500).json({
//       message: "Server Error",
//       error: error.message,
//     });

//   }
// };

const getRevenueByRegion = async (req, res) => {
  try {
    const { country, region, trade, channel } = req.query;

    let query = `
    SELECT r.region_name,
    SUM(cp.revenue) as revenue
    FROM country_performance cp
    JOIN countries c ON cp.country_id = c.id
    JOIN regions r ON c.region_id = r.id
    WHERE 1=1
    `;

    if (country) {
      query += ` AND c.country_name='${country}'`;
    }

    if (region) {
      query += ` AND r.region_name='${region}'`;
    }

    if (trade) {
      query += ` AND cp.trade='${trade}'`;
    }

    if (channel) {
      query += ` AND cp.channel='${channel}'`;
    }

    query += ` GROUP BY r.region_name`;

    const rows = await queryAsync(query);

    res.status(200).json(rows);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getRevenueByCountry = async (req, res) => {
  try {
    const { country, region, trade, channel } = req.query;

    let query = `
      SELECT c.country_name,
      SUM(cp.revenue) as revenue
      FROM country_performance cp
      JOIN countries c ON cp.country_id = c.id
      JOIN regions r ON c.region_id = r.id
      WHERE 1=1
    `;

    if (country) {
      query += ` AND c.country_name='${country}'`;
    }

    if (region) {
      query += ` AND r.region_name='${region}'`;
    }

    if (trade) {
      query += ` AND cp.trade='${trade}'`;
    }

    if (channel) {
      query += ` AND cp.channel='${channel}'`;
    }

    query += `
      GROUP BY c.country_name
      ORDER BY revenue DESC
    `;

    const rows = await queryAsync(query);

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getRevenueTrend = async (req, res) => {
  try {
    const { country, region, trade, channel } = req.query;

    let query = `
      SELECT month, channel, SUM(revenue) revenue
      FROM country_performance cp
      JOIN countries c ON cp.country_id = c.id
      JOIN regions r ON c.region_id = r.id
      WHERE 1=1
    `;

    if (country) {
      query += ` AND c.country_name='${country}'`;
    }

    if (region) {
      query += ` AND r.region_name='${region}'`;
    }

    if (trade) {
      query += ` AND cp.trade='${trade}'`;
    }

    if (channel) {
      query += ` AND cp.channel='${channel}'`;
    }

    query += `
      GROUP BY month, channel
      ORDER BY month
    `;

    const rows = await queryAsync(query);

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getTargetVsRevenueByRegion = async (req, res) => {
  try {
    const { country, region, trade, channel } = req.query;

    let query = `
      SELECT 
        r.region_name,
        SUM(cp.revenue) AS revenue,
        SUM(rt.target_value) AS target
      FROM regions r
      LEFT JOIN countries c ON r.id = c.region_id
      LEFT JOIN country_performance cp ON cp.country_id = c.id
      LEFT JOIN region_targets rt ON rt.region_id = r.id
      WHERE 1=1
    `;

    // 🔥 Filters (same as your other APIs)
    if (country) {
      query += ` AND c.country_name='${country}'`;
    }

    if (region) {
      query += ` AND r.region_name='${region}'`;
    }

    if (trade) {
      query += ` AND cp.trade='${trade}'`;
    }

    if (channel) {
      query += ` AND cp.channel='${channel}'`;
    }

    query += ` GROUP BY r.region_name`;

    const rows = await queryAsync(query);

    res.status(200).json(rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

module.exports = {
  getRevenueByRegion,
  getRevenueByCountry,
  getRevenueTrend,
  getTargetVsRevenueByRegion
};
