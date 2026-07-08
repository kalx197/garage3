const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const queries = require('./models/queries');
const loggerMiddleware = require('./middleware/loggerMiddleware');
const authRoutes = require('./routes/authRoutes');
const toolRoutes = require('./routes/toolRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/tools', toolRoutes);

const PORT = process.env.PORT || 5000;

// Dynamic database sync then startup initialization sequence
pool.query(queries.initializeTables)
  .then(() => {
    console.log('Database schemas verified and initialized.');
    app.listen(PORT, () => console.log(`Application running on server cluster port ${PORT}`));
  })
  .catch(err => console.error('Database migration critical failure:', err));
