import exp from 'constants';
import * as db from './index';

function createHistoryTable() {
  const query = `
  CREATE TABLE IF NOT EXISTS action_history (
    id SERIAL PRIMARY KEY,
    plu INTEGER,
    shop_id INTEGER,
    action VARCHAR(50) NOT NULL,
    quantity INTEGER,
    order_quantity INTEGER,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`;
  db.query(query);
}

export { createHistoryTable };
