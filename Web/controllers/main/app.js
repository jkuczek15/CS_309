/*
    Main controller for handling configuration and dependency settings,
    also provides a controller for the header and navigation
*/

// initialize our firebase settings
var config = {
    apiKey: "AIzaSyB3bDwdIesJJqq8LUY06d_BS6RkGWjyarE",
    authDomain: "com-s-309-project.firebaseapp.com",
    databaseURL: "https://com-s-309-project.firebaseio.com",
    storageBucket: "com-s-309-project.appspot.com",
    messagingSenderId: "788794802091"
};
firebase.initializeApp(config);
var database = firebase.database();

// define our angular app, our dependencies are ngRoute, firebase, and ui.bootstrap
var app = angular.module('app', ['ngRoute', 'firebase', 'ui.bootstrap']);

app.controller('headerController', function($scope, authService, $location, $window, userService) {
    // pull authentication variables/functions into current scope
    authService.setup($scope);
    $scope.display_Admin = false;

    $scope.auth.$onAuthStateChanged(function (user) {
        // listener function, called every time authentication state changes
        if (user && user.email.includes("@iastate.edu")) {
            // user is logged in using an @iastate.edu account
            $scope.user = user;
            $scope.display_Navinfo = true;
            $scope.error = '';

            var typeRef = firebase.database().ref('/users/' + user.uid + '/type/');
            typeRef.on('value', function(snapshot) {
                var type = snapshot.val();
                if(type == 0){
                    $scope.error = "You've been Banned. If you feel this is a mistake please contact the Admins";
                    authService.signOut();
                }else if(type > 2){
                    $scope.display_Admin = true;
                }else if(type == null) {
                    var updates = {};
                    // normal users get a type set to 1
                    updates['/users/' + user.uid + '/type/'] = 1;
                    updates['/users/' + user.uid + '/displayName/'] = user.displayName;

                    database.ref().update(updates);
                }// end if type == 0
            });

            if($location.path() == '/'){
                $location.path('/main');
                $window.location.reload();
            }// end if we are on the main page and logged in, redirect
        }else if (user) {
            // user is logged in with non-iastate account
            $scope.error = "You must login with your Iowa State (@iastate.edu) Google account.";
            authService.signOut();
        }else {
            // user is signing out
            $scope.display_Navinfo = false;
            $scope.display_Admin = false;
        }// end if we have a valid user
    });

    $scope.status = {
        isOpen: false
    };

    $scope.toggleDropdown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
        $scope.status.isopen = !$scope.status.isopen;
    };

    $scope.isNavCollapsed = true;
    $scope.display_Navinfo = false;
});

/*
 Controller for providing data to the mainView
 */
app.controller('mainController', function($scope){});
