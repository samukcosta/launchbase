const {Pool} = require("pg")

module.exports = new Pool({
    user: 'postgres',
    password: "Morghulis@22",
    host: "localhost",
    port: 5432,
    database: "gymmanager"
})