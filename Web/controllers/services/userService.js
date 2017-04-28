/**
 * Created by Pine-Pro on 4/13/2017.
 */


app.factory('userService', function userService($firebaseArray, $firebaseObject, authService) {

    var userName;
    var userBio;
    var userEmail;
    var userLevel;

    return{
        set: function(userInfo) {
            // perform updates using an array, note this will be helpful when we begin updating
            // the users table, we can add on keys to the updates array
            var updates = {};
            var user_id = authService.getUser().uid;


            // delete extra shit that comes with $firebaseArray
            delete userInfo['$id'];
            delete userInfo['$priority'];
            delete userInfo['$$conf'];
            delete userInfo['$resolved'];



            // update the item at itemID with the scope information
            updates['/users/' + user_id] = userInfo;
            database.ref().update(updates);
        },

        setup: function (userInfo) {
            userName = userInfo.displayName;
            userEmail = userInfo.email;
            userBio = userInfo.bio;
            userLevel = userInfo.type;
        }
    };


});