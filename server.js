require('dotenv').config();
const express = require('express');
const cors = require('cors'); // 1. Add this line
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); // 2. Add this line to allow frontend connections!
app.use(express.json());

// Middleware to parse incoming JSON request bodies
app.use(express.json());

// Azure SQL Database Configuration Object
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

// Establish a global connection pool management strategy
const poolPromise = new sql.ConnectionPool(dbConfig)
    .connect()
    .then(pool => {
        console.log('⚡ Connected to Azure SQL Database Connection Pool');
        return pool;
    })
    .catch(err => {
        console.error('❌ Database Connection Pool Failed: ', err);
        process.exit(1);
    });

// --- ROUTES ---

// 1. GET ALL EXPENSES (Read)
app.get('/api/expenses', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM expenses ORDER BY date DESC');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. POST A NEW EXPENSE (Create)
app.post('/api/expenses', async (req, res) => {
    const { title, amount, category } = req.body;
    
    // Basic validation
    if (!title || !amount || !category) {
        return res.status(400).json({ error: 'Title, amount, and category are required' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('title', sql.NVarChar, title)
            .input('amount', sql.Decimal(10, 2), amount)
            .input('category', sql.NVarChar, category)
            .query(`
                INSERT INTO expenses (title, amount, category) 
                OUTPUT inserted.*
                VALUES (@title, @amount, @category)
            `);
        
        res.status(201).json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. DELETE AN EXPENSE (Delete)
app.delete('/api/expenses/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM expenses WHERE id = @id');
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        
        res.json({ message: 'Expense deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. PUT (UPDATE) AN EXISTING EXPENSE (Update)
app.put('/api/expenses/:id', async (req, res) => {
    const { id } = req.params;
    const { title, amount, category } = req.body;

    // Validation
    if (!title || !amount || !category) {
        return res.status(400).json({ error: 'Title, amount, and category are required' });
    }

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .input('title', sql.NVarChar, title)
            .input('amount', sql.Decimal(10, 2), amount)
            .input('category', sql.NVarChar, category)
            .query(`
                UPDATE expenses 
                SET title = @title, amount = @amount, category = @category
                WHERE id = @id;
                
                SELECT * FROM expenses WHERE id = @id;
            `);
        
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: 'Expense not found to update' });
        }
        
        // Return the updated item back to the client
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Start Server Listen
app.listen(port, () => {
    console.log(`🚀 API Server running locally on http://localhost:${port}`);
});