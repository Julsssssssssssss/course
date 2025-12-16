import { ISkill } from "../models/skill.model";

export interface ISkillService {
    getSkills(): Promise<readonly ISkill[]>;
}