import hana from "@sap/hana-client";

const connectionParams = {
  serverNode: `${process.env.HANA_HOST}:${process.env.HANA_PORT}`,
  uid: process.env.HANA_USER,
  pwd: process.env.HANA_PASSWORD,
};

export async function queryHana<T = Record<string, unknown>>(
  sql: string
): Promise<T[]> {
  const conn = hana.createConnection();

  return new Promise((resolve, reject) => {
    conn.connect(connectionParams, (connectErr) => {
      if (connectErr) {
        reject(connectErr);
        return;
      }

      conn.exec(sql, (execErr, rows) => {
        conn.disconnect();
        if (execErr) {
          reject(execErr);
          return;
        }
        resolve(rows as T[]);
      });
    });
  });
}
