import { LightningElement,wire } from 'lwc';
import IMAGES from '@salesforce/resourceUrl/Images'
import { loadScript, loadStyle } from 'lightning/platformResourceLoader';
import ImagesFolder from "@salesforce/resourceUrl/ImagesFolder";
import backgroundImage from "@salesforce/resourceUrl/backgroundImage";
import Workout from "@salesforce/resourceUrl/Workout";
import buttonSound from "@salesforce/resourceUrl/buttonSound";
import getClickedGoals from '@salesforce/apex/GoalsController.getClickedGoals';
import getAllGoals from '@salesforce/apex/GoalsController.getAllGoals';
import getHealthGoals from '@salesforce/apex/GoalsController.getHealthGoals';
import getGoalsByApiAndId from '@salesforce/apex/GoalsController.getGoalsByApiAndId';
import editByRecordIdAndNameAndApi from '@salesforce/apex/GoalsController.editByRecordIdAndNameAndApi';
import getAllGoalsFromApex from '@salesforce/apex/GoalsController.getAllGoalsFromApex';
import { refreshApex } from "@salesforce/apex";

export default class SkillCards extends LightningElement {

    buttonSound = new Audio(buttonSound)
    backgroundImageUrl = ImagesFolder + '/ImagesFolder/Images/backgroundImage.jpg'
    cardBackgroundImage = ImagesFolder + '/ImagesFolder/Images/cardbackgroundImage.jpg'
    workoutUrl = Workout
    adminImageURL = IMAGES + '/admin.png';
    trainingImageURL = IMAGES + '/training.png';
    serviceImageURL = IMAGES + '/service.png';

    healthGoals;
    allGoalsFromApex
    wiredAllGoals
    @wire(getAllGoals)
    wiredData(result) {
      this.wiredAllGoals = result
      if (result.data) {
        console.log('Data', result.data);
        this.allGoalsFromApex = result.data
        console.log(JSON.stringify(this.allGoalsFromApex))
        this.allGoalsFromApex = this.allGoalsFromApex.map(goal => ({ ...goal, cardFlip: true }));
      } else if (result.error) {
        console.error('Error 1:', result.error);
      }
    }

    allGoals;

    connectedCallback() {
        //this.getDataFromApex();
        console.log(window.location.origin)
        this.getAllGoalsFromApexInConnected();
    }

    getAllGoalsFromApexInConnected(){
        getAllGoalsFromApex()
        .then(data => {
            this.allGoals = data
            this.allGoals = this.allGoals.map(goal => ({ ...goal, cardFlip : true }));
            console.log('this.allGoals :',JSON.stringify(this.allGoals))
        })
        .catch(error => {
            console.error('Error calling Apex method: ', error);
        }); 
    }

    getDataFromApex(){
        getAllGoalsFromApex()
        .then(data => {
            this.allGoals = data
            //this.allGoals = this.allGoals.map(goal => ({ ...goal, cardFlip : true }));
            console.log('this.allGoals :',JSON.stringify(this.allGoals))
        })
        .catch(error => {
            console.error('Error calling Apex method: ', error);
        }); 
    }

    goaleditMode =false

    showGoalInput(event) {
        this.goaleditMode = !this.goaleditMode
        this.editVariable = !this.editVariable
    }

    editVariable = true

    showCard = true;
    showUncheck = true

    handleDoneClick(){
        this.editVariable = true
        this.goaleditMode = false
    }

    goalId;

    clikedGoals;
    goalApiName
    clickedGoal

    subGoals
    clickedGoalId
    handleCardClick(event){
        this.buttonSound.play()
        //this.showCard = !this.showCard;
        // console.log('this.showCard :',this.showCard)
        // this.goalApiName = event.currentTarget.dataset.api
        // console.log('this.goalApiName :',this.goalApiName);
        // this.goalId = event.currentTarget.dataset.id;
        // console.log('recordId :',this.recordId);

        // getClickedGoals({ goalApiName: this.goalApiName})
        //     .then(result => {
        //         this.clikedGoals = result
        //         console.log('this.clikedGoals :',this.clikedGoals)
        //         this.clikedGoals = this.clikedGoals.map(goal => ({ ...goal, editMode: false }));
        //     })
        //     .catch(error => {
        //         console.error('Error calling Apex method:', error);
        //     });

        // this.updateGoalId(this.goalId);  
        

        this.clickedGoalId = event.currentTarget.dataset.id;
        console.log('this.clickedGoalId :',this.clickedGoalId)
        // Find the clicked goal in the goalsData array
        this.clickedGoal = this.allGoalsFromApex.find(goal => goal.Id === this.clickedGoalId);
        console.log('clickedGoal :',JSON.stringify(this.clickedGoal));
        this.goalApiName = event.currentTarget.dataset.api
        this.goalApi = event.currentTarget.dataset.goalapi
        console.log('this.goalApi :',this.goalApi)
        console.log('this.goalApiName :',this.goalApiName)
        
        console.log('clickedGoal :',JSON.stringify(this.clickedGoal[this.goalApiName]))

        this.subGoals = this.clickedGoal[this.goalApiName]

        this.subGoals = this.subGoals.map(goal => ({ ...goal, editMode: false }));

        console.log('this.subGoals :',JSON.stringify(this.subGoals))
        this.updateGoalId(this.clickedGoalId); 

        // Toggle the cardFlip property to show/hide sub-goals
        // if (clickedGoal) {
        //     clickedGoal.cardFlip = !clickedGoal.cardFlip;

        //     // Update the goalsData property to trigger re-rendering
        //     this.goalsData = [...this.goalsData];
        // }

    }

    updateGoalId(id) {
        this.allGoalsFromApex = this.allGoalsFromApex.map(goal => ({
                ...goal,
                cardFlip: goal.Id !== id
        }));
    }


    handleCardBackClick(){
        this.buttonSound.play()
        this.allGoalsFromApex = this.allGoalsFromApex.map(goal => ({ ...goal, cardFlip : true }));
        //console.log('this.showCard :',this.showCard)
        
    }

    handleInput(){
        console.log('inside check');
        this.showUncheck = false
    }
    recordId;
    recordName;
    goalApi;
    clickedSubGoal

    handleGoalEditClick(event){
        this.buttonSound.play()
        this.recordId = event.currentTarget.dataset.id;
        console.log('recordId :',this.recordId);

        this.updateEditModeById(this.recordId); 

        console.log('this.goalApiName :',this.goalApiName);

        this.clickedSubGoal = this.subGoals.find(subGoal => subGoal.Id === this.recordId);

        console.log('this.clickedSubGoal :',JSON.stringify(this.clickedSubGoal))
        this.recordName = this.clickedSubGoal.Name

    }

    updateEditModeById(id) {
        this.subGoals = this.subGoals.map(goal => ({
                ...goal,
                editMode: goal.Id === id
        }));
    }


    handleOnTickFromInput(event){
        this.buttonSound.play()
        console.log('event :',event.detail.editMode);

        this.recordName = event.detail.recordName
        console.log('this.recordName :',this.recordName);
        this.recordId = event.detail.recordId
        console.log('this.recordId :',this.recordId);
        console.log('this.goalApiName :',this.goalApiName);
        //this.healthGoals = this.healthGoals.map(goal => ({ ...goal, editMode: false }));
        editByRecordIdAndNameAndApi({ recordId: this.recordId, recordName : this.recordName, goalApiName : this.goalApi})
        .then(result => {
            console.log('record updated : ',result);
            //console.log('this.clikedGoals :',this.clikedGoals);
            this.subGoals = result;
            this.subGoals = this.subGoals.map(goal => ({ ...goal, editMode: false }));
            refreshApex(this.wiredAllGoals).then(() => {
                this.updateGoalId(this.clickedGoalId); 
              });
            
            
        })
        .catch(error => {
            console.error('Error calling Apex method: ', error);
        });

        // const childComponent = this.template.querySelector('c-small-edit-component');
        // if (childComponent) {
        //     childComponent.recordName = this.recordName;
        // }
    }   

    baseUrl = "https://nishantcom2-dev-ed.develop.my.site.com"

    get getbackgroundImage(){
        return `background-image: url(${this.baseUrl+this.backgroundImageUrl})`; 
    }

    get getCardBackgroundImage(){
        return `background-image: url(${this.baseUrl+this.cardBackgroundImage})`;
    }

    refreshData() {
        console.log('inside resfreshData')
        return refreshApex(this.wiredData);
    }
}