const { db } = require("./../connect");

// ─── Shared async query helper (supports parameterized queries) ────────────
const queryAsync = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// Sales / Revenue Charts
// ─────────────────────────────────────────────────────────────────────────────

const getRevenueByRegion = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { country, region, trade, channel } = req.query;

    let query = `
    SELECT r.region_name, SUM(cp.revenue) as revenue
    FROM country_performance cp
    JOIN countries c ON cp.country_id = c.id
    JOIN regions r ON c.region_id = r.id
    WHERE cp.company_id = ?
    `;
    const params = [company_id];

    if (country) { query += ` AND c.country_name = ?`; params.push(country); }
    if (region)  { query += ` AND r.region_name = ?`;  params.push(region); }
    if (trade)   { query += ` AND cp.trade = ?`;        params.push(trade); }
    if (channel) { query += ` AND cp.channel = ?`;      params.push(channel); }

    query += ` GROUP BY r.region_name`;

    const rows = await queryAsync(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const getRevenueByCountry = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { country, region, trade, channel } = req.query;

    let query = `
    SELECT c.country_name, SUM(cp.revenue) as revenue
    FROM country_performance cp
    JOIN countries c ON cp.country_id = c.id
    JOIN regions r ON c.region_id = r.id
    WHERE cp.company_id = ?
    `;
    const params = [company_id];

    if (country) { query += ` AND c.country_name = ?`; params.push(country); }
    if (region)  { query += ` AND r.region_name = ?`;  params.push(region); }
    if (trade)   { query += ` AND cp.trade = ?`;        params.push(trade); }
    if (channel) { query += ` AND cp.channel = ?`;      params.push(channel); }

    query += ` GROUP BY c.country_name ORDER BY revenue DESC`;

    const rows = await queryAsync(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const getRevenueTrend = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { country, region, trade, channel } = req.query;

    let query = `
    SELECT month, channel, SUM(revenue) revenue
    FROM country_performance cp
    JOIN countries c ON cp.country_id = c.id
    JOIN regions r ON c.region_id = r.id
    WHERE cp.company_id = ?
    `;
    const params = [company_id];

    if (country) { query += ` AND c.country_name = ?`; params.push(country); }
    if (region)  { query += ` AND r.region_name = ?`;  params.push(region); }
    if (trade)   { query += ` AND cp.trade = ?`;        params.push(trade); }
    if (channel) { query += ` AND cp.channel = ?`;      params.push(channel); }

    query += ` GROUP BY month, channel ORDER BY month`;

    const rows = await queryAsync(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const getTargetVsRevenueByRegion = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { country, region, trade, channel } = req.query;

    let query = `
    SELECT r.region_name,
    SUM(cp.revenue) AS revenue,
    SUM(rt.target_value) AS target
    FROM regions r
    LEFT JOIN countries c ON r.id = c.region_id
    LEFT JOIN country_performance cp
      ON cp.country_id = c.id AND cp.company_id = ?
    LEFT JOIN region_targets rt
      ON rt.region_id = r.id AND rt.company_id = ?
    WHERE 1=1
    `;
    const params = [company_id, company_id];

    if (country) { query += ` AND c.country_name = ?`; params.push(country); }
    if (region)  { query += ` AND r.region_name = ?`;  params.push(region); }
    if (trade)   { query += ` AND cp.trade = ?`;        params.push(trade); }
    if (channel) { query += ` AND cp.channel = ?`;      params.push(channel); }

    query += ` GROUP BY r.region_name`;

    const rows = await queryAsync(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const getGeoTargetByRegion = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { trade } = req.query;

    let query = `
    SELECT r.region_name, SUM(rt.target_value) as target
    FROM region_targets rt
    JOIN regions r ON rt.region_id = r.id
    WHERE rt.company_id = ?
    `;
    const params = [company_id];

    if (trade) { query += ` AND rt.trade = ?`; params.push(trade); }

    query += ` GROUP BY r.region_name`;

    const rows = await queryAsync(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const getGeoByCountry = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { trade, channel } = req.query;

    let query = `
    SELECT c.country_name, SUM(cp.revenue) as revenue
    FROM country_performance cp
    JOIN countries c ON cp.country_id = c.id
    WHERE cp.company_id = ?
    `;
    const params = [company_id];

    if (trade)   { query += ` AND cp.trade = ?`;    params.push(trade); }
    if (channel) { query += ` AND cp.channel = ?`;  params.push(channel); }

    query += ` GROUP BY c.country_name`;

    const rows = await queryAsync(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const getGeoByCity = async (req, res) => {
  try {
    const { company_id } = req.params;

    const query = `
    SELECT s.city, SUM(rt.target_value) as target
    FROM region_targets rt
    JOIN stores s ON rt.store_name = s.store_name
    WHERE rt.company_id = ?
    AND rt.target_measure = 'Container'
    GROUP BY s.city
    `;

    const rows = await queryAsync(query, [company_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const getDashboardStats = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { country, region, trade, channel } = req.query;

    let condition = `WHERE cp.company_id = ?`;
    const params = [company_id];

    if (country) { condition += ` AND c.country_name = ?`; params.push(country); }
    if (region)  { condition += ` AND r.region_name = ?`;  params.push(region); }
    if (trade)   { condition += ` AND cp.trade = ?`;        params.push(trade); }
    if (channel) { condition += ` AND cp.channel = ?`;      params.push(channel); }

    const revenueQuery = `
    SELECT SUM(cp.revenue) as totalRevenue
    FROM country_performance cp
    JOIN countries c ON cp.country_id = c.id
    JOIN regions r ON c.region_id = r.id
    ${condition}
    `;

    const momQuery = `
    SELECT month, SUM(revenue) as revenue
    FROM country_performance cp
    JOIN countries c ON cp.country_id = c.id
    JOIN regions r ON c.region_id = r.id
    ${condition}
    GROUP BY month
    ORDER BY month DESC
    LIMIT 2
    `;

    const targetQuery = `
    SELECT SUM(rt.target_value) as totalTarget
    FROM region_targets rt
    WHERE rt.company_id = ?
    AND rt.target_measure='Revenue'
    `;

    const topQuery = `
    SELECT c.country_name, SUM(cp.revenue) as revenue
    FROM country_performance cp
    JOIN countries c ON cp.country_id = c.id
    JOIN regions r ON c.region_id = r.id
    ${condition}
    GROUP BY c.country_name
    ORDER BY revenue DESC
    LIMIT 5
    `;

    const totalRevenue = await queryAsync(revenueQuery, params);
    const momData      = await queryAsync(momQuery, params);
    const totalTarget  = await queryAsync(targetQuery, [company_id]);
    const topCountry   = await queryAsync(topQuery, params);

    let mom = 0;
    if (momData.length === 2) {
      const current  = momData[0].revenue;
      const previous = momData[1].revenue;
      mom = ((current - previous) / previous) * 100;
    }

    res.json({
      totalRevenue: totalRevenue[0]?.totalRevenue || 0,
      totalTarget:  totalTarget[0]?.totalTarget   || 0,
      mom:          mom.toFixed(2),
      topCountries: topCountry || [],
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// YouTube Channel Performance
// ─────────────────────────────────────────────────────────────────────────────

const stats = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { startDate, endDate, sentiment } = req.query;

    let condition = `WHERE company_id = ?`;
    const params = [company_id];

    if (startDate && endDate) {
      condition += ` AND DATE(published_date) BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }
    if (sentiment) {
      condition += ` AND sentiment = ?`;
      params.push(sentiment);
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

    const result = await queryAsync(query, params);
    res.json({ success: true, data: result[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const chart = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { startDate, endDate } = req.query;

    let condition = `WHERE company_id = ?`;
    const params = [company_id];

    if (startDate && endDate) {
      condition += ` AND DATE(published_date) BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    const query = `
      SELECT sentiment, COUNT(*) as count
      FROM youtube_sentiments
      ${condition}
      GROUP BY sentiment
    `;

    const result = await queryAsync(query, params);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const trend = async (req, res) => {
  try {
    const { company_id } = req.params;

    const query = `
      SELECT
        DATE(published_date) as date,
        SUM(sentiment='positive') as positive,
        SUM(sentiment='negative') as negative,
        SUM(sentiment='neutral') as neutral
      FROM youtube_sentiments
      WHERE company_id = ?
      GROUP BY DATE(published_date)
      ORDER BY date ASC
    `;

    const result = await queryAsync(query, [company_id]);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const topComments = async (req, res) => {
  try {
    const { company_id } = req.params;

    const query = `
      SELECT comment, like_count
      FROM youtube_sentiments
      WHERE company_id = ?
      ORDER BY like_count DESC
      LIMIT 5
    `;

    const result = await queryAsync(query, [company_id]);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const comments = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { search, sentiment } = req.query;

    let condition = `WHERE company_id = ?`;
    const params = [company_id];

    if (search) {
      condition += ` AND comment LIKE ?`;
      params.push(`%${search}%`);
    }
    if (sentiment) {
      condition += ` AND sentiment = ?`;
      params.push(sentiment);
    }

    const query = `
      SELECT *
      FROM youtube_sentiments
      ${condition}
      ORDER BY published_date DESC
      LIMIT 50
    `;

    const result = await queryAsync(query, params);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const sentimentByVideo = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { startDate, endDate } = req.query;

    let condition = `WHERE company_id = ?`;
    const params = [company_id];

    if (startDate && endDate) {
      condition += ` AND DATE(published_date) BETWEEN ? AND ?`;
      params.push(startDate, endDate);
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

    const result = await queryAsync(query, params);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Twitter Channel Performance
// ─────────────────────────────────────────────────────────────────────────────

const getSummary = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { startDate, endDate, search } = req.query;

    let condition = `WHERE company_id = ?`;
    const params = [company_id];

    if (startDate && endDate) {
      condition += ` AND DATE(tweet_date) BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }
    if (search) {
      condition += ` AND content LIKE ?`;
      params.push(`%${search}%`);
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

    const result = await queryAsync(sql, params);
    res.json({ success: true, data: result[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const getChart = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { startDate, endDate, search } = req.query;

    let condition = `WHERE company_id = ?`;
    const params = [company_id];

    if (startDate && endDate) {
      condition += ` AND DATE(tweet_date) BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }
    if (search) {
      condition += ` AND content LIKE ?`;
      params.push(`%${search}%`);
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

    const result = await queryAsync(sql, params);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const getTweetAnalytics = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { startDate, endDate, search } = req.query;

    let condition = `WHERE company_id = ?`;
    const params = [company_id];

    if (startDate && endDate) {
      condition += ` AND DATE(tweet_date) BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }
    if (search) {
      condition += ` AND content LIKE ?`;
      params.push(`%${search}%`);
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

    const result = await queryAsync(sql, params);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Facebook Channel Performance
// ─────────────────────────────────────────────────────────────────────────────

const getKPI = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { page } = req.query;

    let condition = `WHERE company_id = ?`;
    const params = [company_id];

    if (page) {
      condition += ` AND page_name = ?`;
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

    const result = await queryAsync(sql, params);
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const getTopPosts = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { page, sort = "likes" } = req.query;

    // Whitelist to prevent ORDER BY injection
    const allowedSort = ["likes", "comments", "shares"];
    const sortBy = allowedSort.includes(sort) ? sort : "likes";

    let condition = `WHERE company_id = ?`;
    const params = [company_id];

    if (page && page !== "") {
      condition += ` AND page_name = ?`;
      params.push(page);
    }

    const sql = `
      SELECT postid, page_name, LEFT(content, 20) as label, content as fullcontent, likes, comments, shares
      FROM facebook_data
      ${condition}
      ORDER BY ${sortBy} DESC
      LIMIT 10
    `;

    const result = await queryAsync(sql, params);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const getEngagement = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { page } = req.query;

    let condition = `WHERE company_id = ?`;
    const params = [company_id];

    if (page) {
      condition += ` AND page_name = ?`;
      params.push(page);
    }

    const sql = `
      SELECT
        SUM(likes) as likes,
        SUM(comments) as comments,
        SUM(shares) as shares
      FROM facebook_data
      ${condition}
    `;

    const result = await queryAsync(sql, params);
    const data = result[0];
    res.json([
      { name: "Likes",    value: data.likes },
      { name: "Comments", value: data.comments },
      { name: "Shares",   value: data.shares },
    ]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const getPostsOverTime = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { page } = req.query;

    let condition = `WHERE company_id = ?`;
    const params = [company_id];

    if (page) {
      condition += ` AND page_name = ?`;
      params.push(page);
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

    const result = await queryAsync(sql, params);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const getPageComparison = async (req, res) => {
  try {
    const { company_id } = req.params;

    const sql = `
      SELECT
        page_name,
        AVG(likes) as avg_likes,
        AVG(comments) as avg_comments,
        AVG(shares) as avg_shares
      FROM facebook_data
      WHERE company_id = ?
      GROUP BY page_name
    `;

    const result = await queryAsync(sql, [company_id]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const getPosts = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { page, search } = req.query;

    let condition = `WHERE company_id = ?`;
    const params = [company_id];

    if (page) {
      condition += ` AND page_name = ?`;
      params.push(page);
    }
    if (search) {
      condition += ` AND content LIKE ?`;
      params.push(`%${search}%`);
    }

    const sql = `
      SELECT * FROM facebook_data
      ${condition}
      ORDER BY posttime DESC
    `;

    const result = await queryAsync(sql, params);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const getPages = async (req, res) => {
  try {
    const { company_id } = req.params;

    const sql = `
      SELECT DISTINCT page_name
      FROM facebook_data
      WHERE company_id = ?
    `;

    const result = await queryAsync(sql, [company_id]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Instagram Channel Performance
// ─────────────────────────────────────────────────────────────────────────────

const getInstaKPIs = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { startDate, endDate } = req.query;

    let condition = `WHERE company_id = ?`;
    const params = [company_id];

    if (startDate && endDate) {
      condition += ` AND STR_TO_DATE(timestamp, '%Y-%m-%d') BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    const query = `
      SELECT
        COUNT(*) as totalPosts,
        SUM(likes) as totalLikes,
        SUM(comments) as totalComments,
        MAX(likes) as topPostLikes,
        ROUND((SUM(likes + comments) / COUNT(*)), 2) as engagementRate
      FROM instagram_posts
      ${condition}
    `;

    const result = await queryAsync(query, params);
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const getLikesOverTime = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { startDate, endDate } = req.query;

    let condition = `WHERE company_id = ?`;
    const params = [company_id];

    if (startDate && endDate) {
      condition += ` AND STR_TO_DATE(timestamp, '%Y-%m-%d') BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    }

    const query = `
      SELECT
        timestamp,
        likes,
        comments,
        type
      FROM instagram_posts
      ${condition}
      ORDER BY STR_TO_DATE(timestamp, '%Y-%m-%d') ASC
    `;

    const result = await queryAsync(query, params);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const getPostTypeBreakdown = async (req, res) => {
  try {
    const { company_id } = req.params;

    const query = `
      SELECT type, COUNT(*) as count
      FROM instagram_posts
      WHERE company_id = ?
      GROUP BY type
    `;

    const result = await queryAsync(query, [company_id]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const getAvgLikesByType = async (req, res) => {
  try {
    const { company_id } = req.params;

    const query = `
      SELECT
        type,
        ROUND(AVG(likes)) as avgLikes
      FROM instagram_posts
      WHERE company_id = ?
      GROUP BY type
    `;

    const result = await queryAsync(query, [company_id]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

const getCommentsTrend = async (req, res) => {
  try {
    const { company_id } = req.params;

    const query = `
      SELECT
        timestamp,
        comments
      FROM instagram_posts
      WHERE company_id = ?
      ORDER BY STR_TO_DATE(timestamp, '%Y-%m-%d') ASC
    `;

    const result = await queryAsync(query, [company_id]);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ─────────────────────────────────────────────────────────────────────────────

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
  getPages,
  getInstaKPIs,
  getLikesOverTime,
  getPostTypeBreakdown,
  getAvgLikesByType,
  getCommentsTrend,
};
