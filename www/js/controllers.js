angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})








.controller('BanksCtrl', function($scope, $location, $state) {


    

})



.controller('BanksNewCtrl', function($ionicPlatform, $scope, $cordovaToast, $ionicUser,$state, FirebaseAccounts){

  console.log("New bank controller loaded")
  

    //dev
    $scope.newaccount = {};
    $scope.newaccount.name = "test bank";
    $scope.newaccount.type = "checking";


    /*================
    PLAID
    ================*/

    var linkHandler = Plaid.create({
      env: 'tartan',
      clientName: 'Plastik',
      key: '9d22636f835fab54c05bec984e88a3',
      product: 'connect',
      onLoad: function() {
        // The Link module finished loading.
      },
      onSuccess: function(public_token) {

        console.log(public_token);

        //add the token to firebase
        FirebaseAccounts.addBankAccount($scope.newaccount.name, $scope.newaccount.type, public_token);


        $state.go("tab.banks")
        /*
        $ionicPlatform.ready(function() {
            $cordovaToast.show('Error adding account: ' + err, 'short', 'center');
          });*/
        
        
      },
      onExit: function() {
        // The user exited the Link flow.
      },
    });



    $scope.signIntoBank = function(){
      linkHandler.open();
    }


})

.controller('AccountCtrl', function($scope, FirebaseAccounts, $ionicUser, $location) {


  $scope.errorMessage;
  $scope.account = {};
  $scope.account.email = "adamdabbacci@gmail.com";
  $scope.account.password = "testpass";


  //signup
  $scope.signup = function(){
    var signupResults = FirebaseAccounts.signup($scope.account.email, $scope.account.password);


    //attempt sign up
    signupResults
    .then(function(results)
    {
      console.log(results)

      //on successful sign up, log the user in automatically
      $scope.login();

    }, 
    function(reason)
    {
      console.log(reason)
      $scope.errorMessage = "" + reason;
    });



  };


  //login
  $scope.login = function()
  {
    var loginResults = FirebaseAccounts.login($scope.account.email, $scope.account.password);
    $scope.errorMessage = ""

    //attempt sign up
    loginResults
    .then(function(results)
    {
      console.log(results)

      //see if we can get a device ID
      var uid;
      try{
        uid = device.uuid;
      }
      catch(err)
      {
        uid =  $ionicUser.generateGUID();
      }
      //add the token to Ionic
      $ionicUser.identify({
        user_id: $scope.account.email,
        user_email: $scope.account.email,
        user_token: results.token,
        auth_exp: results["expires"].toString(),
        device_id: uid,
        last_login: new Date()
      });

      console.log("Logged in successfully")
      $location.path("/dash");


    }, 
    function(reason)
    {
      $scope.errorMessage = "" + reason;
    });

  }



})



;
