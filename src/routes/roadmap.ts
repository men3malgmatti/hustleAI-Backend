import chatResponse from  "../../roadmap.json";
import UsersStore from "../classes/UsersStore";
import { Roadmap } from "../db/models";
import { Request } from "../types";


export const roadmapRoutes = (app) => {

  app.get('/roadmap', async (req: Request, res) => {
      

        // for now response from the file roadmap.json

  // const content = chatResponse.choices[0].message.content;

  // const parsedContent = JSON.parse(content);

  // console.log({parsedContent});

  // get user roadmap from db

  const roadmap = await Roadmap.findOne({where:{userId:req.userInfo.uid}});

  // console.log('====================================');
  // console.log('roadmap',roadmap.toJSON().roadmapData.roadmap);
  // console.log('====================================');

  const roadmapJson = roadmap?.toJSON()

  if(!roadmapJson){
    return res.json({error:'No roadmap found'})
  }

   const {totalNumberOfTasks,progress} = roadmapJson

  

  if (totalNumberOfTasks === 0) {
    return res.json({
      roadmap,
      overallProgress: 0,
      currentLevelIndex: 0,
      currentSubLevelIndex: 0,
      currentLevelProgressPercentage: 0,
      currentSubLevelProgressPercentage: 0,
      currentTaskIndex: 0,
    });
  }

  const overallProgress = Math.round((progress / totalNumberOfTasks) * 100);

  const totalNumberOfLevels = roadmapJson.roadmapData.roadmap.length
  const tasksPerLevel = Math.floor(totalNumberOfTasks/totalNumberOfLevels) || 1;
  const tasksPerSubLevels = Math.floor(tasksPerLevel/4) || 1;

  const sanitizedProgress = Math.min(progress, totalNumberOfTasks);

  const currentLevel = Math.min(
    Math.floor(sanitizedProgress / tasksPerLevel) + 1,
    totalNumberOfLevels
  );

  const maxSubLevels = 4; // Define as per your roadmap structure
  const currentSubLevel = Math.min(
    Math.floor((sanitizedProgress - (currentLevel - 1) * tasksPerLevel) / tasksPerSubLevels) + 1,
    maxSubLevels
  );

  const currentTask = ((progress % tasksPerSubLevels) + 1) > tasksPerSubLevels 
    ? 1 
    : (progress % tasksPerSubLevels) + 1;

  const currentLevelProgressPercentage = Math.round(
    ((sanitizedProgress - (currentLevel - 1) * tasksPerLevel) / tasksPerLevel) * 100
  );

  const currentSubLevelProgressPercentage = Math.round(
    (
      (sanitizedProgress -
        (currentLevel - 1) * tasksPerLevel -
        (currentSubLevel - 1) * tasksPerSubLevels) /
      tasksPerSubLevels
    ) * 100
  );

  // subtract 1 from each of the indexes to make them 0 based

  const currentLevelIndex = currentLevel - 1
  const currentSubLevelIndex = currentSubLevel - 1
  const currentTaskIndex = currentTask - 1

  
  res.json({roadmap,overallProgress,currentLevelIndex,currentSubLevelIndex,currentLevelProgressPercentage,currentSubLevelProgressPercentage,currentTaskIndex });
            
  });
    

};



export const topThreeSideHustles = async (app,usersStore:UsersStore)=>{

    app.get('/top-three-side-hustles',async(req:Request,res)=>{

        const topThreeSideHustles = await usersStore.getUserSideHustlesTopThree(req.userInfo.uid)

        res.json({topThreeSideHustles})
    })


}


export const completeTask = async (app)=>{

  // grab the roadmap of the user and add one to the progress

  app.get('/task-completion',async(req:Request,res)=>{

   
    const roadmap = await Roadmap.findOne({where:{userId:req.userInfo.uid}})

    // check if the task is the last task 

    const totalNumberOfTasks = roadmap?.toJSON().totalNumberOfTasks

    const progress = roadmap?.toJSON().progress

    if(progress === totalNumberOfTasks){
      return res.json({error:'No more tasks to complete'})
    }

    const updatedRoadmap = await roadmap?.update({progress:roadmap.progress + 1})

    res.json({updatedRoadmap})

  })

}

