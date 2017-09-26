console.log('Align now with your future');

const app = angular.module('align_app', []);



//main controller
app.controller('mainController', ['$http',
  function($http){
    // this.test = "Align now with your future"
    const controller = this;
    this.url = 'http://localhost:3000';
    // this.url = 'https://alignapi.herokuapp.com';
    this.user = {};
    this.users = [];
    this.userPass = {};
    this.editDisplay = false;
    this.token = {};
    this.editUser = {};
    this.updatedUser = {};
    this.editedUser = {};

    //pages hidden until toggled:
    this.registerModal = false;
    this.loginModal = false;
    this.home = true;
    this.userPage = false;
    this.plans = false;
    this.account = false;
    this.profilePage = false;


    this.closeForm = function(){
    this.show = true;
    }

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
          }.bind(this),function(error){
            console.log(error);
          })
        };


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
      }
      console.log('user logged in? ', this.loggedin);
      console.log('the user is: ', this.user);
      console.log('the userPass username is: ', userPass.username);
    }.bind(this),function(error){
      console.log(error);
    })
  };

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
      }.bind(this),function(error){
        console.log(error);
      })
    };

    //to get 1 user need to build functionality for user to see their user profile page
    this.showUser = function() {
    $http({
      url: this.url + '/users/' + this.user_id,
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
    }.bind(this),function(error){
      console.log(error);
    })
  };


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
      }.bind(this),function(error){
        console.log(error);
      })
    };

    //delete user
    this.deleteUser = function(userPass) {
      console.log('trying to delete user');
      $http({
        method: 'DELETE',
        url: this.url + '/users/' + this.user.id
      }).then(function(response) {
        console.log(response);
        this.logout();
      }.bind(this),function(error){
        console.log(error);
      })
    };

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

    this.toggleEdit = function(){
      console.log('frontend trying to edit by clicking edit button');
      this.editDisplay = !this.editDisplay;
      console.log('editDisplay  toggle works');
    }

    //showing learner profile
    // this.showAccount = function(){
    // console.log('showAccount for learner please');
    // console.log('loggedin learner is now: ', this.loggedin);
    //   if(this.loggedin === true){
    //     console.log('loggedin is now: ', this.loggedin);
    //
    //     console.log("---------------");
    //
    //
    //     console.log("---------------");
    //     console.log("Learner Profile Page");
    //   }
    //   // this.closeForm();   ?
    // }

////////////////////////////////////////////   SUCCESS PLAN  //////////////////

    this.plan = {};
    this.userPlanIndex = [];
    this.editedPlan = {};
    // what renders success plan index:
    this.currentPlan = {};
    this.createPlanModal = false;
    // this.planList = false;
    this.editPlanDisplay = false;

    //toggle for creating success plan
    this.showPlanForm = false;
    this.showCurrentPlan = false;

    //toggle create success plan modal to show
    this.createPlanModal = function(){
    this.showPlanForm = true;
    }

    //showing plans of one user should render on their page (not as a modal)
    // this.showPlansModal = function(){
    //   this.plans = true;
    //   this.showPlansIndex = true;
    // }

    this.toggleModal = function(){
      this.showPlanForm = !this.showPlanForm;
    }

    this.clearForm = function(){
        this.formData = '';
      }

    //create success plan
    this.createPlan = function(newPlan) {
      $http({
        url: this.url + '/users/' + this.user.id + '/plans',
        method: 'POST',
        data: { plan: { affective_goal: this.newPlan.affective_goal, academic_goal: this.newPlan.academic_goal, task: this.newPlan.task, measure: this.newPlan.measure, actions: this.newPlan.actions, purpose: this.newPlan.purpose, deadline: this.newPlan.deadline, user_id: this.user.id, title: this.newPlan.title }},
      }).then(function(response) {
        console.log(response);
        // console.log("------------");
        // console.log("response is: ", response);
      this.showPlanForm = false;
      controller.showUserPlanIndex();
      }.bind(this),function(error){
        console.log(error);
      })
    };

      //show success plan index.... to see all that plans that belong to multiple users
      // for admin use when admin functionality is built:
      // this.showPlans = function(){
      //   $http({
      //     url: this.url + '/plans',
      //     method: 'GET',
      //   }).then(function(response) {
      //     console.log(response.data);
      //     controller.planList = response.data;
      //     console.log("--------------");
      //     console.log("this is this.planList, which is response.data", controller.planList);
      //     console.log("--------------");
      //   })
      // }


      //show success plan index.... for logged in user to see all THEIR success plans
      this.showUserPlanIndex = function(){
        $http({
          url: this.url + '/users/' + this.user.id + '/plans',
          method: 'GET',
        }).then(function(response) {
          console.log(response.data);
          this.planList = response.data;
          controller.hidePlanList = !controller.hidePlanList;
          controller.showPlanList = !controller.showPlanList;

          console.log('this is plan index of current user');
        }.bind(this),function(error){
          console.log(error);
        })
      };

// GET    /users/:user_id/plans/:id(.:format) plans#show
      // to show ONE plan index for the specific logged in user:
      this.setCurrentPlan = function(id){
        $http({
          url: this.url + '/users/' + this.user.id + '/plans/' + id,
          method: 'GET',
        }).then(function(response) {
          console.log(response.data);
          controller.currentPlan = response.data;
          console.log("--------------");
          console.log("this is controller.currentPlan, which is response.data", controller.currentPlan);
          console.log("--------------");
        }.bind(this),function(error){
          console.log(error);
        })
      };

      this.toggleEditPlan = function(){
        this.editPlanDisplay = !this.editPlanDisplay;
        console.log('editPlanDisplay toggle works');
      }

      //////////////////////////////////////////////////////////
      //2.0: Experiment w/Todd's idea about pushing current plan info into an
      //array prior to edit function so that prior plan data is saved
      /////////////////////////////////////////////////////////


      // get request for edited plan
           this.editPlan = function(currentPlan) {
             $http({
               method: 'GET',
               url: this.url + '/users/' + this.user.id + '/plans/' + this.currentPlan.id,
             }).then(function(response){
               controller.currentPlan = response.data;
               console.log("--------------");
               console.log("this is editPlan trying to get ahold of the selected plan which is controller.currentPlan, which is response", controller.currentPlan);
               console.log("--------------");
             }, function(error) {
               console.log(error, 'editPlan error');
             })
           }

           //post request for updated plan
           this.updatedPlan = function(affective_goal, academic_goal, task, measure, actions, purpose, deadline, title){
             console.log("trying to update the success plan");

             // title, affective_goal, academic_goal, task, measure, actions, purpose, deadline
             $http({
               method: 'PUT',
               // url: this.url + '/users/' + this.user.id + '/plans/' + id,
               url: this.url + '/users/' + this.user.id + '/plans/' + this.currentPlan.id,
               data: { plan: { affective_goal: this.updatedPlan.affective_goal, academic_goal: this.updatedPlan.academic_goal, task: this.updatedPlan.task, measure: this.updatedPlan.measure, actions: this.updatedPlan.actions, purpose: this.updatedPlan.purpose, deadline: this.updatedPlan.deadline, title: this.updatedPlan.title}}
             }).then(function(response){
               console.log(response);
               console.log("--------------");
               controller.currentPlan = response.data;

               console.log("this is controller.currentPlan which should be the updated plan, which is response", controller.currentPlan);
               console.log("--------------");
               controller.showUserPlanIndex();
           }.bind(this));
         }


///////////////////////////////////////////////////////////
// DELETE /users/:user_id/plans/:id(.:format) plans#destroy


    // delete the selected success plan
///////////////////////////////////////////////////////////
    this.deletePlan = function(currentPlan) {
      $http({
        method: 'DELETE',
        url: this.url + '/users/' + this.user.id + '/plans/' + this.currentPlan.id,
      }).then(function(response) {
        console.log(response);
        console.log('this is deletePlan');
        controller.showUserPlanIndex();
      }.bind(this),function(error){
        console.log(error);
      })
    };



    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////

    //next considerations:
    //how to share the success plan?  another table?
    //how to save success plan info before updating (push to an array?)























































/////////////////////////////////////////
}]); //end mainController
