/*
    All of our page routing, if a user hits a URL, tell them
    where we need to go and what controller to use
*/
app.config(function ($routeProvider) {
    $routeProvider.when("/", {
        controller: "mainController",
        templateUrl: "views/mainView.html"
    }).when("/main", {
        controller: "mainController",
        templateUrl: "views/mainView.html"
    })
    .when("/foods/:foodID?", {
        controller: "foodController",
        templateUrl: "views/foodView.html",
        resolve: {
            foods: function ($firebaseArray) {
                var ref = firebase.database().ref('/products/food/');
                return $firebaseArray(ref).$loaded();
            },
            userItems: function($firebaseArray, authService, $q){
                // create a promise object
                var deferred = $q.defer();

                // wait for user to be authenticated
                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid + '/items/');
                    var data = $firebaseArray(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;
            },

            userInfo: function ($firebaseObject, authService, $q)  {
                var deferred = $q.defer();

                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid);
                    var data = $firebaseObject(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;

            }// end resolved functions
        }
    }).when("/foods/detail/:foodID?", {
        controller: "foodController",
        templateUrl: "views/foodView.html",
        resolve: {
            foods: function ($firebaseArray) {
                var ref = firebase.database().ref('/products/food/');
                return $firebaseArray(ref).$loaded();
            },
            userItems: function($firebaseArray, authService, $q){
                // create a promise object
                var deferred = $q.defer();

                // wait for user to be authenticated
                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid + '/items/');
                    var data = $firebaseArray(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;
            },

            userInfo: function ($firebaseObject, authService, $q)  {
                var deferred = $q.defer();

                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid);
                    var data = $firebaseObject(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;

            }// end resolved functions
        }
    })
    .when("/tickets/:ticketID?", {

        controller: "ticketController",
        templateUrl: "views/ticketView.html",
        resolve: {
            tickets: function ($firebaseArray) {
                var ref = firebase.database().ref('/products/ticket/');
                return $firebaseArray(ref).$loaded();
            },
            userItems: function($firebaseArray, authService, $q){
                // create a promise object
                var deferred = $q.defer();

                // wait for user to be authenticated
                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid + '/items/');
                    var data = $firebaseArray(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;
            },

            userInfo: function ($firebaseObject, authService, $q)  {
                var deferred = $q.defer();

                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid);
                    var data = $firebaseObject(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;

            }// end resolved functions
        }
    }).when("/tickets/detail/:ticketID?", {

        controller: "ticketController",
        templateUrl: "views/ticketView.html",
        resolve: {
            tickets: function ($firebaseArray) {
                var ref = firebase.database().ref('/products/ticket/');
                return $firebaseArray(ref).$loaded();
            },
            userItems: function($firebaseArray, authService, $q){
                // create a promise object
                var deferred = $q.defer();

                // wait for user to be authenticated
                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid + '/items/');
                    var data = $firebaseArray(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;
            },

            userInfo: function ($firebaseObject, authService, $q)  {
                var deferred = $q.defer();

                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid);
                    var data = $firebaseObject(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;

            }// end resolved functions
        }
    })
    .when("/textbooks/:bookID?", {
        // bookID is an optional URL parameter
        controller: "textbookController",
        templateUrl: "views/textbookView.html",
        resolve: {
            books: function ($firebaseArray) {
                var ref = firebase.database().ref('/products/book/');
                return $firebaseArray(ref).$loaded();
            },
            userItems: function($firebaseArray, authService, $q){
                // create a promise object
                var deferred = $q.defer();

                // wait for user to be authenticated
                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid + '/items/');
                    var data = $firebaseArray(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;
            },// end resolved functions

            userInfo: function ($firebaseObject, authService, $q)  {
                var deferred = $q.defer();

                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid);
                    var data = $firebaseObject(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;

            }
        }
    })

    .when("/miscs/:miscID?", {

        controller: "miscController",
        templateUrl: "views/miscView.html",

        resolve: {
            miscs: function ($firebaseArray) {
                var ref = firebase.database().ref('/products/misc/');
                return $firebaseArray(ref).$loaded();
            },
            userItems: function($firebaseArray, authService, $q){
                // create a promise object
                var deferred = $q.defer();

                // wait for user to be authenticated
                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid + '/items/');
                    var data = $firebaseArray(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;
            },

            userInfo: function ($firebaseObject, authService, $q)  {
                var deferred = $q.defer();

                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid);
                    var data = $firebaseObject(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;

            }// end resolved functions
        }
    }).when("/miscs/detail/:miscID?", {

        controller: "miscController",
        templateUrl: "views/miscView.html",

        resolve: {
            miscs: function ($firebaseArray) {
                var ref = firebase.database().ref('/products/misc/');
                return $firebaseArray(ref).$loaded();
            },
            userItems: function($firebaseArray, authService, $q){
                // create a promise object
                var deferred = $q.defer();

                // wait for user to be authenticated
                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid + '/items/');
                    var data = $firebaseArray(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;
            },

            userInfo: function ($firebaseObject, authService, $q)  {
                var deferred = $q.defer();

                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid);
                    var data = $firebaseObject(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;

            }// end resolved functions
        }
    })

    .when("/textbooks/detail/:bookID?", {
        controller: "textbookController",
        templateUrl: "views/textbookView.html",
        resolve: {
            books: function ($firebaseArray) {
                var ref = firebase.database().ref('/products/book/');
                return $firebaseArray(ref).$loaded();
            },
            userItems: function ($firebaseArray, authService, $q) {

                // create a promise object
                var deferred = $q.defer();

                // wait for user to be authenticated
                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid + '/items/');
                    var data = $firebaseArray(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;
            },// end resolved functions

            userInfo: function ($firebaseObject, authService, $q)  {
                var deferred = $q.defer();

                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid);
                    var data = $firebaseObject(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;

            }
        }

    })
    .when("/profile", {
        controller: "profileController",
        templateUrl: "views/profileView.html",
        //resolve user data

        resolve: {

            userInfo: function ($firebaseObject, authService, $q)  {
               var deferred = $q.defer();

                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid);
                    var data = $firebaseObject(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;

            },

            userItems: function ($firebaseArray, authService, $q) {

                // create a promise object
                var deferred = $q.defer();

                // wait for user to be authenticated
                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid + '/items/');
                    var data = $firebaseArray(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;
            },

            completedItems: function ($firebaseArray, authService, $q) {

                // create a promise object
                var deferred = $q.defer();

                // wait for user to be authenticated
                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid + '/soldItems/');
                    var data = $firebaseArray(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;
            }

        }
    }).when("/profile/edit", {
        controller: "profileController",
        templateUrl: "views/profileView.html",
        //resolve user data

        resolve: {

            userInfo: function ($firebaseObject, authService, $q)  {
                var deferred = $q.defer();

                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid);
                    var data = $firebaseObject(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;

            },

            userItems: function ($firebaseArray, authService, $q) {

                // create a promise object
                var deferred = $q.defer();

                // wait for user to be authenticated
                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid + '/items/');
                    var data = $firebaseArray(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;
            },

            completedItems: function ($firebaseArray, authService, $q) {

                // create a promise object
                var deferred = $q.defer();

                // wait for user to be authenticated
                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid + '/soldItems/');
                    var data = $firebaseArray(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;
            }

        }
    })

    .when("/admin", {
        controller: "adminController",
        templateUrl: "views/adminView.html",

        resolve: {

            users: function ($firebaseArray) {
                var ref = firebase.database().ref('/users/');
                return $firebaseArray(ref).$loaded();
            },

            userInfo: function ($firebaseObject, authService, $q)  {
                var deferred = $q.defer();

                authService.promise.then(function(){
                    // user authenticated promise resolved, return a new promise to the users items
                    var ref = firebase.database().ref('/users/' + authService.getUser().uid);
                    var data = $firebaseObject(ref).$loaded();
                    deferred.resolve(data);
                });

                return deferred.promise;

            }
        }
    })


    .otherwise({
        redirectTo: "/"
    });


});