export class Option {
    id: number;
    questionId: number;
    name: string;
    isAnswer: boolean;
    points: number;
    selected: boolean;    

    constructor(data: any) {
        data = data || {};
        this.id = data.id;
        this.questionId = data.questionId;
        this.name = data.name;
        this.points= data.points;
        this.isAnswer = data.isAnswer;
    }
}
