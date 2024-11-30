import { Request, Response } from "express";
import questionsData from "../../questions.json"; // Import questions data
import { getSideHustleRoadmap, getSideHustlesFitBasedOnAnswers, SideHustleRoadmapRequest } from "../ai";

export type OnboardingQuestion={
    id:string,
    questionText:string,
    questionType:'text'|'select'|'multi-select',
    options:string[]|null |undefined,
}

export type OnboardingAnswer={
    questionId:string,
    answer:string
}


const questionKeywords = {
    'q1':'skills',
    'q2':'availability',
    'q3':'primary_goal',
    'q4':'work_preference',
    'q5':'financial_comfort',
    'q6':'biggest_concern',
    'q7':'approach_to_success',
    'q8':'confidence_level',
    'q9':'needs',

};


export const onboardingRoutes = (app) => {
  // Fetch onboarding questions
  app.get('/onboarding/questions', async (req: Request, res: Response) => {
    console.log('====================================');
    console.log('onboardingRoutes');
    console.log('====================================');
    try {
      const questions = questionsData.questions; // Use imported questions data
      res.json({ questions });
    } catch (error) {
      console.error('Error fetching onboarding questions:', error);
      res.status(500).json({ error: 'Failed to fetch questions' });
    }
  });

  // Submit answers
  app.post('/onboarding/answers', async (req: Request, res: Response) => {
    console.log('====================================');
    console.log('onboardingRoutes',req.body);
    console.log('====================================');

    const { answers } = req.body as { answers: OnboardingAnswer[] };

    console.log('====================================');
    console.log('answers',answers);
    console.log('====================================');

    const parseAnswersForAi = answers.map((answer) => {
        return {  
            [questionKeywords[answer.questionId]]: answer.answer,
        };
    }).reduce((acc, answer) => {
        return { ...acc, ...answer }
    }, {});

    console.log('====================================');
    console.log('parseAnswersForAi',parseAnswersForAi);
    console.log('====================================');

    // Send answers to AI
    const sideHustles = await getSideHustlesFitBasedOnAnswers(parseAnswersForAi);
    
    
    res.json({ success: true, data: sideHustles });
  });



  // submit chosen side hustle

  app.post('/onboarding/submit/side-hustle', async (req: Request, res: Response) => {
    console.log('====================================');
    console.log('onboardingRoutes',req.body);
    console.log('====================================');

    const sideHustleRoadmapRequest  = req.body as  SideHustleRoadmapRequest ;

    console.log('====================================');
    console.log('sideHustleId',sideHustleRoadmapRequest);
    console.log('====================================');

    // Send answers to AI
    const roadmap = await getSideHustleRoadmap(sideHustleRoadmapRequest);
    
    res.json({ success: true, data: roadmap });
  });


};


