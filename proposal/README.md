Project Proposal
=================

1. Features
--------------------------

2. User Interface
--------------------------

![Site Map](/proposal/Site_map.png?raw=true "Site Map")

![Main Page](/proposal/Main_page.png?raw=true "Main Page (Login will slide down rather than another page")

![Profile Page](/proposal/Profile_page.png?raw=true "Profile Page")

![Stories](/proposal/Stories.png?raw=true "Stories Page")

![Writing Page](/proposal/Writing_page.png?raw=true "Writing Page")

![Reading Page](/proposal/Reading_page.png?raw=true "Reading Page")

![Analytics Page](/proposal/Analytics_page.png?raw=true "Analytics Page")

3. Data
--------------------------

4. URLs
--------------------------

- login/ (POST) (JSON): Takes the username and password and creates a session for the user using the built-in Django User login function. 

- logout/ (POST) (JSON): Deletes the session for the user using the built-in Django User logout function.

- signup/ (POST) (JSON): Creates an account for the user using the built-in Django User create_user function.

- api/uid/addToStory/sid/ (POST) (JSON): Adds to the story graph using data from POST body request for story with "id". 

- api/uid/createStory/ (POST) (JSON): Creates a new story where the author's user id is "uid".

- api/getCompleted/sid/n/ (GET) (JSON): Gets "n" stories that have been completed starting from the story id "sid".

- api/getActive/sid/n/ (GET) (JSON): Gets "n" stories that are actively been editted starting from the story id "sid".

- api/getInit/ (GET) (JSON): Initializes the backend and frontend.

- api/getStory/sid/ (GET) (JSON): Gets the story with story id "sid".

- api/getBranch/sid/ (GET) (JSON):  Gets the branch using data from POST body request for story with id "sid".

- api/getContributors/sid/ (GET) (JSON): Gets the number of contributors for the story with id "sid".

- api/uid/getNumContributors/ (GET) (JSON): Gets the number of contributions the User with id "uid" has done.

- api/uid/getUser/cid/ (GET) (JSON): Gets the user information of "cid" for "uid". 

- api/uid/setOpen/sid/ (POST) (JSON): Set the story with id "sid" as open if author's id is "uid".

- api/uid/setClosed/sid/ (POST) (JSON): Set the story with id "sid" as closed if author's id is "uid".

- api/uid/like/sid/ (POST) (JSON): Increments the number of likes for story with id "sid".

- api/uid/deleteBranch/sid/ (POST) (JSON): Delete the branch using data from POST body request for story with id "sid" if the user with id "uid" has permission.

- api/uid/deleteStory/sid/ (POST) (JSON): Delete the story with id "sid" if author's id is "uid".
- api/uid/addSRead/sid/ (POST) (JSON): Increments the number of people who have read the story with id "sid".

- api/uid/addBRead/sid/ (POST) (JSON): Increments the number of times someone has chosen a branch while reading a story with id "sid".
