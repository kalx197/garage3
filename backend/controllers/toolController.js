const pool = require('../config/db');
const queries = require('../models/queries');

exports.getTools = async (req, res) => {
  try {
    const result = await pool.query(queries.getAllTools);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addTool = async (req, res) => {
  const { name, category, total_qty, location_bin } = req.body;
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Operation restricted to administrators.' });

  try {
    const result = await pool.query(queries.insertTool, [name, category, total_qty, total_qty, location_bin]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggleAllocation = async (req, res) => {
  const { id, action } = req.body; // action: 'checkout' or 'return'
  try {
    const toolRes = await pool.query('SELECT * FROM tools WHERE id = $1', [id]);
    if (toolRes.rows.length === 0) return res.status(404).json({ error: 'Tool target reference structural mismatch.' });

    const tool = toolRes.rows[0];
    let newQty = tool.available_qty;
    let newStatus = tool.status;

    if (action === 'checkout' && newQty > 0) {
      newQty -= 1;
      newStatus = newQty === 0 ? 'in-use' : 'available';
    } else if (action === 'return' && newQty < tool.total_qty) {
      newQty += 1;
      newStatus = 'available';
    } else {
      return res.status(400).json({ error: 'Invalid operation bounds reached.' });
    }

    const updated = await pool.query(queries.updateToolStatus, [newStatus, newQty, id]);
    res.json(updated.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
