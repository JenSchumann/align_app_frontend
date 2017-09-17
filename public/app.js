console.log('Align now with your future');

const app = angular.module('align_app', []);



//main controller
app.controller('mainController', ['$http',
  function($http){
    // this.test = "Align now with your future"
    const controller = this;
    this.url = 'http://localhost:3000';
    this.user = {};
    this.users = [];
    this.userPass = {};
    this.editDisplay = false;
    this.token = {};
    this.editUser = {};
    this.updatedUser = {};

    //pages hidden until toggled:
    this.registerModal = false;
    this.loginModal = false;
    this.home = true;
    this.userPage = false;
    this.plans = false;
    this.account = false;

    this.closeForm = function(){
    this.show = true;
    }


    //do i need this to toggle login?????
    this.loggedin = false;




    // register new user
  this.CreateUser = function(userPass) {
     $http({
       url: this.url + '/users',
       method: 'POST',
       data: { user: { username: userPass.username, password: userPass.password, grade: userPass.grade, interests: userPass.interests, strengths: userPass.strengths, aspirations: userPass.aspirations, date: userPass.date }},
     }).then(function(response) {
       console.log(response);
       this.user = response.data.user;
     })
   }

   // login user
  this.login = function(userPass) {
    this.userPass = userPass;
    $http({
      method: 'POST',
      url: this.url + '/users/login',
      data: { user: { username: userPass.username, password: userPass.password }},
    }).then(function(response) {
      console.log(response);
      this.user = response.data.user;
      localStorage.setItem('token', JSON.stringify(response.data.token));
      if (this.user === undefined){
        this.loggedin = false
      } else {
        this.loggedin = true;
      }
      console.log('user logged in? ', this.loggedin);
      console.log('the user is: ', this.user);
      console.log('the userPass username is: ', userPass.username);
    }.bind(this));
  }

    //get users  -- comment out if admin functionality is not built in 1st version of app
    this.getUsers = function() {
      $http({
        url: this.url + '/users',
        method: 'GET',
        headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
        }
      }).then(function(response) {
      console.log(response);
        if (response.data.status == 401) {
          this.error = "Unauthorized";
        } else {
          this.users = response.data
        }
      }.bind(this));
    }

    this.editedUser = {};

    this.updatedUser = function(username, password) {
      // console.log(userPass);
      console.log('trying to update user');
      $http({

        method: 'PATCH',
        headers: {
        Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      },
        url: this.url + '/users/' + this.user.id,
        data: { user: { username: username, password: password }}
        // console.log(response.data);
      }).then(function(response) {
        console.log(response);
        console.log(response.data);
        this.user = response.data;
        this.showAccount();
      }.bind(this));
    }

    //delete user
    this.deleteUser = function(userPass) {
      console.log('trying to delete user');
      $http({
        method: 'DELETE',
        url: this.url + '/users/' + this.user.id
      }).then(function(response) {
        console.log(response);
        this.logout();
      }.bind(this));
    }

    //logout
    this.logout = function() {
      localStorage.clear('token');
      location.reload();
    }

    //toggle for opening up registration form modal when "Create Account" clicked
    this.toggleRegister = function(){
    this.registerModal = !this.registerModal
    if(this.loginModal === true){
      this.loginModal = false;
    }
    this.closeForm();
    }

    //toggle for opening up login form modal after account created
    this.toggleLogin = function(){
      this.loginModal = !this.loginModal;
      // this will allow me to log in, but modal stays and & logged in user does not go to their profile page
      if(this.login(user) === true){
        this.loginModal = false;
      }
      this.closeForm();
      // this.showAccount(user);

  }



    //showing learner profile
    this.showAccount = function(){
    console.log('showAccount for learner please');
    console.log('loggedin learner is now: ', this.loggedin);
      if(this.loggedin === true){
        console.log('loggedin is now: ', this.loggedin);
        this.userPage = !this.userPage;
        this.account = false;
        this.home = false;
        this.plans = false;
        this.loginModal = false;
        this.registerModal = false;
        console.log("Learner Profile Page");
      }

    }

    //toggle for creating success plan
    this.showPlanForm = false;


    //toggle create success plan modal to show
    this.createPlan = function(){
    this.showPlanForm = true;
    }
    //create success plan
    this.addPlan = function(plan){
      $http({

        url: this.url + '/users/' + this.user.id + '/plans',
        method: 'POST',
        data: { plan: { affective_goal: plan.affective_goal, academic_goal: plan.academic_goal, task: plan.task, measure: plan.measure, actions: plan.actions, purpose: plan.purpose, deadline: plan.deadline, user_id: this.user.id }},
      }).then(function(response) {
        console.log(response);
        this.book = response.data;
        console.log("------------");
        console.log(this.plan);

      }),
      this.showPlanForm = false;
      }

      //show success plan index
      this.showPlans = function(){
        $http({
          url: this.url + '/users/' + this.user.id + '/plans',
          method: 'GET',
        }).then(function(response) {
          console.log(response);
          controller.planList = response.data;
          console.log("--------------");
          console.log("this is this.planList, which is response.data", controller.planList);
          console.log("--------------");

        })
      }























































/////////////////////////////////////////
}]); //end mainController
