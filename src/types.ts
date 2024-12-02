import express from "express";
import { User as DbUser, Roadmap } from "./db/models";



export interface Request extends express.Request {
  userInfo: {uid:string,email:string};
}

export type RoadmapSteps = {
    roadmap: Level[];
  };
  
  type Level = {
    level_name: string;
    level_duration: string;
    tangible_result: string;
    sublevels: Sublevel[];
  };
  
  type Sublevel = {
    sublevel_name: string;
    sublevel_duration: string;
    tasks: string[];
  };
  


  export interface UserRecord extends DbUser{}

