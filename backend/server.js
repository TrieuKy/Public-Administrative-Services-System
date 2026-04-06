const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const routes = require('./src/routes');
const { sequelize } = require('./src/config/database');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/v1', routes);
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false, message: err.message || 'Internal Server Error'
    });
});
const PORT = process.env.PORT || 5000;
sequelize.authenticate()
    .then(() => {
        console.log('Database connected');
        return sequelize.sync({ alter: true });
    })
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch(err => {
        console.error('database error:', err);
        process.exit(1);
    });