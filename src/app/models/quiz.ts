import { epok } from './epok';
import { QuizConfig } from './quiz-config';
import { Question } from './question';

export class Quiz {
    id: number;
    name: string;
    description: string;
    config: QuizConfig;
    questions: Question[];
    epok:epok[];    

    constructor(data: any, config:any) {
        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.description = data.description;
            this.config = new QuizConfig(config);
            this.questions = [];
            data.questions.forEach(q => {
                this.questions.push(new Question(q));
            });
            if(this.config.shuffleQuestions){
                this.questions = this.randomArrayShuffle(this.questions);
            }
            this.epok= data.epok;             
            
        }
    }
    
    randomArrayShuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
        return array;
      }
}
