import {Response } from "express";
import questionsData from "../../questions.json"; // Import questions data
import { getSideHustleRoadmap, getSideHustlesFitBasedOnAnswers, SideHustleRoadmapRequest } from "../ai";
import UsersStore from "../classes/UsersStore";
import { Request } from "../types";
import { Roadmap } from "../db/models";

export type OnboardingQuestion={
    id:string,
    questionText:string,
    questionType:'text'|'select'|'multi-select'| 'multi-select-with-input' | 'single-select-with-input',
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


export const onboardingRoutes = (app, usersStore:UsersStore) => {
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
 
    const { answers } = req.body as { answers: OnboardingAnswer[] };

    const {uid} = req.userInfo;

    

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


    // save parsed answers to db

    try {

      const sideHustles = await getSideHustlesFitBasedOnAnswers(parseAnswersForAi);

      // save answers to db
      await usersStore.saveUserAnswers(uid,parseAnswersForAi);        

      // save side hustles to db
      await usersStore.saveUserSideHustlesTopThree(uid,sideHustles);


      res.json({ success: true, data: sideHustles });
    

    } catch (error) {
        console.log('====================================');
        console.log('error saving answers to db',error);
        console.log('====================================');
    }


    // Send answers to AI
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

    const totalNumberOfTasks = roadmap.roadmap.reduce((acc, level) => acc + level.sublevels.reduce((subAcc, sublevel) => subAcc + sublevel.tasks.length, 0), 0)


    console.log('====================================');
    console.log('totalNumberOfTasks',totalNumberOfTasks);
    console.log('====================================');

    // save roadmap to db

    const {uid} = req.userInfo;

    try {

      // create new roadmap in db

      const newRoadmap = await Roadmap.create({
        userId:uid,
        roadmapData:roadmap,
        name:sideHustleRoadmapRequest.sideHustle,
        totalNumberOfTasks:totalNumberOfTasks
      });


      res.json({ success: true, data: newRoadmap });
       
    } catch (error) {
        console.log('====================================');
        console.log('error saving roadmap to db',error);
        console.log('====================================');
    }
    
   
  });


};


