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

const getGeoTargetByRegion = async (req, res) => {
  try {
    const { trade } = req.query;

    let query = `
      SELECT 
        r.region_name,
        SUM(rt.target_value) as target
      FROM region_targets rt
      JOIN regions r ON rt.region_id = r.id
      WHERE 1=1
    `;

    if (trade) {
      query += ` AND rt.trade='${trade}'`;
    }

    query += ` GROUP BY r.region_name`;

    const rows = await queryAsync(query);

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

const getGeoByCountry = async (req, res) => {
  try {
    const { trade, channel } = req.query;

    let query = `
      SELECT 
        c.country_name,
        SUM(cp.revenue) as revenue
      FROM country_performance cp
      JOIN countries c ON cp.country_id = c.id
      WHERE 1=1
    `;

    if (trade) {
      query += ` AND cp.trade='${trade}'`;
    }

    if (channel) {
      query += ` AND cp.channel='${channel}'`;
    }

    query += ` GROUP BY c.country_name`;

    const rows = await queryAsync(query);

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Youtube Sentiment

const stats = async (req, res) => {
  try {
    const { startDate, endDate, sentiment } = req.query;

    let condition = "WHERE 1=1";

    if (startDate && endDate) {
      condition += ` AND DATE(published_date) BETWEEN '${startDate}' AND '${endDate}'`;
    }

    if (sentiment) {
      condition += ` AND sentiment='${sentiment}'`;
    }

    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(sentiment='positive') as positive,
        SUM(sentiment='negative') as negative,
        SUM(sentiment='neutral') as neutral,
        SUM(like_count) as total_likes
      FROM youtube_sentiments
      ${condition}
    `;

    db.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ success: false, error: err });
      }

      return res.json({
        success: true,
        data: result[0],
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

const chart = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let condition = "WHERE 1=1";

    if (startDate && endDate) {
      condition += ` AND DATE(published_date) BETWEEN '${startDate}' AND '${endDate}'`;
    }

    const query = `
      SELECT sentiment, COUNT(*) as count
      FROM youtube_sentiments
      ${condition}
      GROUP BY sentiment
    `;

    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, error: err });
      }

      return res.json({
        success: true,
        data: result,
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

const trend = async (req, res) => {
  try {
    const query = `
      SELECT 
        DATE(published_date) as date,
        SUM(sentiment='positive') as positive,
        SUM(sentiment='negative') as negative,
        SUM(sentiment='neutral') as neutral
      FROM youtube_sentiments
      GROUP BY DATE(published_date)
      ORDER BY date ASC
    `;

    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, error: err });
      }

      return res.json({
        success: true,
        data: result,
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

const topComments = async (req, res) => {
  try {
    const query = `
      SELECT comment, like_count
      FROM youtube_sentiments
      ORDER BY like_count DESC
      LIMIT 5
    `;

    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, error: err });
      }

      return res.json({
        success: true,
        data: result,
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

const comments = async (req, res) => {
  try {
    const { search, sentiment } = req.query;

    let condition = "WHERE 1=1";

    if (search) {
      condition += ` AND comment LIKE '%${search}%'`;
    }

    if (sentiment) {
      condition += ` AND sentiment='${sentiment}'`;
    }

    const query = `
      SELECT *
      FROM youtube_sentiments
      ${condition}
      ORDER BY published_date DESC
      LIMIT 50
    `;

    db.query(query, (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, error: err });
      }

      return res.json({
        success: true,
        data: result,
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// Twitter APIs
const getSummary = async (req, res) => {
  try {
    const { startDate, endDate, search } = req.query;

    let condition = "WHERE 1=1";

    if (startDate && endDate) {
      condition += ` AND DATE(tweet_date) BETWEEN '${startDate}' AND '${endDate}'`;
    }

    if (search) {
      condition += ` AND content LIKE '%${search}%'`;
    }

    const sql = `
      SELECT 
        COUNT(*) as total_tweets,
        SUM(likes) as total_likes,
        SUM(retweet) as total_retweet,
        SUM(replies) as total_replies,
        SUM(quotes) as total_quotes,
        SUM(views) as total_views
      FROM twitter_data
      ${condition}
    `;

    const result = await new Promise((resolve, reject) => {
      db.query(sql, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });

    res.json({
      success: true,
      data: result[0],
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

const getChart = async (req, res) => {
  try {
    const { startDate, endDate, search } = req.query;

    let condition = "WHERE 1=1";

    if (startDate && endDate) {
      condition += ` AND DATE(tweet_date) BETWEEN '${startDate}' AND '${endDate}'`;
    }

    if (search) {
      condition += ` AND content LIKE '%${search}%'`;
    }

    const sql = `
      SELECT 
        DATE(tweet_date) as date,
        SUM(likes) as likes,
        SUM(retweet) as retweet,
        SUM(replies) as replies,
        SUM(quotes) as quotes,
        SUM(views) as views
      FROM twitter_data
      ${condition}
      GROUP BY DATE(tweet_date)
      ORDER BY DATE(tweet_date)
    `;

    const result = await new Promise((resolve, reject) => {
      db.query(sql, (err, data) => {
        if (err) return reject(err);
        resolve(data);
      });
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

module.exports = {
  getRevenueByRegion,
  getRevenueByCountry,
  getRevenueTrend,
  getTargetVsRevenueByRegion,
  getGeoTargetByRegion,
  getGeoByCountry,
  stats,
  chart,
  trend,
  topComments,
  comments,
  getSummary,
  getChart,
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