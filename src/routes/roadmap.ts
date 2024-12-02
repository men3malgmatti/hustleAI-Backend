 import chatResponse from  "../../roadmap.json";
import { Roadmap } from "../db/models";
import { Request } from "../types";


export const roadmapRoutes = (app) => {

    app.get('/roadmap', async (req: Request, res) => {
      

        // for now response from the file roadmap.json

        const content = chatResponse.choices[0].message.content;

  const parsedContent = JSON.parse(content);

  // console.log({parsedContent});

  // get user roadmap from db

  const roadmap = await Roadmap.findOne({where:{userId:req.userInfo.uid}});

  // console.log('====================================');
  // console.log('roadmap',roadmap.toJSON().roadmapData.roadmap);
  // console.log('====================================');

  


  parsedContent.roadmap.forEach((level: any) => {
    console.log("Level:", level.level_name);
    level.sublevels.forEach((sublevel: any) => {
      console.log("Sublevel:", sublevel.sublevel_name);
      sublevel.tasks.forEach((task: any) => {
        console.log("Task:", task);
      });
    });
  }
  );



        res.json({roadmap });
            
    });
    

};