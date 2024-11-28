 import chatResponse from  "../roadmap.json";


export const roadmapRoutes = (app) => {

    app.get('/roadmap', async (req: Request, res) => {
      

        // for now response from the file roadmap.json

        const content = chatResponse.choices[0].message.content;

  const parsedContent = JSON.parse(content);

  console.log({parsedContent});

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



        res.json({roadmap: parsedContent.roadmap });
            
    });
    

};