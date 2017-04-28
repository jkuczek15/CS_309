# The MU/The Moo/The μ

Market application for Iowa State Students. The goal of this app is to create a secure place for students to trade tickets, textbooks, and anything else. The app will be secure because students must sign up with an "@iastate.edu" email address. We will show the users a list of items they can buy, they can choose to buy the item or comment for more information. Users can also add new items that they are selling, along with seeing a list of their current sales/orders.

Users will be given a 'user rating' in order to distinguish trusted users from potential scammers. In order to sort the results we show the users, we will construct a 'post rating' algorithm. This algorithm will generate a post rating based on the user rating and the number of hits on a particular item. We also thought about creating a recommendation algorithm, so that we can recommend products to the user based on their transaction history (could be a lot of work).

We will create a back-end for our application that will consist of some database and REST API to supply information to the mobile/web app. The database will store information about user’s preferences, any products added from the users, and any transaction information between the buyers and sellers. The app will connect to the API we create to get all the information. The client will communicate back with the API to store user information.


User Types

Normal - Can buy and sell items, perform simple profile actions (forgot password, etc.)
Moderators - Can moderate message boards by removing comments
Admins - Can modify or delete users and products