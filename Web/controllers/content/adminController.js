/**
 * Created by Pine-Pro on 3/2/2017.
 */
angular.module('app').controller('adminController', function($scope, $firebaseObject, authService, userInfo, users, userService){
    // uncomment the line below to connect to firebase
    // const database = firebase.database();
    $scope.users = users;
    $scope.list = true;
    var database = firebase.database();

    userService.setup(userInfo);


    authService.promise.then(function() {
        // console.log(authService.getUser());

        var user = authService.getUser();

        console.log(userInfo);


        $scope.level = userInfo.type;
    });

    $scope.banUsers = function() {
        angular.forEach($scope.users, function (user, userID) {
            if(user.checked) {
                    var updates = {};
                    updates['/users/' + user.$id + '/type/'] = 0;
                    database.ref().update(updates);
            }
        });
    };
});
