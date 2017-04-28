app.controller('chatController', function($scope, authService, $firebaseArray, chatService){
    authService.setup($scope);
    // setup our sender and receiver variables
    var sender;
    $scope.displayHead = false;
    // setup our data variables for scope
    $scope.userList = [];
    $scope.inputMessages = [];
    $scope.displayMessages = {};

    $scope.auth.$onAuthStateChanged(function (user) {
        // listener function, called every time authentication state changes
        if (user && user.email.includes("@iastate.edu")) {
            // user is logged in using an @iastate.edu account
            $scope.hide_chat = false;

            var userRef = firebase.database().ref('/users/');
            var users = $firebaseArray(userRef);

            // to take an action after the data loads, use the $loaded() promise
            users.$loaded().then(function () {
                // initialize the chatService with the authService sender
                sender = users.$getRecord(user.uid);

                // initialize chat service with current data
                chatService.setup(sender, $scope, users);

                // users are loaded, initialize them in the service
                chatService.initUsers();

                // store the user data since 3-way binding will cause our custom-set variables
                // to be removed from the $firebaseArray
                chatService.stashUsers();

                var messagesRef = firebase.database().ref('/messages/');
                users.$watch(function(event) {
                    // users listener
                    chatService.restoreUsers();

                    if(event.event == 'child_changed'){
                        var key = event.key;
                        var index = users.$indexFor(key);

                        if(key != sender.$id && $scope.userList[index].hide_message){
                            chatService.openChat(key);
                        }// end if this is not the sender

                    }// end if we have a new chat

                    messagesRef.on('value', function(snapshot) {
                        // messages listener
                        var messages = snapshot.val();
                        chatService.updateDisplayMessages(messages);
                    }); // end messages on value change listener

                    chatService.updateChatWidth(null, null, null);
                }); // end users $firebaseArray on change event listener

                messagesRef.on('value', function(snapshot) {
                    // messages listener
                    var messages = snapshot.val();
                    chatService.updateDisplayMessages(messages);
                }); // end messages on value change listener

            }); // end users data loaded function

        } else {
            // use is not authenticated, don't give them any chat access
            $scope.hide_chat = true;
        }// end if we have a valid user

    }); // end on auth state change function

    $scope.updateChatWidth = function(type, user, $event){
        chatService.updateChatWidth(type, user, $event);
    }; // end function updateChatWidth(...)

    $scope.send = function($event, receiver) {
        // send a message by posting to firebase
        // only do something if the input key is "Enter"
        if($event.code == 'Enter' && $scope.inputMessages[receiver.chatIndex] != ''){
            // prevent the enter key from creating a new line in the textarea
            event.preventDefault();

            // get the message from the DOM
            var message = $scope.inputMessages[receiver.chatIndex];

            // clear the message box
            $scope.inputMessages[receiver.chatIndex] = "";

            // send the message
            chatService.send(receiver, message);

            // update the chat width for this receiver (fixes weird bug)
            chatService.updateChatWidth(null, receiver, $event);

            $scope.$evalAsync();
        }// end if they pressed enter
    };

});