/*
 Controller for providing data to the textbookView
 */
app.controller('ticketController', function($scope, $routeParams, $location, itemService, tickets, userItems, chatService, userInfo, userService){
    // setup our items service with a database URL, item name, and item array
    // books variable resolved on the route, resolved variables are only available
    // in the controller, so we need to update our singleton service by passing books array
    itemService.setup('/products/ticket/', 'ticket', tickets);
    userService.setup(userInfo);

    $scope.level = userInfo.type;

    // default editing to false, show edit form when we have a valid bookID
    $scope.editing = false;
    // detail view is default to false
    $scope.detail = false;
    // list view is default to true
    $scope.list = true;

    // yank in our URL parameter
    var ticketID = $routeParams.ticketID;

    // grab our book from bookService, we are making asynchronous calls, but since
    // the books variable is a dependency, this wont run until books array is loaded
    $scope.ticket = itemService.get(ticketID);

    // grab the current URL path
    var path = $location.path();

    // all of our error checking goes here
    var validate = function(ticket){
        // begin checking for errors
        if(!ticket.name){
            $scope.error = "Please enter a name for this ticket.";
        }else if(!ticket.sport){
            $scope.error = "Please enter the sport this ticket is for.";
        }else if(!ticket.price){
            $scope.error = "Please enter a price for the ticket.";
        }else{
            $scope.error = null;
        }// end error checking
    };

    // function call to update the database upon form submission (POST/push data)
    var setTicket = function(ticket) {
        validate(ticket);
        if(!$scope.error){
            // we dont have an error
            itemService.set(ticket, ticketID);
            $location.path('/tickets');
        }// end if we dont have an error
    };

    var addTicket = function(ticket){
        validate(ticket);
        if(!$scope.error){
            // we dont have an error
            itemService.add(ticket);
            $location.path('/tickets');
        }// end if we dont have an error
    };

    $scope.openChat = function(creatorID){
        chatService.openChat(creatorID);
    }// end openChat function

    $scope.deleteTicket = function(ticketID){
        itemService.remove(ticketID);
    };

    if(ticketID == 'add'){
        // we are trying to add a new book
        $scope.title = 'Sell Ticket';
        $scope.editing = true;
        // false because we are on the 'add' form
        $scope.edit_form = false;
        $scope.list = false;
        $scope.ticket = {};
        $scope.update = addTicket;
    }else if(path.includes("detail")){
        // we are on the detail view
        $scope.detail = true;
        $scope.editing = false;
        $scope.list = false;
        $scope.title = 'Ticket Details';
        // pull in Firebase storage image reference
        var imageRef = itemService.getImageRef(ticketID);

        if(userItems.$getRecord($scope.ticket.$id) !== null){
            $scope.ticket.allow_edit = true;
        }else{
            $scope.display_message_link = true;
        }// end if the user can edit this book

        //Checks if user is a mod/admin
        if ($scope.level >= 2) {
            $scope.ticket.allow_delete = true;
        }

        imageRef.getDownloadURL().then(function(url) {
            $scope.image_valid = true;
            $scope.image_url = url;
            $scope.$apply();
        }).catch(function(error){
            $scope.image_valid = false;
        });
    }else if($scope.ticket){
        // we have a valid bookID in URL, show the edit form
        $scope.title = 'Edit Ticket:';
        // pull in Firebase storage image reference
        var imageRef = itemService.getImageRef(ticketID);

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
        $scope.update = setTicket;
    }else{
        // we are just showing the list of books
        $scope.tickets = tickets;
        $scope.list = true;
    }// end if bookID == add
});