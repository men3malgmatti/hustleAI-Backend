import express from 'express';
import cors from 'cors';
import { onboardingRoutes } from './routes/onboarding';
import { roadmapRoutes } from './routes/roadmap';
import { setAdmin } from './utility/firebaseAuth';
import path from 'path';
import authenticate from './middlewares/expressAuth';
import { Request } from './types';

const app = express();
const port = 3000;




app.get('/admin', (req:Request, res, next) => {

  console.log('admin route hit');
  

  req.url === '/admin' ? next() : authenticate(req, res, next);
}, (req, res) => {
  res.sendFile('/Users/abdulmonemdakheel/myProjects/video-chat-backend/socketIo/public/index.html');
});

app.use(express.static(path.join(__dirname, '../public')));  


app.use(cors());
app.use(express.json());

onboardingRoutes(app);
roadmapRoutes(app);


setAdmin();

app.get('/', (req, res) => {
  res.json('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


