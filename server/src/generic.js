// generic.js — builds standard CRUD routes for any database table.
//
// Instead of writing a separate route file for Experience, Expertise, Metrics,
// Achievements, Certifications, Articles and Gallery (which would all look the
// same), we write the logic ONCE here and reuse it.
//
// How it works:
//   - GET  /           -> public list (only visible items; articles only if published)
//   - POST /           -> admin create
//   - PUT  /:id        -> admin update
//   - DELETE /:id      -> admin delete
//
// The column list is read from the database itself, so adding a new column to
// a table automatically becomes editable without touching this file.

const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const auth = require('./middleware/auth');

// Remember each table's columns so we don't query the database on every call.
const columnsCache = {};

async function getColumns(table) {
  if (!columnsCache[table]) {
    const res = await pool.query(
      `SELECT column_name, data_type
         FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position`,
      [table]
    );
    // id, created_at, updated_at are managed automatically — never edited directly
    columnsCache[table] = res.rows.filter(
      (c) => !['id', 'created_at', 'updated_at'].includes(c.column_name)
    );
  }
  return columnsCache[table];
}

// turn a JSON value into the right type for the column (boolean / number / text)
function coerce(col, value) {
  if (value === undefined || value === null) return null;
  if (col.data_type === 'boolean') {
    if (typeof value === 'boolean') return value;
    return value === true || value === 'true' || value === '1';
  }
  if (['integer', 'bigint', 'smallint'].includes(col.data_type)) {
    const n = Number(value);
    return Number.isNaN(n) ? 0 : n;
  }
  return String(value);
}

// options:
//   table        -> the table name (required)
//   orderBy      -> SQL ORDER BY for lists (default: sort_order first, then newest)
//   publicFilter -> extra SQL condition for the PUBLIC list only (e.g. published = TRUE)
function crudRouter({ table, orderBy = 'sort_order ASC, created_at DESC', publicFilter = '' }) {
  const router = express.Router();

  // GET /  (public — admins see everything including hidden/unpublished)
  router.get('/', async (req, res) => {
    try {
      // a valid admin token unlocks the full list (so the dashboard can manage drafts)
      const header = req.headers.authorization || '';
      let isAdmin = false;
      if (header.startsWith('Bearer ')) {
        try {
          jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
          isAdmin = true;
        } catch { /* not a valid token -> treat as public */ }
      }

      const columns = await getColumns(table);
      const where = [];
      if (!isAdmin) {
        if (columns.some((c) => c.column_name === 'is_visible')) where.push('is_visible = TRUE');
        if (publicFilter) where.push(publicFilter);
      }
      const sql = `SELECT * FROM ${table}${where.length ? ' WHERE ' + where.join(' AND ') : ''} ORDER BY ${orderBy}`;
      const result = await pool.query(sql);
      res.json(result.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // POST /  (admin only)
  router.post('/', auth, async (req, res) => {
    try {
      const columns = await getColumns(table);
      const insertCols = [];
      const values = [];
      for (const col of columns) {
        if (!(col.column_name in req.body)) continue;
        insertCols.push(col.column_name);
        values.push(coerce(col, req.body[col.column_name]));
      }
      if (insertCols.length === 0) {
        return res.status(400).json({ message: 'No data provided' });
      }
      const placeholders = values.map((_, i) => '$' + (i + 1)).join(', ');
      const result = await pool.query(
        `INSERT INTO ${table} (${insertCols.join(', ')}) VALUES (${placeholders}) RETURNING *`,
        values
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // PUT /:id  (admin only)
  router.put('/:id', auth, async (req, res) => {
    try {
      const columns = await getColumns(table);
      const sets = [];
      const values = [];
      for (const col of columns) {
        if (!(col.column_name in req.body)) continue;
        sets.push(`${col.column_name} = $${values.length + 1}`);
        values.push(coerce(col, req.body[col.column_name]));
      }
      if (sets.length === 0) {
        return res.status(400).json({ message: 'No data provided' });
      }
      values.push(req.params.id);
      const result = await pool.query(
        `UPDATE ${table} SET ${sets.join(', ')} WHERE id = $${values.length} RETURNING *`,
        values
      );
      if (result.rows.length === 0) return res.status(404).json({ message: 'Not found' });
      res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // DELETE /:id  (admin only)
  router.delete('/:id', auth, async (req, res) => {
    try {
      const result = await pool.query(`DELETE FROM ${table} WHERE id = $1`, [req.params.id]);
      if (result.rowCount === 0) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
}

module.exports = crudRouter;
