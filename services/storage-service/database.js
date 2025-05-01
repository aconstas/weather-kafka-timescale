import { Pool, Client } from "pg";

let pool;

export async function startPool() {
  pool = new Pool({
    user: "alexconstas",
    host: "localhost",
    database: "postgres",
    password: "",
    port: 5432,
  });
  //console.log(await pool.query("SELECT NOW()"));
}

export async function insertData(data) {
  try {
    await pool.query(
      "INSERT INTO weather_stations(call_sign,name,temperature,humidity,wind_speed,timestamp) VALUES($1, $2, $3, $4, $5, $6)",
      data
    );
  } catch (error) {
    console.error('Failed to insert data: ' + error);
  }
}
