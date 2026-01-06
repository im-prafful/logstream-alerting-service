
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  host:"logstream-2-db.czegikcsabng.ap-south-1.rds.amazonaws.com" ,
  port:"5432" ,
  database:"LogStream_2.0" ,
  user:"masterUser" ,
  password: "Admin$1234",
  // Setting ssl: false is recommended for local tunneling, or use your ENV variable
  ssl: {
    require: true,
    rejectUnauthorized: false,
  }, // disable SSL since you’re tunneling through bastion
});

const query = async (text, params) => {
  try {
    console.log(
      "🔗 Attempting to connect to DB at:",
      process.env.DB_HOST,
      "Port:",
      process.env.DB_PORT
    );

    const result = await pool.query(text);
    return result;
  } catch (err) {
    console.error("❌ Error executing query:", err.message);
    throw err;
  }
};

export default query;