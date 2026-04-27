import hana from "@sap/hana-client";
import * as dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env.local") });

const connectionParams = {
  serverNode: `${process.env.HANA_HOST}:${process.env.HANA_PORT}`,
  uid: process.env.HANA_USER,
  pwd: process.env.HANA_PASSWORD,
};

const schema = process.env.HANA_SCHEMA;

function runQuery(conn, sql) {
  return new Promise((resolve, reject) => {
    conn.exec(sql, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function connect(conn) {
  return new Promise((resolve, reject) => {
    conn.connect(connectionParams, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

const conn = hana.createConnection();

try {
  console.log("Connecting to HANA...");
  await connect(conn);
  console.log("Connected successfully!\n");

  // Step 1: Create the view
  console.log("Creating view V_DOC_NUMBERING...");
  const sqlFile = readFileSync(join(__dirname, "../sql/create_view.sql"), "utf8");
  await runQuery(conn, sqlFile);
  console.log("View created successfully!\n");

  // Step 2: Test query from the view
  console.log("Testing SELECT from V_DOC_NUMBERING...");
  const rows = await runQuery(
    conn,
    `SELECT * FROM "${schema}"."V_DOC_NUMBERING" LIMIT 10`
  );

  if (rows.length === 0) {
    console.log("No rows returned — check if ONNM/NNM1 tables have data.");
  } else {
    console.log(`${rows.length} rows returned (showing first 10):\n`);
    console.table(rows);
  }

} catch (err) {
  console.error("\nERROR:", err.message || err);
} finally {
  conn.disconnect();
  console.log("\nDisconnected.");
}
