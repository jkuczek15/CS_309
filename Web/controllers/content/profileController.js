/*
    Controller for providing data to the profileView
 */
app.controller('profileController', function($scope, $firebaseObject, authService, userInfo, userService, userItems, completedItems, itemService, $location){

    //userInfo grabs all info of current user logged in.
    userService.setup(userInfo);
    itemService.userItemSetup(userItems);

    if($location.path() == '/profile/edit'){
        $scope.editing = true;
    }else{
        $scope.editing = false;
    }// end if editing

    //Grabs user information from AuthServices.js
    authService.promise.then(function() {
        var user = authService.getUser();
        $scope.userEmail = user.email;
        console.log(userInfo);
        $scope.userName = userInfo.displayName;
        $scope.userBio = userInfo.bio;
        $scope.items = userItems;
        $scope.completedItems = completedItems;
    });

    $scope.saveProfileData = function(){
      userInfo.bio = $scope.userBio;
        userService.set(userInfo);
        $location.path('/profile');
    };

    $scope.soldTicket = function(item) {
        // we dont have an error
        var updates = {};
        itemService.userItemremove(item);
        var itemId = item.$id;
        delete item['$id'];
        delete item['$priority'];
        delete item['$$hashKey'];
        updates['/users/' + userInfo.$id + '/soldItems/' + itemId] = item;
        database.ref().update(updates);
    };

    $scope.getItemLink = function(itemID){
        var link;
        var n = itemID.indexOf("-");
        var res = itemID.substring(0, n);

        if(res == 'book'){
            link = '/textbooks/detail/';
        }else if(res == 'ticket'){
            link = '/tickets/detail/';
        }else if(res == 'misc'){
            link = '/miscs/detail/';
        }else if(res == 'food'){
            link = '/foods/detail/';
        }
        link += itemID;
        return link;
    };
});