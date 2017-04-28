/*
     Controller for providing data to the textbookView
 */
app.controller('textbookController', function($scope, $firebaseObject, $routeParams, $location, itemService, books, userItems, chatService, userInfo, userService){
    // setup our items service with a database URL, item name, and item array
    // books variable resolved on the route, resolved variables are only available
    // in the controller, so we need to update our singleton service by passing books array
    itemService.setup('/products/book/', 'book', books);
    userService.setup(userInfo);

    $scope.level = userInfo.type;

    // default editing to false, show edit form when we have a valid bookID
    $scope.editing = false;
    // detail view is default to false
    $scope.detail = false;
    // list view is default to true
    $scope.list = true;

    // yank in our URL parameter
    var bookID = $routeParams.bookID;

    // grab our book from bookService, we are making asynchronous calls, but since
    // the books variable is a dependency, this wont run until books array is loaded
    $scope.book = itemService.get(bookID);

    // grab the current URL path
    var path = $location.path();

    // all of our error checking goes here
    var validate = function(book){
        // begin checking for errors
        if(!book.name){
            $scope.error = "Please enter a book name.";
        }else if(!book.author){
            $scope.error = "Please enter an author.";
        }else if(!book.price){
            $scope.error = "Please enter a price.";
        }else{
            $scope.error = null;
        }// end error checking
    };

    // function call to update the database upon form submission (POST/push data)
    var setBook = function(book) {
        validate(book);
        if(!$scope.error){
            // we dont have an error
            itemService.set(book, bookID);
            $location.path('/textbooks');
        }// end if we dont have an error
    };

    var addBook = function(book){
        validate(book);
        if(!$scope.error){
            // we dont have an error
            itemService.add(book);
            $location.path('/textbooks');
        }// end if we dont have an error
    };

    $scope.openChat = function(creatorID){
        chatService.openChat(creatorID);
    }// end openChat function

    $scope.deleteBook = function(bookID){
        itemService.remove(bookID);
    };

    if(bookID == 'add') {
        // we are trying to add a new book
        $scope.title = 'Add Book:';
        $scope.editing = true;
        // false because we are on the 'add' form
        $scope.edit_form = false;
        $scope.list = false;
        $scope.book = {};
        $scope.update = addBook;
    }else if(path.includes("detail")){
        // we are on the detail view
        $scope.detail = true;
        $scope.editing = false;
        $scope.list = false;
        $scope.title = 'Book Details:';

        // pull in Firebase storage image reference
        var imageRef = itemService.getImageRef(bookID);

        if(userItems.$getRecord($scope.book.$id) !== null){
            // user can edit this book
            $scope.book.allow_edit = true;
        }else{
            // user cannot edit this book, provide the message seller link
            $scope.display_message_link = true;
        }// end if the user can edit this book

        //Checks if user is a mod/admin
        if ($scope.level >= 2) {
            $scope.book.allow_delete = true;
        }

        imageRef.getDownloadURL().then(function(url) {
            $scope.image_valid = true;
            $scope.image_url = url;
            $scope.$apply();
        }).catch(function(error){
            $scope.image_valid = false;
        });
    }else if($scope.book){
        // we have a valid bookID in URL, show the edit form
        $scope.title = 'Edit Book:';
        // pull in Firebase storage image reference
        var imageRef = itemService.getImageRef(bookID);

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
        $scope.update = setBook;
    }else{
        // we are just showing the list of books
        $scope.books = books;
        $scope.list = true;
    }// end if bookID == add
});