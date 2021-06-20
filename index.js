const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

app.get("/contest", async (req, res) => {
  try {
    let response;

    const { winner, year } = req.query;
    let optionalWinnerQuery = "";
    if (winner) {
      optionalWinnerQuery = "AND place_contest = 1";

      if (year) {
        response = await pool.query(
          `SELECT * FROM contestdata WHERE year = ${year} ${optionalWinnerQuery}`
        );
      } else {
        response = await pool.query(
          `SELECT * FROM contestdata WHERE place_contest = 1`
        );
      }
    } else {
      if (year) {
        response = await pool.query(
          `SELECT * FROM contestdata WHERE year = ${year}`
        );
      } else {
        response = await pool.query(`SELECT * FROM contestdata`);
      }
    }
    res.json(response.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.get("/countries/:country", async (req, res) => {
  try {
    const countryName = req.params.country;

    let response;
    if (req.query.winners) {
      response = await pool.query(
        `SELECT * FROM contestdata WHERE country = '${countryName}' AND place_contest = 1`
      );
    } else {
      response = await pool.query(
        `SELECT * FROM contestdata WHERE country = '${countryName}'`
      );
    }
    res.json(response.rows);
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(3000, () => console.log("server started on port 3000"));
