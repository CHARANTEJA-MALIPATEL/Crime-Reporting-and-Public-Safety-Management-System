console.log("Checking dependencies...");
try {
    require('express'); console.log("express ok");
    require('cors'); console.log("cors ok");
    require('dotenv'); console.log("dotenv ok");
    require('mysql2'); console.log("mysql2 ok");
    require('bcrypt'); console.log("bcrypt ok");
    require('jsonwebtoken'); console.log("jsonwebtoken ok");
    require('multer'); console.log("multer ok");
    require('axios'); console.log("axios ok");

    console.log("Checking local modules...");
    require('./db'); console.log("db.js ok");
    require('./routes/auth'); console.log("auth.js ok");
    require('./routes/reports'); console.log("reports.js ok");

    console.log("All checks passed.");
} catch (e) {
    console.error("Error loading module:", e.message);
    console.error(e.stack);
}
