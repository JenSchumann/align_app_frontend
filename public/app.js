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
    // this.loggedin = false;

////////////////////////////////////////////   USER   /////////////////////


    // register new user
  this.CreateUser = function(userPass) {
    this.userPass = userPass;
     $http({
       url: this.url + '/users',
       method: 'POST',
       data: { user: { username: userPass.username, password: userPass.password, grade: userPass.grade, interests: userPass.interests, strengths: userPass.strengths, aspirations: userPass.aspirations, date: userPass.date }},
     }).then(function(response) {
       console.log(response);
            this.user = response.data.user;
            this.loggedin = true;
            this.registerModal = !this.registerModal;
            this.userPage = !this.userPage;
          }.bind(this));
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
        this.loggedin = false;
      } else {
        this.loggedin = true;
        this.loginModal = !this.loginModal;
        this.userPage = !this.userPage;
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

    //to get 1 user need to build functionality for user to see their user profile page
    this.showUser = function() {
    $http({
      url: this.url + '/users/' + this.user.id,
      method: 'GET',
      headers: {
      Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('token'))
      }
    }).then(function(response) {
    console.log(response);
      if (response.data.status == 401) {
        this.error = "Unauthorized";
      } else {
        this.user.id = response.data;
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
    if(this.login(user) === true){
      this.registerModal = false;
    }
    this.closeForm();
    }

    //toggle for opening up login form modal after account created
    this.toggleLogin = function(){
      this.loginModal = !this.loginModal;
      if(this.login(user) === true){
        this.loginModal = false;
      }
      this.closeForm();
    }

    //showing learner profile
    this.showAccount = function(){
    console.log('showAccount for learner please');
    console.log('loggedin learner is now: ', this.loggedin);
      if(this.loggedin === true){
        console.log('loggedin is now: ', this.loggedin);
        // this.userPage = !this.userPage;
        // this.account = false;
        this.home = false;
        this.plans = false;
        this.loginModal = false;
        this.registerModal = false;
        console.log("Learner Profile Page");
      }
    }

////////////////////////////////////////////   SUCCESS PLAN  //////////////////

    this.plan = {};
    this.plans = [];
    this.editedPlan = {};
    this.currentPlan = {};
    this.createPlanModal = false;

    //toggle for creating success plan
    this.showPlanForm = false;

    //toggle create success plan modal to show
    this.createPlanModal = function(){
    this.showPlanForm = true;
    }

    //create success plan
    this.createPlan = function(plan) {
      $http({
        url: this.url + '/plans',
        method: 'POST',
        data: { plan: { affective_goal: plan.affective_goal, academic_goal: plan.academic_goal, task: plan.task, measure: plan.measure, actions: plan.actions, purpose: plan.purpose, deadline: plan.deadline, user_id: this.user.id }},
      }).then(function(response) {
        console.log(response);
        this.plan = response.data.plan;
        console.log("------------");
        console.log(this.plan);
        console.log("this is this.plan, which is response.data", controller.plan);

      }),
      this.showPlanForm = false;
      }

      //show success plan index
      this.showPlans = function(){
        $http({
          url: this.url + '/plans',
          method: 'GET',
        }).then(function(response) {
          console.log(response.data);
          controller.planList = response.data;
          console.log("--------------");
          console.log("this is this.planList, which is response.data", controller.planList);
          console.log("--------------");
        })
      }

      // get request for edited plan
      this.editPlan = function(id) {
        $http({
          method: 'GET',
          url: this.url + '/plans/' + id
        }).then(function(response){
          controller.currentPlan = response.data;
          console.log("--------------");
          console.log("this is this.currentPlan, which is response.data", controller.currentPlan);
          console.log("--------------");
        }, function(error) {
          console.log(error, 'editPlan error');
        })
      }

      //post request for updated plan
      this.updatedPlan = function(){
        $http({
          method: 'PUT',
          url: this.url + '/plans/' + this.currentPlan.id,
          data: this.currentPlan
        }).then(function(response){
          console.log(response);
          controller.showPlans();
          console.log("--------------");
          console.log("this is this.updatedPlan, which is response", controller.showPlans());
          console.log("--------------");
      }, function(error) {
        console.log(error, 'updatedPlan error');
      })
    }

    // delete the selected success plan
    this.deletePlan = function(id) {
      $http({
        method: 'DELETE',
        url: this.url + '/plans/' + id
      }).then(function(response) {
        console.log(response);
        console.log('this is deletePlan');
      });
    }







    //next considerations:
    //how to share the success plan?  another table?
    //how to save success plan info before updating (push to an array?)























































/////////////////////////////////////////
}]); //end mainController
