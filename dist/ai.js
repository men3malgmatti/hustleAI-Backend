"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSideHustleRoadmap = exports.getSideHustlesFitBasedOnAnswers = exports.AI = void 0;
const openai_1 = __importDefault(require("openai"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
class AI {
    constructor() {
        this.chatCompletions = () => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.openai.chat.completions.create({
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
        });
        this.openai = new openai_1.default({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }
    chat(systemMessage, userMessage, jsonSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            this.systemMessage = systemMessage;
            this.userMessage = userMessage;
            this.jsonSchema = jsonSchema;
            const response = yield this.chatCompletions();
            return response;
        });
    }
}
exports.AI = AI;
const getSideHustlesFitBasedOnAnswers = (answers) => __awaiter(void 0, void 0, void 0, function* () {
    const ai = new AI();
    const systemMessage = "You are an expert in guiding the young generation on how to start their own side hustles. Tailor your recommendations to the user's profile and the current market trends and state, emphasizing high-growth areas and realistic opportunities.";
    const jsonSchema = jsonSchemaForSideHustleTopRecommendations;
    const userAnswers = answers;
    const userAnswersString = JSON.stringify(userAnswers);
    const userMessage = `user profile:\n\n${userAnswersString}\n\n\nBased on this user profile, I want the top 3 side hustles tailored to their information. For each side hustle, include:\n- The name of the side hustle. \n- The reason why this side hustle is a good fit for the user.\n- The current market status for this side hustle.\n- The potential earning prospects.\n- The difficulty level (e.g., Beginner, Intermediate, Advanced).`;
    // const chatResponse= await ai.chat(systemMessage, userMessage, jsonSchema);
    // read the response from a file
    const chatResponse = require('./response.json');
    const content = chatResponse.choices[0].message.content;
    const parsedContent = JSON.parse(content);
    console.log({ parsedContent });
    const sideHustles = parsedContent.schema.hustles;
    console.log({ sideHustles });
    // write the response to a file
    const fs = require('fs');
    fs.writeFile('response.json', JSON.stringify(chatResponse), (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
    return sideHustles;
});
exports.getSideHustlesFitBasedOnAnswers = getSideHustlesFitBasedOnAnswers;
const getSideHustleRoadmap = (sideHustleRoadmapRequest) => __awaiter(void 0, void 0, void 0, function* () {
    const ai = new AI();
    const systemMessage = "You are an expert in creating comprehensive, step-by-step roadmaps for young individuals starting side hustles. Your goal is to provide a structured, actionable plan broken into levels, sublevels, and tasks. Levels should represent tangible milestones (achievable in about a month), sublevels are practical outcomes achieved in about a week, and tasks are daily actions users can take to achieve those outcomes.";
    const jsonSchema = roadMapJsonSchema;
    const userMessage = `You are an expert in creating detailed roadmaps for individuals starting a side hustle. Based on the following user information: ${sideHustleRoadmapRequest} \nCreate a comprehensive roadmap for the user to follow. The roadmap should:\nBe divided into 3 levels, with each level representing a month-long milestone.\nEach level should include 2–4 sublevels, representing practical outcomes achievable in about a week.\nEach sublevel should be broken down into 3–5 actionable tasks that the user can complete daily.\nAlign the tasks with the user’s skills, time availability, and financial constraints.\nHighlight tangible results that the user should achieve by the end of each level.`;
    const chatResponse = yield ai.chat(systemMessage, userMessage, jsonSchema);
    console.log({ chatResponse });
    const fs = require('fs');
    fs.writeFile('roadmap.json', JSON.stringify(chatResponse), (err) => {
        if (err) {
            throw err;
        }
        console.log("JSON data is saved.");
    });
    return chatResponse;
});
exports.getSideHustleRoadmap = getSideHustleRoadmap;
//# sourceMappingURL=ai.js.map