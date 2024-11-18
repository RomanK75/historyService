import express from 'express';
import * as db from '../db/index';
import e from 'express';
import { StockAction } from '../types/action';
 
const historyRouter = express.Router();

historyRouter.get('/history', async (req, res) => {
  const { 
    plu, 
    shop_id, 
    date_from, 
    date_to, 
    action, 
    page = 1, 
    limit = 10 
  } = req.query;

  try {
    let query = `
      SELECT * FROM action_history 
      WHERE 1=1
    `;
    const values = [];
    let paramCount = 1;

    if (plu) {
      query += ` AND plu = $${paramCount}`;
      values.push(plu);
      paramCount++;
    }

    if (shop_id) {
      query += ` AND shop_id = $${paramCount}`;
      values.push(shop_id);
      paramCount++;
    }

    if (date_from) {
      query += ` AND timestamp >= $${paramCount}`;
      values.push(date_from);
      paramCount++;
    }

    if (date_to) {
      query += ` AND timestamp <= $${paramCount}`;
      values.push(date_to);
      paramCount++;
    }

    if (action) {
      query += ` AND action = $${paramCount}`;
      values.push(action);
      paramCount++;
    }

    // Add pagination
    const offset = (Number(page) - 1) * Number(limit);
    query += ` ORDER BY timestamp DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);

    // Get total count for pagination
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    const totalCount = await db.query(countQuery, values);

    // Get paginated results
    const result = await db.query(query, values);

    res.json({
      data: result.rows,
      pagination: {
        total: parseInt(totalCount.rows[0].count),
        page: Number(page),
        limit: Number(limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

historyRouter.post('/history', async (req, res) => {
  console.log(req.body);
  const { plu, shop_id, action, quantity, order_quantity, timestamp }: Partial<StockAction> = req.body;
  
  let queryFields = [];
  let queryValues = [];
  let paramCounter = 1;
  
  // Dynamically build query based on provided fields
  if (plu) {
    queryFields.push('plu');
    queryValues.push(plu);
  }
  if (shop_id) {
    queryFields.push('shop_id');
    queryValues.push(shop_id);
  }
  if (action) {
    queryFields.push('action');
    queryValues.push(action);
  }
  if (quantity) {
    queryFields.push('quantity');
    queryValues.push(quantity);
  }
  if (order_quantity) {
    queryFields.push('order_quantity');
    queryValues.push(order_quantity);
  }
  if (timestamp) {
    queryFields.push('timestamp');
    queryValues.push(timestamp);
  }

  const query = `
    INSERT INTO action_history 
    (${queryFields.join(', ')})
    VALUES (${queryFields.map(() => `$${paramCounter++}`).join(', ')})
    RETURNING *
  `;

  try {
    const result = await db.query(query, queryValues);
    console.log(result.rows[0]);
    res.json({ data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default historyRouter;