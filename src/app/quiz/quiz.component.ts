import { Component, OnInit } from '@angular/core';

import { QuizService } from '../services/quiz.service';
import { HelperService } from '../services/helper.service';
import { Option, Question, Quiz, QuizConfig } from '../models/index';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css'],
  providers: [QuizService]
})
export class QuizComponent implements OnInit {
  quizes: any[];
  quiz: Quiz = new Quiz(null, null);
  mode = 'quiz';
  quizName: string;
  config: QuizConfig = {
    'allowBack': true,
    'allowReview': false,
    'autoMove': true,  // if true, it will move to next question automatically when answered.
    'duration': 300,  // indicates the time (in secs) in which quiz needs to be completed. 0 means unlimited.
    'pageSize': 1,
    'requiredAll': true,  // indicates if you must answer all the questions before submitting.
    'richText': false,
    'shuffleQuestions': true,
    'shuffleOptions': true,
    'showClock': true,
    'showPager': true,
    'theme': 'none',
    'issubmitted': false
  };
  currentscore:number= 0;
  mainscore:any= 0;
  epoktext:any="";

  pager = {
    index: 0,
    size: 1,
    count: 1
  };
  timer: any = null;
  startTime: Date;
  endTime: Date;
  ellapsedTime = '00:00';
  duration = '';
  show=false;
  visamainscore=false;
  visaqiuzvaltop= false;

  constructor(private quizService: QuizService) { }

  ngOnInit() {
    this.quizes = this.quizService.getAll();
    this.quizName = this.quizes[0].id;
    this.loadQuiz(this.quizName);
    this.config.issubmitted = false;
    
  }

  loadQuiz(quizName: string) {
    this.quizService.get(quizName).subscribe(res => {
      this.quiz = new Quiz(res, this.config);
      this.pager.count = this.quiz.questions.length;
      this.startTime = new Date();
      this.ellapsedTime = '00:00';
      this.timer = setInterval(() => { this.tick(); }, 1000);
      this.duration = this.parseTime(this.config.duration);
      this.config.issubmitted = false;
      this.mainscore=0;
      this.goTo(0);
    });
    this.mode = 'quiz';
  }

  tick() {
    const now = new Date();
    const diff = (now.getTime() - this.startTime.getTime()) / 1000;
    if (diff >= this.config.duration && this.config.showClock == true && this.config.issubmitted == false) {     
      this.onSubmit();      
    }
    this.ellapsedTime = this.parseTime(diff);
  }

  parseTime(totalSeconds: number) {
    let mins: string | number = Math.floor(totalSeconds / 60);
    let secs: string | number = Math.round(totalSeconds % 60);
    mins = (mins < 10 ? '0' : '') + mins;
    secs = (secs < 10 ? '0' : '') + secs;
    return `${mins}:${secs}`;
  }

  get filteredQuestions() {
    return (this.quiz.questions) ?
      this.quiz.questions.slice(this.pager.index, this.pager.index + this.pager.size) : [];
  }

  onSelect(question: Question, option: Option) {
    if (question.questionTypeId === 1) {
      question.options.forEach((x) => { if (x.id !== option.id) x.selected = false; });
    }

    if (this.config.autoMove) {
      this.goTo(this.pager.index + 1);
    }
  }
  onClick(question: Question, option: Option) {
    if (question.questionTypeId === 1) {
      question.options.forEach((x) => { 
        if(x.id !== option.id){
          x.selected = false
        }else{ 
        x.selected = true; }
      });
    }

    if (this.config.autoMove) {
      
      if (this.pager.index > this.pager.size){             
        this.onSubmit();
      }else{
         this.goTo(this.pager.index + 1);
      }

      this.mainscore+= this.currentscore;
      this.currentscore= 0;
     
    }
    return false;
  }

  changeMode(newmode){
    this.mode= newmode;
    return false;
  }

  goTo(index: number) {
    if (index >= 0 && index < this.pager.count) {
      this.pager.index = index;
      this.mode = 'quiz';
    }
    return false;
  }

  isAnswered(question: Question) {
    return question.options.find(x => x.selected) ? 'Answered' : 'Not Answered';
  };

  isCorrect(question: Question) {
    return question.options.every(x => x.selected === x.isAnswer) ? 'correct' : 'wrong';
  };

  onSubmit() {
    let answers = [];
    this.quiz.questions.forEach(x => { 
      x.options.forEach(y => { 
        console.log(y.selected)
        if(y.selected == true){
          this.mainscore+= y.points
        }; 
      })
    this.quiz.questions.forEach(x => answers.push({ 'quizId': this.quiz.id, 'questionId': x.id, 'answered': x.answered,'points': x.points }));
          console.log(x.options);         
     
    });
    // Post your data to the server here. answers contains the questionId and the users' answer.
    console.log(this.quiz.questions);
    if(this.quiz.id == 2){
      this.mode = '1800tal';
      this.typavepok(this.mainscore);
    }else{
      this.mode = 'result';
    }    
    this.config.issubmitted = true;
    clearInterval(this.timer);
    return false;
  }

  typavepok(score){
    if(score== 0){
      this.epoktext="Du har inte valt något än"
    }
    this.quiz.epok.forEach((y) => { 
        console.log(y);
        if(score >= y.min && score <= y.max){
          this.epoktext = y.text;
          return false;
        }
    });
    
    
  }
  restart(){
    
    this.loadQuiz('data/hur1800.json');   
    this.mode = 'quiz'; 
  }
  

  
}
