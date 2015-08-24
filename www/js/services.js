angular.module('starter.services', ["ionic", "firebase"])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

.factory('SQLite', function($ionicPlatform, $rootScope){

  var factory = {};
  var db;

  $ionicPlatform.ready(function() {
      db = $cordovaSQLite.openDB({ name: "plastikdb" });
  });




  return factory;

})


.factory('FirebaseAccounts', function($firebaseArray, $q, $ionicUser, $rootScope){

  var factory= {};

  var ref = new Firebase("https://plastik.firebaseio.com/accounts");



  //signs a new user up to Firebase
  factory.signup = function(email, password)
  {
    return $q(function(resolve, reject) {
      console.log("Attempting to sign up " + email + " / " + password);

      ref.createUser({
        email    : email,
        password : password,
      }, 
      function(error, userData) {
        if (error) {
          console.log("Error creating user:", error);
          reject(error);
        } else {
          console.log("Successfully created user account with uid:", userData.uid);
          resolve(userData)
        }
      });
    });
  }


  //attempts to log a user in
  factory.login = function(email, password)
  {
    return $q(function(resolve, reject) {
      console.log("Attempting to login " + email + " / " + password);

      ref.authWithPassword({
        email    : email,
        password : password,
      }, 
      function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
          reject(error);
        } else {
          $rootScope.email = email;
          console.log("Authenticated successfully with payload:", authData);
          resolve(authData);
        }
      });
    });
  }


  //checks if user is logged in
  factory.checkLoginStatus = function(){
    return $q(function(resolve, reject) {
      console.log("Checking login status");

      //get the token expiry from Ionic
      var _authExpiry = $ionicUser.get()["auth_exp"];
      //check if auth has expired
      var authExpiry = moment.unix(_authExpiry);
      if (moment().isBefore(authExpiry.format()))
      {
        console.log("Auth valid")
        resolve(true)
      }
      else
      {
        console.log("Auth expired")
        reject(false)
      }


    });
  }


  //adds a new account to a user
  factory.addBankAccount = function(account_name, account_type, account_token)
  {
    
    return $q(function(resolve, reject) {
      console.log("Adding bank account to Firebase")
      var userAcct = ref.child($rootScope.email);

      //get a guid for this account
      var bankGUID = $ionicUser.generateGUID();


      userAcct.set({
        test : {
          name:account_name,
          type:account_type,
          token:account_token
        }
      })


    });

  }


  return factory;

})




;
