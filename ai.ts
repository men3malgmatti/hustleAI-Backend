

import OpenAI from "openai";
import dotenv from "dotenv";
import { log } from "console";

dotenv.config();

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const  aiChat= async () => {

   
//     const response = await openai.chat.completions.create({
//       model: "gpt-4o",
//       messages: [
//         {
//           "role": "system",
//           "content": [
//             {
//               "type": "text",
//               "text": "You are an AI assistant that generates learning roadmaps. Based on the user's selection of a side hustle, provide:\n- A breakdown of skills to learn.\n- Actionable tasks with time estimates.\n- Suggested resources, focusing on the user's preferred learning style.\n"
//             }
//           ]
//         },
//         {
//           "role": "user",
//           "content": [
//             {
//               "type": "text",
//               "text": "user profile:\n\n{\n  \"user\": {\n    \"id\": \"67890\",\n    \"name\": \"Jamie Smith\",\n    \"age\": 20,\n    \"location\": \"Los Angeles, USA\",\n    \"skills\": [\"basic writing\"],\n    \"interests\": [\"technology\", \"remote work\", \"entrepreneurship\"],\n    \"goals\": \"Find a beginner-friendly side hustle to earn income while developing new skills.\",\n    \"availability\": \"5 hours per week\",\n    \"experience_level\": {\n      \"basic_writing\": \"beginner\"\n    },\n    \"preferred_learning_style\": \"video tutorials\"\n  }\n}\n\n\nGenerate a detailed roadmap for \"Freelance Content Writing\" based on the user's profile and availability of 5 hours per week.\n"
//             }
//           ]
//         }
//       ],
//       temperature: 1,
//       max_tokens: 2048,
//       top_p: 1,
//       frequency_penalty: 0,
//       presence_penalty: 0,
//       response_format: {
//         "type": "json_schema",
//         "json_schema": {
//           "name": "roadmap",
//           "strict": true,
//           "schema": {
//             "type": "object",
//             "properties": {
//               "roadmap": {
//                 "type": "object",
//                 "properties": {
//                   "side_hustle": {
//                     "type": "string",
//                     "description": "The name of the side hustle."
//                   },
//                   "tasks": {
//                     "type": "array",
//                     "description": "A list of tasks to complete for the side hustle.",
//                     "items": {
//                       "type": "object",
//                       "properties": {
//                         "task": {
//                           "type": "string",
//                           "description": "Description of the task."
//                         },
//                         "time_estimate": {
//                           "type": "string",
//                           "description": "Estimated time to complete the task."
//                         },
//                         "resources": {
//                           "type": "array",
//                           "description": "List of resources for the task.",
//                           "items": {
//                             "type": "string",
//                             "description": "A resource URL or description."
//                           }
//                         }
//                       },
//                       "required": [
//                         "task",
//                         "time_estimate",
//                         "resources"
//                       ],
//                       "additionalProperties": false
//                     }
//                   },
//                   "total_duration": {
//                     "type": "string",
//                     "description": "Estimated total duration to complete all tasks."
//                   }
//                 },
//                 "required": [
//                   "side_hustle",
//                   "tasks",
//                   "total_duration"
//                 ],
//                 "additionalProperties": false
//               }
//             },
//             "required": [
//               "roadmap"
//             ],
//             "additionalProperties": false
//           }
//         }
//       },
//     });
//     console.log(response);


//     // write the response to a file
//     const fs = require('fs');
//     fs.writeFile('response.json', JSON.stringify(response), (err: any) => {
//       if (err) {
//         throw err;
//       }
//       console.log("JSON data is saved.");
//     });
    

// }


export type SideHustleRoadmapRequest = {
    sideHustle: string;
    skills: any;
    avaliability: any;
    primary_goal: any;
    work_preference: any;
    financial_comfort: any;
}


const jsonSchemaForSideHustleTopRecommendations = {

      "name": "my_schema",
      "schema": {
        "type": "object",
        "required": [
          "name",
          "strict",
          "schema"
        ],
        "properties": {
          "name": {
            "type": "string",
            "description": "The name of the schema"
          },
          "schema": {
            "type": "object",
            "required": [
              "hustles"
            ],
            "properties": {
              "hustles": {
                "type": "array",
                "items": {
                  "type": "object",
                  "required": [
                    "hustle_name",
                    "reason",
                    "market_status",
                    "earning_prospects",
                    "difficulty_level"
                  ],
                  "properties": {
                    "reason": {
                      "type": "string",
                      "description": "The reason why this side hustle is a good fit for the user."
                    },
                    "hustle_name": {
                      "type": "string",
                      "description": "The name of the side hustle."
                    },
                    "market_status": {
                      "type": "string",
                      "description": "The current status of the market for this side hustle."
                    },
                    "difficulty_level": {
                      "type": "string",
                      "description": "The difficulty level required to succeed in this side hustle (e.g., Beginner, Intermediate, Advanced)."
                    },
                    "earning_prospects": {
                      "type": "string",
                      "description": "The potential earning prospects associated with this side hustle."
                    }
                  },
                  "additionalProperties": false
                },
                "description": "A list of recommended side hustles tailored to the user."
              }
            },
            "additionalProperties": false
          },
          "strict": {
            "type": "boolean",
            "description": "Indicates if the schema is strict"
          }
        },
        "additionalProperties": false
      },
      "strict": true
    };


const roadMapJsonSchema = {
  "name": "side_hustle_roadmap",
      "schema": {
        "type": "object",
        "required": [
          "roadmap"
        ],
        "properties": {
          "roadmap": {
            "type": "array",
            "items": {
              "type": "object",
              "required": [
                "level_name",
                "level_duration",
                "tangible_result",
                "sublevels"
              ],
              "properties": {
                "sublevels": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "required": [
                      "sublevel_name",
                      "sublevel_duration",
                      "tasks"
                    ],
                    "properties": {
                      "tasks": {
                        "type": "array",
                        "items": {
                          "type": "string",
                          "description": "A single task to be completed as part of this sublevel."
                        },
                        "description": "A list of actionable tasks under this sublevel."
                      },
                      "sublevel_name": {
                        "type": "string",
                        "description": "The name or focus of the sublevel."
                      },
                      "sublevel_duration": {
                        "type": "string",
                        "description": "The approximate time to complete this sublevel (e.g., 1 week)."
                      }
                    },
                    "additionalProperties": false
                  },
                  "description": "A list of sublevels within this level."
                },
                "level_name": {
                  "type": "string",
                  "description": "The name or focus of the level."
                },
                "level_duration": {
                  "type": "string",
                  "description": "The approximate time to complete this level (e.g., 1 month)."
                },
                "tangible_result": {
                  "type": "string",
                  "description": "The concrete outcome the user achieves after completing this level."
                }
              },
              "additionalProperties": false
            },
            "description": "A structured roadmap divided into levels, sublevels, and tasks."
          }
        },
        "additionalProperties": false
      },
      "strict": true
};


export class AI {


  openai: OpenAI;

  private systemMessage;
  
  private userMessage;

  private assistanceMessage;

  private jsonSchema;
  

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  private chatCompletions = async () => {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          "role": "system",
          "content": [
            {
              "type": "text",
              "text": this.systemMessage
            }
          ]
        },
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": this.userMessage
            }
          ]
        }
      ],
      temperature: 1,
      max_tokens: 2048,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      response_format: {
        "type": "json_schema",
        "json_schema": this.jsonSchema
      },
    });
    console.log(response);
    return response;

    

  };


  public async chat( systemMessage: string, userMessage: string, jsonSchema: any) {
    this.systemMessage = systemMessage;
    this.userMessage = userMessage;
    this.jsonSchema = jsonSchema;
    const response = await this.chatCompletions();
    return response;
  }




}


export const getSideHustlesFitBasedOnAnswers = async (answers:{
  [x: number]: string;
}) => {

  const ai= new AI();

  const systemMessage= "You are an expert in guiding the young generation on how to start their own side hustles. Tailor your recommendations to the user's profile and the current market trends and state, emphasizing high-growth areas and realistic opportunities."

  const jsonSchema= jsonSchemaForSideHustleTopRecommendations;

  const userAnswers= answers;

  const userAnswersString= JSON.stringify(userAnswers);

  const userMessage= `user profile:\n\n${userAnswersString}\n\n\nBased on this user profile, I want the top 3 side hustles tailored to their information. For each side hustle, include:\n- The name of the side hustle. \n- The reason why this side hustle is a good fit for the user.\n- The current market status for this side hustle.\n- The potential earning prospects.\n- The difficulty level (e.g., Beginner, Intermediate, Advanced).`;

  // const chatResponse= await ai.chat(systemMessage, userMessage, jsonSchema);

  // read the response from a file
  const chatResponse= require('./response.json');


  const content = chatResponse.choices[0].message.content;
  const parsedContent = JSON.parse(content);

  console.log({parsedContent});
  

  const sideHustles = parsedContent.schema.hustles;

  console.log({sideHustles});

  

  
  // write the response to a file
    const fs = require('fs');
    fs.writeFile('response.json', JSON.stringify(chatResponse), (err: any) => {
      if (err) {
        throw err;
      }
      console.log("JSON data is saved.");
    });

    return sideHustles;

  
};



export const getSideHustleRoadmap = async (sideHustleRoadmapRequest:SideHustleRoadmapRequest) => {

  console.log("====================================");
  console.log("sideHustleRoadmapRequest", sideHustleRoadmapRequest);
  console.log("====================================");
  

  const ai= new AI();

  const systemMessage= "You are an expert in creating comprehensive, step-by-step roadmaps for young individuals starting side hustles. Your goal is to provide a structured, actionable plan broken into levels, sublevels, and tasks. Levels should represent tangible milestones (achievable in about a month), sublevels are practical outcomes achieved in about a week, and tasks are daily actions users can take to achieve those outcomes."

  const jsonSchema= roadMapJsonSchema;

  const userAnswersString= JSON.stringify(sideHustleRoadmapRequest);

  const userMessage= `You are an expert in creating detailed roadmaps for individuals starting a side hustle. Based on the following user information: ${userAnswersString} \nCreate a comprehensive roadmap for the user to follow. The roadmap should:\nBe divided into 3 levels, with each level representing a month-long milestone.\nEach level should include 2–4 sublevels, representing practical outcomes achievable in about a week.\nEach sublevel should be broken down into 3–5 actionable tasks that the user can complete daily.\nAlign the tasks with the user’s skills, time availability, and financial constraints.\nHighlight tangible results that the user should achieve by the end of each level.`


  // const chatResponse= await ai.chat(systemMessage, userMessage, jsonSchema);

  // console.log({chatResponse});



  
  //  const fs = require('fs');
  //   fs.writeFile('roadmap.json', JSON.stringify(chatResponse), (err: any) => {
  //     if (err) {
  //       throw err;
  //     }
  //     console.log("JSON data is saved.");
  //   });

  //   return chatResponse;


  // read the response from a file

  const chatResponse= require('./roadmap.json');

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

  return parsedContent;


};
