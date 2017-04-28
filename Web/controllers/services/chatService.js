/**
 * Created by joe kuczek on 3/2/2017.
 */

app.factory('chatService', function chatService() {
    // service for providing functions to the chatController
    var storedChatNums = [];
    var chatCount = 0;      // number of chats currently open
    var sender;             // the auth sender
    var users;              // $firebase array of users
    var scope;              // the chatController's scope variable
    var tempUsers = [];     // temporary $firebaseArray for users

    return {
        send: function(receiver, message){
            // POST a message to the server from <sender> to <receiver>
            var receiverChatIDs;
            var senderChatIDs;
            var chat_key;
            var messageRef = firebase.database().ref('/messages/');

            var receiverID = receiver.$id;
            var senderID = sender.$id;

            if(receiver.chats != null){
                // we have a list of chats for each user, convert c.s to array
                receiverChatIDs = receiver.chats;
            }else{
                receiverChatIDs = [];
            }// end if we have chats for this user

            if(sender.chats != null){
                // we have a list of chats for each user, convert c.s to array
                senderChatIDs = sender.chats;
            }else{
                senderChatIDs = [];
            }// end if we have chats for this user

            if (senderID in receiverChatIDs){
                // both users have a similar chat id, this means a chat was already created
                chat_key = receiverChatIDs[senderID];
            }else{
                // users have different chat ids, push a new chat id for both users
                chat_key = messageRef.push().key;
                // add the new chat id to each user's list of chat ids
                receiverChatIDs[senderID] = chat_key;
                senderChatIDs[receiverID] = chat_key;
            }// end if chat id has been created

            // get a new message key for this message
            messageRef = firebase.database().ref('/messages/' + chat_key);
            var message_key = messageRef.push().key;

            var updates = {};
            var messageObject = ({
                message: message,
                senderID: senderID,
                date: new Date().toJSON()
            });

            // perform all our Firebase updates
            updates['/messages/' + chat_key + "/" + message_key] = messageObject;
            updates['/users/' + senderID + '/chats/' + receiverID] = chat_key;
            updates['/users/' + receiverID + '/chats/' + senderID] = chat_key;

            firebase.database().ref().update(updates);
        },
        updateChatWidth: function(type, user){
            // update the chat widths for all users

            if (type == 'add') {
                // adding a new chat window
                if(user.hide_message){
                    chatCount++;
                    tempUsers[user.chatIndex].chatNum = users[user.chatIndex].chatNum = chatCount;
                    tempUsers[user.chatIndex].hide_message = users[user.chatIndex].hide_message = false;
                    storedChatNums[user.chatIndex] = chatCount;
                }// end if chat window is not already displayed

            } else if (type == 'sub') {
                // removing a chat window
                chatCount--;

                angular.forEach(users, function (u, id) {
                    // loop over all users
                    if (user.chatNum < users[id].chatNum){
                        users[id].chatNum--;
                        tempUsers[id] = users[id].chatNum;
                        storedChatNums[users[id].chatIndex] = users[id].chatNum;
                    }// end if current user Chat less than some user chat

                });// end for each loop over all users

                storedChatNums[user.chatIndex] = 0;
                tempUsers[user.chatIndex].chatNum = users[user.chatIndex].chatNum = 0;
                tempUsers[user.chatIndex].hide_message = users[user.chatIndex].hide_message = true;
            }// end if adding a new chat

            angular.forEach(users, function (u, id) {
                // for each loop over users updating chat widths
                u.chatNum = storedChatNums[id];
                users[id].chatWidth = 280 * u.chatNum;
            });// end for each loop over all users

            scope.userList = users;
            scope.$evalAsync();
        },
        updateDisplayMessages: function(messages){
            // function for updating messages in the view
            if(sender.chats != null){
                // we have chats for the auth user
                angular.forEach(sender.chats, function (chatID, receiverID) {
                    // for each loop over chats

                    if(chatID in messages){
                        var messageObj = messages[chatID];
                        var index = users.$indexFor(receiverID);
                        users[index].displayMessages = [];

                        angular.forEach(messageObj, function (message) {
                            // for loop over messages

                            if(message.senderID == sender.$id){
                                message.class = 'msg_a';
                            }else{
                                message.class = 'msg_b';
                            }// end if apply different classes to these messages

                            users[index].displayMessages.push(message);
                        });

                    }// end if this user is involved in a chat

                }); // end for loop over all the user chats

            }// end if the auth user is involved in any chats

            scope.userList = users;
            scope.$evalAsync();
        },
        initUsers: function(){
            // initialize the users in the scope
            angular.forEach(users, function (user, id) {
                // for each loop over all users setting up chats
                user.hide_message = true;
                user.chatNum = 0;
                user.chatWidth = 0;
                user.displayMessages = [];

                // push a blank placeholder onto input array
                scope.inputMessages.push("");
                storedChatNums.push(user.chatNum);

                if (user.$id == sender.$id) {
                    user.displayInList = false;
                } else {
                    user.displayInList = true;
                }// end if we should display this user in the chat list

                user.chatIndex = id;
                users[id] = user;
            });
            scope.userList = users;
            scope.$evalAsync();
        },
        openChat: function(userID){
            var index = users.$indexFor(userID);
            var receiver;

            if(users[index] != null){
                receiver = users[index];
            }else{
                receiver = users.$getRecord(userID);
            }// end if users index != null

            receiver.openChat = true;
            this.updateChatWidth('add', receiver);
        },
        stashUsers: function(){
            // initialize the users in the scope
            angular.forEach(users, function (user, id) {
                // for each loop over all users setting up chats

                var data = {
                    hide_message: user.hide_message,
                    chatNum: user.chatNum,
                    chatWidth: user.chatWidth,
                    displayMessages: user.displayMessages,
                    displayInList: user.displayInList,
                    chatIndex: user.chatIndex
                };

                tempUsers.push(data);
            });
        },
        restoreUsers: function(){
            // restore the users since 3-way binding fucks it up
            angular.forEach(users, function (user, id) {
                // for each loop over all users setting up chats
                user.hide_message = tempUsers[id].hide_message;
                user.chatNum = tempUsers[id].chatNum;
                user.chatWidth = tempUsers[id].chatWidth;
                user.displayMessages = tempUsers[id].displayMessages;
                user.displayInList = tempUsers[id].displayInList;
                user.chatIndex = tempUsers[id].chatIndex;

                users[id] = user;
            });
            scope.userList = users;
        },
        setup: function(authSender, chatScope, scopeUsers){
            sender = authSender;
            scope = chatScope;
            users = scopeUsers;
        }
    };
});