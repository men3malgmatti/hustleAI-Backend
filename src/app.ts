import express from 'express';
import cors from 'cors';
import { onboardingRoutes } from './routes/onboarding';
import { roadmapRoutes } from './routes/roadmap';

const app = express();
const port = 3000;







app.use(cors());
app.use(express.json());

onboardingRoutes(app);
roadmapRoutes(app);


app.get('/', (req, res) => {
  res.json('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


