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

  //get users
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

    //logout
    this.logout = function() {
      localStorage.clear('token');
      location.reload();
    }























































/////////////////////////////////////////
}]); //end mainController
