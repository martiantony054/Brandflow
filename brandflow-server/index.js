require("dotenv").config();

require("./DB/Connection");

const expr = require("express");
const cors = require("cors");

const app = expr();

const PORT = process.env.PORT || 5000;
 
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(expr.json()); 

app.use('/api/generate',  require('./Routes/Generate'));
app.use('/api/repurpose', require('./Routes/Repurpose'));
app.use('/api/predict',   require('./Routes/Predict'));
app.use('/api/posts',     require('./Routes/Post'));


app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// Global error handler — logs the real error to server terminal
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.message);
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => console.log(`BrandFlow server → http://localhost:${PORT}`));