/**
 * Created by joe kuczek on 3/2/2017.
 */

app.factory('authService', function authService($firebaseAuth) {
    var promise = $firebaseAuth().$requireSignIn();

    return {
        promise: promise,
        authenticate: function(){
            // authenticate the user using google sign-in
            $firebaseAuth().$signInWithPopup("google").then(function(user) {
                // login successful
                promise = $firebaseAuth().$requireSignIn();
                return user;
            }).catch(function(error) {
                // login failed
                console.error("Authentication failed:", error);
            });
        },
        getCurrentAuth: function(){
            // return current authentication object
            return $firebaseAuth();
        },
        signOut: function(){
            // sign the user out of firebase
            firebase.auth().signOut();
        },
        setup: function(scope){
            // set all our neccessary scope variables
            scope.authenticate = this.authenticate;
            scope.signOut = this.signOut;
            scope.auth = this.getCurrentAuth();
        },
        getUser: function(){
            // return current authentication object
            return $firebaseAuth().$getAuth();
        }
    };
});