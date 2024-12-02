import  { DataTypes, ForeignKey, HasManyAddAssociationMixin, HasManyAddAssociationsMixin, HasManyCountAssociationsMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManyHasAssociationMixin, HasManyHasAssociationsMixin, HasManyRemoveAssociationMixin, HasManyRemoveAssociationsMixin, HasManySetAssociationsMixin, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, NonAttribute } from 'sequelize'; 
import sequelize from './pgSequelize';
import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { RoadmapSteps } from '../types';




export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<string>;
    declare username: string;
    declare email: string|null;
    declare photoUrls: string[]|null;
    declare age: number|null;
    declare gender: string|null;
    declare registrationCompleted: boolean;
    declare role: 'user'|'admin'|'host';
    declare balance: number|null;
    declare deviceToken: string|null;
    declare numberOfMissedNotifications: number;
    declare answers: Record<string, string>|null;

    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;



  }

User.init({
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique:false
      },
      
      email: {
        type: DataTypes.STRING,
      },

      photoUrls: {  
        type: DataTypes.ARRAY(DataTypes.STRING),
      },

      age:{
        type: DataTypes.INTEGER,
      },

      role:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user'
      },

      gender:{
        type: DataTypes.STRING,
      },

      balance:{
        type: DataTypes.INTEGER,
      },

      registrationCompleted:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },

      deviceToken:{
        type: DataTypes.STRING,
      },

      numberOfMissedNotifications:{
        type: DataTypes.INTEGER,
        defaultValue: 0
      },

      answers:{
        type: DataTypes.JSONB,
        allowNull: true,
      },

      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      }
},{
    sequelize,
    modelName: 'User',
    tableName: 'users'
})


export class Roadmap extends Model<InferAttributes<Roadmap>, InferCreationAttributes<Roadmap>> {
    declare id: string;
    declare name: string;
    declare roadmapData: RoadmapSteps;
    declare userId: ForeignKey<User['id']>;
    declare progress: number; // new property to track progress
    declare createdAt?: Date;
    declare updatedAt?: Date;
}

Roadmap.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      roadmapData: {
        type: DataTypes.JSONB, // Use JSONB for Postgres to allow indexing and better performance
        allowNull: false,
      },
      progress: {
        type: DataTypes.INTEGER, // or DataTypes.INTEGER if you prefer whole numbers
        defaultValue: 0,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,

       

    },
    {
      sequelize,
      modelName: 'Roadmap',
      tableName: 'roadmap',
    }
  );


export class OnboardingQuestion extends Model<
  InferAttributes<OnboardingQuestion>,
  InferCreationAttributes<OnboardingQuestion>
> {
  declare id: number;
  declare questionText: string;
  declare questionType: string; // e.g., 'text', 'multiple_choice'
  declare options?: string[];   // For multiple-choice questions
  declare createdAt?: Date;
  declare updatedAt?: Date;
}


OnboardingQuestion.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      questionText: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      questionType: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      options: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'OnboardingQuestion',
      tableName: 'onboarding_questions',
    }
  );


export class UserOnboardingAnswer extends Model<InferAttributes<UserOnboardingAnswer>,
InferCreationAttributes<UserOnboardingAnswer>> {

    declare id: number;
    declare userId: string;
    declare questionId: number;
    declare answer: string;
    declare createdAt?: Date;
    declare updatedAt?: Date;
}

UserOnboardingAnswer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      questionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'UserOnboardingAnswer',
      tableName: 'user_onboarding_answers',
    }
  );
  
UserOnboardingAnswer.belongsTo(User, { foreignKey: 'userId' });
UserOnboardingAnswer.belongsTo(OnboardingQuestion, { foreignKey: 'questionId' });


User.hasMany(Roadmap, { foreignKey: {name:'userId',allowNull:false}});
Roadmap.belongsTo(User);


export const syncModels= async ()=>{

    try {
        await sequelize.sync({alter:true});
        console.log('====================================');
        console.log('synced models');
        console.log('====================================');
    } catch (error) {
        console.log('====================================');
        console.log('error syncing models',error);
        console.log('====================================');
    }   

    
}
