/*
 Controller for providing data to the textfoodView
 */
app.controller('foodController', function($scope, $routeParams, $location, itemService, foods, userItems, chatService, userInfo, userService){
    // setup our items service with a database URL, item name, and item array
    // foods variable resolved on the route, resolved variables are only available
    // in the controller, so we need to update our singleton service by passing foods array
    itemService.setup('/products/food/', 'food', foods);
    userService.setup(userInfo);

    $scope.level = userInfo.type;

    // default editing to false, show edit form when we have a valid foodID
    $scope.editing = false;
    // detail view is default to false
    $scope.detail = false;
    // list view is default to true
    $scope.list = true;

    // yank in our URL parameter
    var foodID = $routeParams.foodID;

    // grab our food from foodService, we are making asynchronous calls, but since
    // the foods variable is a dependency, this wont run until foods array is loaded
    $scope.food = itemService.get(foodID);

    // grab the current URL path
    var path = $location.path();

    // all of our error checking goes here
    var validate = function(food){
        // begin checking for errors
        if(!food.name){
            $scope.error = "Please enter a Food name.";
        }else if(!food.location){
            $scope.error = "Please enter an Location.";
        }else  if(!food.category) {
            $scope.error = "Please set the type of food.";
        }else {
            $scope.error = null;
        }// end error checking
    };

    // function call to update the database upon form submission (POST/push data)
    var setFood = function(food) {
        validate(food);
        if(!$scope.error){
            // we dont have an error
            itemService.set(food, foodID);
            $location.path('/foods');
        }// end if we dont have an error
    };

    var addFood = function(food){
        validate(food);
        if(!$scope.error){
            // we dont have an error
            itemService.add(food);
            $location.path('/foods');
        }// end if we dont have an error
    };

    $scope.openChat = function(creatorID){
        chatService.openChat(creatorID);
    }// end openChat function

    $scope.deleteFood = function(foodID){
        itemService.remove(foodID);
    };

    if(foodID == 'add') {
        // we are trying to add a new food
        $scope.title = 'Add Food:';
        $scope.editing = true;
        // false because we are on the 'add' form
        $scope.edit_form = false;
        $scope.list = false;
        $scope.food = {};
        $scope.update = addFood;
    }else if(path.includes("detail")){
        // we are on the detail view
        $scope.detail = true;
        $scope.editing = false;
        $scope.list = false;
        $scope.title = 'Food Details:';
        // pull in Firebase storage image reference
        var imageRef = itemService.getImageRef(foodID);

        if(userItems.$getRecord($scope.food.$id) !== null){
            $scope.food.allow_edit = true;
        }else{
            $scope.display_message_link = true;
        }// end if the user can edit this food

        //Checks if user is a mod/admin
        if ($scope.level >= 2) {
            $scope.food.allow_delete = true;
        }

        imageRef.getDownloadURL().then(function(url) {
            $scope.image_valid = true;
            $scope.image_url = url;
            $scope.$apply();
        }).catch(function(error){
            $scope.image_valid = false;
        });
    }else if($scope.food){
        // we have a valid foodID in URL, show the edit form
        $scope.title = 'Edit Food:';
        // pull in Firebase storage image reference
        var imageRef = itemService.getImageRef(foodID);

        imageRef.getDownloadURL().then(function(url) {
            $scope.image_valid = true;
            $scope.image_url = url;
            $scope.$apply();
        }).catch(function(error){
            $scope.image_valid = false;
        });

        $scope.editing = true;
        $scope.list = false;
        $scope.detail = false;
        // true if we are on the 'edit' form
        $scope.edit_form = true;
        $scope.update = setFood;
    }else{
        // we are just showing the list of foods
        $scope.foods = foods;
        $scope.list = true;
    }// end if foodID == add
});