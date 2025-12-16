import { ISkill } from "../models/skill.model";

export interface ISkillService {
  getSkills(): Promise<readonly ISkill[]>;
}

export class MockSkillService implements ISkillService {
  private readonly skills: ISkill[] = [
    { id: 1, name: 'Draw', category: 'Design' },
    { id: 2, name: 'Photoshop', category: 'Design' },
    { id: 3, name: 'HTML', category: 'Frontend' },
    { id: 4, name: 'CSS', category: 'Frontend' }, // исправил category с Backend на Frontend
    { id: 5, name: 'Python', category: 'Backend' },
    { id: 6, name: 'C++', category: 'Backend' },
    { id: 7, name: '3DMax', category: '3D Design' },
    { id: 8, name: 'Illustrator', category: 'Design' },
    { id: 9, name: 'AE', category: 'Animation' }
  ];

  async getSkills(): Promise<readonly ISkill[]> {
    console.log('Загрузка данных...');
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.skills;
  }
}