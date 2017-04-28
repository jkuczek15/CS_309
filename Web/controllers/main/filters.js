/*
    Angular Filters for modifying and formatting data in
    different ways
*/
app.filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
}).filter('emailToNetID', function() {
    return function(input) {
        return (!!input) ? input.substr(0, input.indexOf('@')) : '';
    }
}).filter('typeToText', function() {
    return function(input) {
        if(input == 1){
            return "User";
        }else if(input == 2){
            return "Moderator";
        }else if(input == 3){
            return "BossMan";
        }else if(input == 0){
            return "Banned";
        }
    }
});
