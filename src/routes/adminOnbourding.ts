
import { Response } from 'express';
import { OnboardingQuestion } from '../db/models';
import verifyAdmin from '../middlewares/adminAuth';
// import questionsData from "../../questions.json"; // Import questions data
import { Request } from '../types';

export const adminOnboardingRoutes = (app) => {
  // Create a new question
  app.post('/admin/onboarding/questions',verifyAdmin, async (req: Request, res: Response) => {

    const { questionText, questionType, options, id } = req.body;


    console.log('====================================');
    console.log('adminOnboardingRoutes questions',req.body);
    console.log('====================================');

    try {
      const question = await OnboardingQuestion.create({
        id:parseInt(id),
        questionText,
        questionType,
        options,
      });
      res.json({ question });
    } catch (error) {
      console.error('Error creating question:', error);
      res.status(500).json({ error: 'Failed to create question' });
    }
  });

  // Update a question
  app.put('/admin/onboarding/questions/:id',verifyAdmin, async (req: Request, res: Response) => {
    
    
    const { id } = req.params;
    const { questionText, questionType, options } = req.body;
    try {
      await OnboardingQuestion.update(
        { questionText, questionType, options },
        { where: { id } }
      );
      
      // return updated question
      const question = await OnboardingQuestion.findByPk(id);
      res.json({ question });

    } catch (error) {
      console.error('Error updating question:', error);
      res.status(500).json({ error: 'Failed to update question' });
    }
  });

  // Delete a question
  app.delete('/admin/onboarding/questions/:id',verifyAdmin, async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      await OnboardingQuestion.destroy({ where: { id } });
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).json({ error: 'Failed to delete question' });
    }
  });


  // Get all questions

  app.get('/admin/onboarding/questions',verifyAdmin, async (req: Request, res: Response) => {


    console.log('====================================');
    console.log('adminOnboardingRoutes questions');
    console.log('====================================');
    

    try {
      const questions = await OnboardingQuestion.findAll({
        order: [['id', 'ASC']]
      });

      // const questions = questionsData.questions; // Use imported questions data

      res.json({ questions });
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  });
};