import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './auth.js';
import familyRoutes from './family.js';
import requestRoutes from './request.js';
import tasksRoutes from './tasks.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: true }));
app.use(json());

app.use('/api/auth', authRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/request', requestRoutes);
app.use('/api/tasks', tasksRoutes);

app.get('/', (req, res) => res.json({ ok: true }));


app.listen(PORT, () => {
  console.log(`https://localhost:${PORT}`);
});
