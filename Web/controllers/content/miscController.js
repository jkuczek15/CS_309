/*
 Controller for providing data to the textmiscView
 */
app.controller('miscController', function($scope, $routeParams, $location, itemService, miscs, userItems, chatService, userInfo, userService){
    // setup our items service with a database URL, item name, and item array
    // miscs variable resolved on the route, resolved variables are only available
    // in the controller, so we need to update our singleton service by passing miscs array
    itemService.setup('/products/misc/', 'misc', miscs);
    userService.setup(userInfo);

    $scope.level = userInfo.type;

    // default editing to false, show edit form when we have a valid miscID
    $scope.editing = false;
    // detail view is default to false
    $scope.detail = false;
    // list view is default to true
    $scope.list = true;

    // yank in our URL parameter
    var miscID = $routeParams.miscID;

    // grab our misc from miscService, we are making asynchronous calls, but since
    // the miscs variable is a dependency, this wont run until miscs array is loaded
    $scope.misc = itemService.get(miscID);

    // grab the current URL path
    var path = $location.path();

    // all of our error checking goes here
    // all of our error checking goes here
    var validate = function(misc){
        // begin checking for errors
        if(!misc.name){
            $scope.error = "Please enter a name for this Item.";
        }else if(!misc.category){
            $scope.error = "Please Enter a Category For this Item.";
        }else if(!misc.price){
            $scope.error = "Please enter a price for the item.";
        }else{
            $scope.error = null;
        }// end error checking
    };

    // function call to update the database upon form submission (POST/push data)
    var setMisc = function(misc) {
        validate(misc);
        if(!$scope.error){
            // we dont have an error
            itemService.set(misc, miscID);
            $location.path('/miscs');
        }// end if we dont have an error
    };

    var addMisc = function(misc){
        validate(misc);
        if(!$scope.error){
            // we dont have an error
            itemService.add(misc);
            $location.path('/miscs');
        }// end if we dont have an error
    };

    $scope.openChat = function(creatorID){
        chatService.openChat(creatorID);
    }// end openChat function

    $scope.deleteMisc = function(miscID){
        itemService.remove(miscID);
    };

    if(miscID == 'add') {
        // we are trying to add a new misc
        $scope.title = 'Add misc:';
        $scope.editing = true;
        // false because we are on the 'add' form
        $scope.edit_form = false;
        $scope.list = false;
        $scope.misc = {};
        $scope.update = addMisc;
    }else if(path.includes("detail")){
        // we are on the detail view
        $scope.detail = true;
        $scope.editing = false;
        $scope.list = false;
        $scope.title = 'Misc Details:';
        // pull in Firebase storage image reference
        var imageRef = itemService.getImageRef(miscID);

        if(userItems.$getRecord($scope.misc.$id) !== null){
            $scope.misc.allow_edit = true;
        }else{
            $scope.display_message_link = true;
        }// end if the user can edit this misc

        //Checks if user is a mod/admin
        if ($scope.level >= 2) {
            $scope.misc.allow_delete = true;
        }

        imageRef.getDownloadURL().then(function(url) {
            $scope.image_valid = true;
            $scope.image_url = url;
            $scope.$apply();
        }).catch(function(error){
            $scope.image_valid = false;
        });
    }else if($scope.misc){
        // we have a valid miscID in URL, show the edit form
        $scope.title = 'Edit misc:';
        // pull in Firebase storage image reference
        var imageRef = itemService.getImageRef(miscID);

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
        $scope.update = setMisc;
    }else{
        // we are just showing the list of miscs
        $scope.miscs = miscs;
        $scope.list = true;
    }// end if miscID == add
});