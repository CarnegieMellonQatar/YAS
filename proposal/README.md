Project Proposal
=================

1. Features
--------------------------

2. User Interface
--------------------------

3. Data
--------------------------

4. URLs
--------------------------

- login/ (POST): Takes the username and password and creates a session for the user using the built-in Django User login function. 
- logout/ (POST): Deletes the session for the user using the built-in Django User logout function.
- signup/ (POST): Creates an account for the user using the built-in Django User create_user function.
- api/uid/addToStory/sid/ (POST): Adds to the story graph using data from POST body request for story with "id". 
- api/uid/createStory/ (POST): Creates a new story where the author's user id is "uid".
- api/getCompleted/sid/n/ (GET): Gets "n" stories that have been completed starting from the story id "sid".
- api/getActive/sid/n/ (GET): Gets "n" stories that are actively been editted starting from the story id "sid".
- api/getInit/ (GET): Initializes the backend and frontend.
- api/getStory/sid/ (GET): Gets the story with story id "sid".
- api/getBranch/sid/ (GET):  Gets the branch using data from POST body request for story with id "sid"
- api/getContributors/sid/ (GET): Gets the number of contributors for the story with id "sid".
- api/uid/getNumContributors/ (GET): Gets the number of contributions the User with id "uid" has done.
- api/uid/getUser/cid/ (GET): Gets the user information of "cid" for "uid". 
- api/uid/setOpen/sid/ (POST): Set the story with id "sid" as open if author's id is "uid".
- api/uid/setClosed/sid/ (POST): Set the story with id "sid" as closed if author's id is "uid".
- api/uid/like/sid/ (POST): Increments the number of likes for story with id "sid".
- api/uid/deleteBranch/sid/ (POST): Delete the branch using data from POST body request for story with id "sid" if the user with id "uid" has permission.
- api/uid/deleteStory/sid/ (POST): Delete the story with id "sid" if author's id is "uid".
- api/uid/addSRead/sid/ (POST): Increments the number of people who have read the story with id "sid".
- api/uid/addBRead/sid/ (POST): Increments the number of times someone has chosen a branch while reading a story with id "sid".
