require('dotenv').config();
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: { encrypt: true, trustServerCertificate: false }
};

async function initSchema() {
    try {
        console.log("Connecting to create database schema...");
        let pool = await sql.connect(config);

        // SQL Statement to create the table if it doesn't exist
        const createTableQuery = `
            IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[expenses]') AND type in (N'U'))
            BEGIN
                CREATE TABLE [dbo].[expenses] (
                    [id] INT IDENTITY(1,1) PRIMARY KEY,
                    [title] NVARCHAR(100) NOT NULL,
                    [amount] DECIMAL(10,2) NOT NULL,
                    [category] NVARCHAR(50) NOT NULL,
                    [date] DATETIME DEFAULT GETDATE()
                )
                PRINT 'Expenses table created successfully!'
            END
            ELSE
            BEGIN
                PRINT 'Expenses table already exists.'
            END
        `;

        let result = await pool.request().query(createTableQuery);
        console.log("⚡ Initialization complete.");
        
        await sql.close();
    } catch (err) {
        console.error("❌ Schema initialization failed:", err.message);
    }
}

initSchema();