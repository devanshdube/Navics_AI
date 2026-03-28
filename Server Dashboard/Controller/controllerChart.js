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

const getGeoByCity = async (req, res) => {
  try {
    let query = `
      SELECT 
        s.city,
        SUM(rt.target_value) as target
      FROM region_targets rt
      JOIN stores s ON rt.store_name = s.store_name
      WHERE rt.target_measure = 'Container'  -- 🔥 ya 'Revenue'
      GROUP BY s.city
    `;

    const rows = await queryAsync(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const { country, region, trade, channel } = req.query;

    let condition = "WHERE 1=1";

    if (country) condition += ` AND c.country_name='${country}'`;
    if (region) condition += ` AND r.region_name='${region}'`;
    if (trade) condition += ` AND cp.trade='${trade}'`;
    if (channel) condition += ` AND cp.channel='${channel}'`;

    // 🔹 Total Revenue
    const revenueQuery = `
      SELECT SUM(cp.revenue) as totalRevenue
      FROM country_performance cp
      JOIN countries c ON cp.country_id = c.id
      JOIN regions r ON c.region_id = r.id
      ${condition}
    `;

    // 🔹 Current & Previous Month Revenue
    const momQuery = `
      SELECT 
        month,
        SUM(revenue) as revenue
      FROM country_performance cp
      JOIN countries c ON cp.country_id = c.id
      JOIN regions r ON c.region_id = r.id
      ${condition}
      GROUP BY month
      ORDER BY month DESC
      LIMIT 2
    `;

    // 🔹 Total Target
    const targetQuery = `
      SELECT SUM(rt.target_value) as totalTarget
      FROM region_targets rt
      JOIN regions r ON rt.region_id = r.id
      WHERE rt.target_measure='Revenue'
    `;

    // 🔹 Top Country
    const topQuery = `
      SELECT c.country_name, SUM(cp.revenue) as revenue
      FROM country_performance cp
      JOIN countries c ON cp.country_id = c.id
      JOIN regions r ON c.region_id = r.id
      ${condition}
      GROUP BY c.country_name
      ORDER BY revenue DESC
      LIMIT 1
    `;

    const totalRevenue = await queryAsync(revenueQuery);
    const momData = await queryAsync(momQuery);
    const totalTarget = await queryAsync(targetQuery);
    const topCountry = await queryAsync(topQuery);

    // 🔥 MOM calculation
    let mom = 0;
    if (momData.length === 2) {
      const current = momData[0].revenue;
      const previous = momData[1].revenue;
      mom = ((current - previous) / previous) * 100;
    }

    res.json({
      totalRevenue: totalRevenue[0]?.totalRevenue || 0,
      totalTarget: totalTarget[0]?.totalTarget || 0,
      mom: mom.toFixed(2),
      top: topCountry[0]?.country_name || "-"
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
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

// const sentimentChartByVideo = async (req, res) => {
//   try {
//     const { videoId } = req.query;

//     if (!videoId) {
//       return res.status(400).json({
//         success: false,
//         message: "videoId is required"
//       });
//     }

//     const query = `
//       SELECT 
//         sentiment,
//         COUNT(*) as count
//       FROM youtube_sentiments
//       WHERE video_id = ?
//       GROUP BY sentiment
//     `;

//     db.query(query, [videoId], (err, result) => {
//       if (err) {
//         return res.status(500).json({ success: false, error: err });
//       }

//       // Ensure all sentiments exist (important for chart)
//       const formatted = {
//         positive: 0,
//         negative: 0,
//         neutral: 0
//       };

//       result.forEach(item => {
//         formatted[item.sentiment] = item.count;
//       });

//       return res.json({
//         success: true,
//         data: formatted
//       });
//     });

//   } catch (error) {
//     res.status(500).json({ success: false, error });
//   }
// };

const sentimentByVideo = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let condition = "WHERE 1=1";
    let values = [];

    // Date filter (safe)
    if (startDate && endDate) {
      condition += " AND DATE(published_date) BETWEEN ? AND ?";
      values.push(startDate, endDate);
    }

    const query = `
      SELECT 
        video_id,
        SUM(sentiment='positive') as positive,
        SUM(sentiment='negative') as negative,
        SUM(sentiment='neutral') as neutral
      FROM youtube_sentiments
      ${condition}
      GROUP BY video_id
      ORDER BY video_id ASC
    `;

    db.query(query, values, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          error: err,
        });
      }

      return res.json({
        success: true,
        data: result,
      });
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error,
    });
  }
};

// ** Twitter APIs **
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

const getTweetAnalytics = async (req, res) => {
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
        tweet_id,
        DATE(tweet_date) as tweet_date,
        likes,
        retweet,
        replies,
        views
      FROM twitter_data
      ${condition}
      ORDER BY tweet_date ASC
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

// **  facebook APIs ** 
// KPI API
const getKPI = (req, res) => {
  const { page } = req.query;
  let condition = "";
  let params = [];

  if (page) {
    condition = `WHERE page_name = ?`;
    params.push(page);
  }

  const sql = `
    SELECT 
      COUNT(*) as total_posts,
      SUM(likes) as total_likes,
      SUM(comments) as total_comments,
      SUM(shares) as total_shares
    FROM facebook_data
    ${condition}
  `;

  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result[0]);
  });
};

// Top Posts
const getTopPosts = (req, res) => {
  const { page, sort = "likes" } = req.query;

  let condition = "";
  if (page) {
    condition = `WHERE page_name='${page}'`;
  }

  const sql = `
    SELECT postname, likes, comments, shares
    FROM facebook_data
    ${condition}
    ORDER BY ${sort} DESC
    LIMIT 10
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// Engagement
const getEngagement = (req, res) => {
  const { page } = req.query;

  let condition = "";
  if (page) {
    condition = `WHERE page_name='${page}'`;
  }

  const sql = `
    SELECT 
      SUM(likes) as likes,
      SUM(comments) as comments,
      SUM(shares) as shares
    FROM facebook_data
    ${condition}
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);

    const data = result[0];

    res.json([
      { name: "Likes", value: data.likes },
      { name: "Comments", value: data.comments },
      { name: "Shares", value: data.shares }
    ]);
  });
};

// Posts Over Time
const getPostsOverTime = (req, res) => {
  const { page } = req.query;

  let condition = "";
  if (page) {
    condition = `WHERE page_name='${page}'`;
  }

  const sql = `
    SELECT 
      DATE_FORMAT(posttime, '%Y-%m') as month,
      COUNT(*) as total_posts
    FROM facebook_data
    ${condition}
    GROUP BY month
    ORDER BY month
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// Page Comparison
const getPageComparison = (req, res) => {
  const sql = `
    SELECT 
      page_name,
      AVG(likes) as avg_likes,
      AVG(comments) as avg_comments,
      AVG(shares) as avg_shares
    FROM facebook_data
    GROUP BY page_name
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// Search + Filter
const getPosts = (req, res) => {
  const { page, search } = req.query;

  let condition = "WHERE 1=1";

  if (page) {
    condition += ` AND page_name='${page}'`;
  }

  if (search) {
    condition += ` AND content LIKE '%${search}%'`;
  }

  const sql = `
    SELECT * FROM facebook_data
    ${condition}
    ORDER BY posttime DESC
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

const getPages = (req, res) => {
  const sql = `SELECT DISTINCT postname FROM facebook_data`;
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

module.exports = {
  getRevenueByRegion,
  getRevenueByCountry,
  getRevenueTrend,
  getTargetVsRevenueByRegion,
  getGeoTargetByRegion,
  getGeoByCountry,
  getGeoByCity,
  getDashboardStats,
  stats,
  chart,
  trend,
  topComments,
  comments,
  // sentimentChartByVideo,
  sentimentByVideo,
  getSummary,
  getChart,
  getTweetAnalytics,
  getKPI,
  getTopPosts,
  getEngagement,
  getPostsOverTime,
  getPageComparison,
  getPosts,
  getPages
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