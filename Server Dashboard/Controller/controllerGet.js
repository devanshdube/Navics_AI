const { db } = require("./../connect");

const getAllCompanies = async (req, res) => {

  try {

    const query = `
      SELECT id, company_name
      FROM navics_client_company
      WHERE status = 'active'
      ORDER BY company_name ASC
    `;

    const companies = await new Promise((resolve, reject) => {

      db.query(query, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results);
      });

    });

    return res.status(200).json({
      status: "Success",
      data: companies
    });

  } catch (error) {

    return res.status(500).json({
      status: "Failure",
      message: "Database error",
      error: error.message
    });

  }

};

// controllers/companyController.js

// const getCompanies = async (req, res) => {
//   try {

//     const query = `
//       SELECT 
//         c.id,
//         c.company_name,
//         c.total_user_count,
//         COUNT(u.id) AS available_users,
//         c.status,
//         c.created_at
//       FROM navics_client_company c
//       LEFT JOIN navics_company_users u
//         ON u.company_id = c.id
//         AND u.status = 'active'
//       GROUP BY c.id
//       ORDER BY c.id DESC
//     `;

//     db.query(query, (err, result) => {

//       if (err) {
//         return res.status(500).json({
//           status: "Error",
//           message: err.message
//         });
//       }

//       return res.json({
//         status: "Success",
//         data: result
//       });

//     });

//   } catch (error) {

//     return res.status(500).json({
//       status: "Error",
//       message: error.message
//     });

//   }
// };

const getCompanies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const search = req.query.search?.trim() || "";

    const searchCondition = search ? `WHERE c.company_name LIKE ?` : "";
    const params = search
      ? [`%${search}%`, limit, offset]
      : [limit, offset];

    const dataQuery = `
      SELECT 
        c.id,
        c.company_name,
        c.total_user_count,
        COUNT(u.id) AS available_users,
        c.status,
        c.created_at
      FROM navics_client_company c
      LEFT JOIN navics_company_users u
        ON u.company_id = c.id
        AND u.status = 'active'
      ${searchCondition}
      GROUP BY c.id
      ORDER BY c.id DESC
      LIMIT ? OFFSET ?
    `;

    // Total count for hasMore check
    const countQuery = `
      SELECT COUNT(DISTINCT c.id) AS total
      FROM navics_client_company c
      ${searchCondition}
    `;

    const countParams = search ? [`%${search}%`] : [];

    db.query(countQuery, countParams, (err, countResult) => {
      if (err) return res.status(500).json({ status: "Error", message: err.message });

      const total = countResult[0].total;

      db.query(dataQuery, params, (err, result) => {
        if (err) return res.status(500).json({ status: "Error", message: err.message });

        return res.json({
          status: "Success",
          data: result,
          pagination: {
            page,
            limit,
            total,
            hasMore: offset + result.length < total,
          },
        });
      });
    });
  } catch (error) {
    return res.status(500).json({ status: "Error", message: error.message });
  }
};

const getCompanyUsers = async (req, res) => {

  try {

    const { company_id } = req.params;

    const query = `
      SELECT
        id,
        employee_id,
        user_name,
        email,
        mobile,
        role,
        status,
        created_at
      FROM navics_company_users
      WHERE company_id = ?
      ORDER BY id DESC
    `;

    db.query(query, [company_id], (err, result) => {

      if (err) {
        return res.status(500).json({
          status: "Error",
          message: err.message
        });
      }

      return res.json({
        status: "Success",
        data: result
      });

    });

  } catch (error) {

    return res.status(500).json({
      status: "Error",
      message: error.message
    });

  }

};


module.exports = {
  getAllCompanies,
  getCompanies,
  getCompanyUsers
};
