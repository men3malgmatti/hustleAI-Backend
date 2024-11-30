import express from 'express';
import cors from 'cors';
import { onboardingRoutes } from './routes/onboarding';
import { roadmapRoutes } from './routes/roadmap';
import { setAdmin } from './utility/firebaseAuth';
import path from 'path';
import authenticate from './middlewares/expressAuth';
import { Request } from './types';
import { adminOnboardingRoutes } from './routes/adminOnbourding';
import { syncModels } from './db/models';

const app = express();
const port = 3000;


try {
  syncModels()
} catch (error) {
  console.log('====================================');
  console.log('error syncing models',error);
  console.log('====================================');
}





app.use(cors());
app.use(express.json());


app.get('/admin', (req:Request, res, next) => {

  console.log('admin route hit');
  


  req.url === '/admin' ? next() : authenticate(req, res, next);
}, (req, res) => {
  res.sendFile('/Users/abdulmonemdakheel/myProjects/video-chat-backend/socketIo/public/index.html');
});

app.use(express.static(path.join(__dirname, '../public'))); 
// @ts-ignore
app.use(authenticate);
 



onboardingRoutes(app);
roadmapRoutes(app);
adminOnboardingRoutes(app);


setAdmin();

app.get('/', (req, res) => {
  res.json('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


