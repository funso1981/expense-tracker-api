require('dotenv').config();
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true, // Azure SQL mandates encrypted connections
        trustServerCertificate: false // Enforce strict certificate verification
    }
};

async function runTest() {
    console.log("Connecting to Azure SQL Database...");
    try {
        // Connect to the database
        let pool = await sql.connect(config);
        console.log("⚡ Connection established successfully!");

        // Run a test query to get database engine info
        let result = await pool.request().query("SELECT @@VERSION as version");
        
        console.log("\n--- Database Response ---");
        console.log(result.recordset[0].version);
        console.log("-------------------------\n");

        // Close connection cleanly
        await sql.close();
        console.log("Connection closed smoothly.");
    } catch (err) {
        console.error("❌ Database connection failed!");
        console.error(err.message);
    }
}

runTest();