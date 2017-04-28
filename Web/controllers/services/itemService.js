/**
 * Created by Joe Kuczek on 3/3/2017.
 * This is a service for performing database operations on
 * any items from /products/<item> in our Firebase database
 * Usage:
 *      1.) Include the itemService dependency in your controller
 *      2.) Add a resolve function to the route.js, returning a $firebaseArray object
 *          that contains the data you would like to present on page load.
 *      3.) Call the itemService.setup() function at the very top of your controller, passing
 *          in the newly resolved variable.
 */
app.factory('itemService', function itemService($firebaseArray, $firebaseObject, authService) {
    // pull in firebase database
    var database = firebase.database();
    var url;
    var itemName;
    var items;    // a $firebaseArray object with all our database items

    return {
        get: function(itemID) {
            // return an array of a single item with itemID
            return items.$getRecord(itemID);
        },
        set: function(item, itemID) {
            // perform updates using an array, note this will be helpful when we begin updating
            // the users table, we can add on keys to the updates array
            var updates = {};
            var user_id = authService.getUser().uid;

            // delete extra shit that comes with $firebaseArray
            delete item['$id'];
            delete item['$priority'];

            // update the item at itemID with the scope information
            updates[url + itemID] = item;
            updates['/users/' + user_id + '/items/' + itemID] = item;
            database.ref().update(updates);
        },
        add: function(item){
            // Generate a reference to a new location and add some data using push()
            var key = itemName + database.ref(url).push().key;

            // apply additional fields when adding a item
            item.createDate = new Date().toJSON();
            item.viewCount = 0;
            item.creatorID = authService.getUser().uid;

            // call the update function with the newly generated itemID
            this.set(item, key);
        },
        remove: function(item){
            // delete the item with itemID
            var user_id = item.creatorID;

            items.$remove(item);
            // remove data from users table
            database.ref('/users/' + user_id + '/items/' + item.$id).remove();
        },
        userItemremove: function(item){
            // delete the item with itemID
            var user_id = authService.getUser().uid;
            var str = item.$id;
            var n = str.indexOf("-");
            var res = str.substring(0, n);
             items.$remove(item);
            // // remove data from users table
            database.ref('/products/' + res + '/' + item.$id).remove();
        },
        getImageRef: function(itemID){
            // returns the uploaded image for this particular item, returns null if no image
            return firebase.storage().ref('items/' + itemID + '.png');
        },
        setup: function(uri, name, scopeItems){
            url = uri;
            itemName = name;
            items = scopeItems;
        },// end itemService functions
        userItemSetup: function(scopeItems){
            items = scopeItems;
        }
    };
});

