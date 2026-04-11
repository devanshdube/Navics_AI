const { db } = require("./../connect");

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
    const { company_id } = req.params;
    const { country, region, trade, channel } = req.query;

    let query = `
    SELECT r.region_name, SUM(cp.revenue) as revenue
    FROM country_performance cp
    JOIN countries c ON cp.country_id = c.id
    JOIN regions r ON c.region_id = r.id
    WHERE cp.company_id = ${company_id}
    `;

    if (country) query += ` AND c.country_name='${country}'`;
    if (region) query += ` AND r.region_name='${region}'`;
    if (trade) query += ` AND cp.trade='${trade}'`;
    if (channel) query += ` AND cp.channel='${channel}'`;

    query += ` GROUP BY r.region_name`;

    const rows = await queryAsync(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------------------

const getRevenueByCountry = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { country, region, trade, channel } = req.query;

    let query = `
    SELECT c.country_name, SUM(cp.revenue) as revenue
    FROM country_performance cp
    JOIN countries c ON cp.country_id = c.id
    JOIN regions r ON c.region_id = r.id
    WHERE cp.company_id = ${company_id}
    `;

    if (country) query += ` AND c.country_name='${country}'`;
    if (region) query += ` AND r.region_name='${region}'`;
    if (trade) query += ` AND cp.trade='${trade}'`;
    if (channel) query += ` AND cp.channel='${channel}'`;

    query += ` GROUP BY c.country_name ORDER BY revenue DESC`;

    const rows = await queryAsync(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------------------

const getRevenueTrend = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { country, region, trade, channel } = req.query;

    let query = `
    SELECT month, channel, SUM(revenue) revenue
    FROM country_performance cp
    JOIN countries c ON cp.country_id = c.id
    JOIN regions r ON c.region_id = r.id
    WHERE cp.company_id = ${company_id}
    `;

    if (country) query += ` AND c.country_name='${country}'`;
    if (region) query += ` AND r.region_name='${region}'`;
    if (trade) query += ` AND cp.trade='${trade}'`;
    if (channel) query += ` AND cp.channel='${channel}'`;

    query += ` GROUP BY month, channel ORDER BY month`;

    const rows = await queryAsync(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------------------

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
      ON cp.country_id = c.id AND cp.company_id = ${company_id}
    LEFT JOIN region_targets rt 
      ON rt.region_id = r.id AND rt.company_id = ${company_id}
    WHERE 1=1
    `;

    if (country) query += ` AND c.country_name='${country}'`;
    if (region) query += ` AND r.region_name='${region}'`;
    if (trade) query += ` AND cp.trade='${trade}'`;
    if (channel) query += ` AND cp.channel='${channel}'`;

    query += ` GROUP BY r.region_name`;

    const rows = await queryAsync(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------------------

const getGeoTargetByRegion = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { trade } = req.query;

    let query = `
    SELECT r.region_name, SUM(rt.target_value) as target
    FROM region_targets rt
    JOIN regions r ON rt.region_id = r.id
    WHERE rt.company_id = ${company_id}
    `;

    if (trade) query += ` AND rt.trade='${trade}'`;

    query += ` GROUP BY r.region_name`;

    const rows = await queryAsync(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------------------

const getGeoByCountry = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { trade, channel } = req.query;

    let query = `
    SELECT c.country_name, SUM(cp.revenue) as revenue
    FROM country_performance cp
    JOIN countries c ON cp.country_id = c.id
    WHERE cp.company_id = ${company_id}
    `;

    if (trade) query += ` AND cp.trade='${trade}'`;
    if (channel) query += ` AND cp.channel='${channel}'`;

    query += ` GROUP BY c.country_name`;

    const rows = await queryAsync(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------------------

const getGeoByCity = async (req, res) => {
  try {
    const { company_id } = req.params;

    let query = `
    SELECT s.city, SUM(rt.target_value) as target
    FROM region_targets rt
    JOIN stores s ON rt.store_name = s.store_name
    WHERE rt.company_id = ${company_id}
    AND rt.target_measure = 'Container'
    GROUP BY s.city
    `;

    const rows = await queryAsync(query);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------------------

const getDashboardStats = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { country, region, trade, channel } = req.query;

    let condition = `WHERE cp.company_id = ${company_id}`;

    if (country) condition += ` AND c.country_name='${country}'`;
    if (region) condition += ` AND r.region_name='${region}'`;
    if (trade) condition += ` AND cp.trade='${trade}'`;
    if (channel) condition += ` AND cp.channel='${channel}'`;

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
    WHERE rt.company_id = ${company_id}
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

    const totalRevenue = await queryAsync(revenueQuery);
    const momData = await queryAsync(momQuery);
    const totalTarget = await queryAsync(targetQuery);
    const topCountry = await queryAsync(topQuery);

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
      topCountries: topCountry || [],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----------------------------------------
// Youtube Channel Performance
// ----------------------------------------

const stats = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { startDate, endDate, sentiment } = req.query;

    let condition = `WHERE company_id = ${company_id}`;

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
      if (err) return res.status(500).json({ success: false, error: err });

      return res.json({ success: true, data: result[0] });
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// ----------------------------------------

const chart = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { startDate, endDate } = req.query;

    let condition = `WHERE company_id = ${company_id}`;

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
      if (err) return res.status(500).json({ success: false, error: err });

      return res.json({ success: true, data: result });
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// ----------------------------------------

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
      WHERE company_id = ${company_id}
      GROUP BY DATE(published_date)
      ORDER BY date ASC
    `;

    db.query(query, (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err });

      return res.json({ success: true, data: result });
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// ----------------------------------------

const topComments = async (req, res) => {
  try {
    const { company_id } = req.params;

    const query = `
      SELECT comment, like_count
      FROM youtube_sentiments
      WHERE company_id = ${company_id}
      ORDER BY like_count DESC
      LIMIT 5
    `;

    db.query(query, (err, result) => {
      if (err) return res.status(500).json({ success: false, error: err });

      return res.json({ success: true, data: result });
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// ----------------------------------------

const comments = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { search, sentiment } = req.query;

    let condition = `WHERE company_id = ${company_id}`;

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
      if (err) return res.status(500).json({ success: false, error: err });

      return res.json({ success: true, data: result });
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// ----------------------------------------

const sentimentByVideo = async (req, res) => {
  try {
    const { company_id } = req.params;
    const { startDate, endDate } = req.query;

    let condition = "WHERE company_id = ?";
    let values = [company_id];

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
      if (err) return res.status(500).json({ success: false, error: err });

      return res.json({ success: true, data: result });
    });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
};

// ----------------------------------------

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
};
