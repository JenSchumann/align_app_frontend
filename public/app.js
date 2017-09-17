console.log('Align now with your future');

const app = angular.module('align_app', []);



//main controller
app.controller('mainController', ['$http',
  function($http){
    // this.test = "Align now with your future"
    this.login = function(userPass) {
      console.log(userPass);
    }

    this.url = 'http://localhost:3000';
    this.user = {};

    // register new user
  this.CreateUser = function(userPass) {
     $http({
       url: this.url + '/users',
       method: 'POST',
       data: { user: { username: userPass.username, password: userPass.password }},
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
      console.log('the userPass password is: ', userPass.password);
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
