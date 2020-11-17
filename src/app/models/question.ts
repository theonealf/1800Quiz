import { epok } from './epok';
import { Option } from './option';

export class Question {
    id: number;
    name: string;
    questionTypeId: number;
    options: Option[];
    points:number;
    answered: boolean;
    epok:epok[];

    constructor(data: any) {
        data = data || {};
        this.id = data.id;
        this.name = data.name;
        this.questionTypeId = data.questionTypeId;
        this.points= data.points;
        this.options = [];
        data.options.forEach(o => {
            this.options.push(new Option(o));
        });
        this.epok= data.epok; 
    }
}
