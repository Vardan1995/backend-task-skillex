import express from 'express';
import { initializeDatabase } from './db/init.js';
import enableRoutes from './modules/index.js';

const app = express();
const router = express.Router()
app.use(express.json());

// Initialize database on startup
initializeDatabase().catch(console.error);

// Routes
app.use('/', enableRoutes(router));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});