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
exports.onboardingRoutes = void 0;
const questions_json_1 = __importDefault(require("../questions.json")); // Import questions data
const ai_1 = require("../ai");
const questionKeywords = {
    'q1': 'skills',
    'q2': 'availability',
    'q3': 'primary_goal',
    'q4': 'work_preference',
    'q5': 'financial_comfort',
    'q6': 'biggest_concern',
    'q7': 'approach_to_success',
    'q8': 'confidence_level',
    'q9': 'needs',
};
const onboardingRoutes = (app) => {
    // Fetch onboarding questions
    app.get('/onboarding/questions', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('====================================');
        console.log('onboardingRoutes');
        console.log('====================================');
        try {
            const questions = questions_json_1.default.questions; // Use imported questions data
            res.json({ questions });
        }
        catch (error) {
            console.error('Error fetching onboarding questions:', error);
            res.status(500).json({ error: 'Failed to fetch questions' });
        }
    }));
    // Submit answers
    app.post('/onboarding/answers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('====================================');
        console.log('onboardingRoutes', req.body);
        console.log('====================================');
        const { answers } = req.body;
        console.log('====================================');
        console.log('answers', answers);
        console.log('====================================');
        const parseAnswersForAi = answers.map((answer) => {
            return {
                [questionKeywords[answer.questionId]]: answer.answer,
            };
        }).reduce((acc, answer) => {
            return Object.assign(Object.assign({}, acc), answer);
        }, {});
        console.log('====================================');
        console.log('parseAnswersForAi', parseAnswersForAi);
        console.log('====================================');
        // Send answers to AI
        const sideHustles = yield (0, ai_1.getSideHustlesFitBasedOnAnswers)(parseAnswersForAi);
        res.json({ success: true, data: sideHustles });
    }));
    // submit chosen side hustle
    app.post('/onboarding/sumbit/side-hustle', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('====================================');
        console.log('onboardingRoutes', req.body);
        console.log('====================================');
        const { sideHustleRoadmapRequest } = req.body;
        console.log('====================================');
        console.log('sideHustleId', sideHustleRoadmapRequest);
        console.log('====================================');
        // Send answers to AI
        const roadmap = yield (0, ai_1.getSideHustleRoadmap)(sideHustleRoadmapRequest);
        res.json({ success: true, data: roadmap });
    }));
};
exports.onboardingRoutes = onboardingRoutes;
//# sourceMappingURL=onboarding.js.map