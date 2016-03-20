Project Proposal
=================

1. Core Features
--------------------------
- Dynamic Storytelling
	As said in the description of the project, the aim is to create a platform for the user to be able to write stories with multiple storylines. We will do so by giving the author of said story a graph-like interface where every child node represents a split in the storyline from the parent node. That way it will be easy to visualise the multiple stories that split and merge and form completely different storylines. This graph should be simple to use as the author will just have to click on a node and split the node to create the different storylines. 

	This should be reflected on the reader side as well. The reader shouldn't see a graph interface but instead just see text and be prompted to choose his preferred storyline when viable.

	The author view will be achieved using D3 visualisation library. We will use it to create the graph interface, and take input from the author to add and remove nodes as necessary.

- Multiple peer storytelling
	In addition to the above feature for a single author to write the story, we want to implement a feature that will give the users of our platform a unique experience. We want the users to be able to contribute to the stories as they're being written. We will implement a peer-to-peer system in which people can join a session and contribute by adding their own storylines that will either inspire the author or give him insight on what to do next. Maybe they'll be so good that the author will just use the contributer's storylines instead of their own.

	This will be achieved through WebRTC. WebRTC is done by creating a session room with a unique session id created by the author. The other contributors will join the session with the session id. We will send an receive the graph as a JSON where a user will send the JSON to the session room and everyone will receive. The other people will incorporate the received JSON into their graphs and update it to the newest one.

- Storyline Analytics:
	We would enhance the user experience to help the author understand what the audience liked about the story.

		1. Displaying how well-received the story was.

		2. Displaying what branch is the most popular among the readers.

	All the needed data will be stored in the database and will be processed at the front-end with the a data analysis API such as keen.io that allows us to visualise it and process the data that is received from the back-end of our web application.    

    We are creating this feature to assist the authors by giving them an insight on what storylines would like to read. We will provide most visited storyline, number of reads, number of likes, and number of contributions. 
2. User Interface
--------------------------

This is a rough draft of how the site should look like. In the future, this should look much better.

a) Site Map
-------------
![Site Map](/proposal/Site_map.png?raw=true "Site Map")

b) Main Page (Login will slide down rather than another page)
------------
![Main Page](/proposal/Main_page.png?raw=true "Main Page (Login will slide down rather than another page")

c) Profile Page
---------------
![Profile Page](/proposal/Profile_page.png?raw=true "Profile Page")

d) Stories Page
----------------
![Stories](/proposal/Stories.png?raw=true "Stories Page")

e) Writing Page
----------------
![Writing Page](/proposal/Writing_page.png?raw=true "Writing Page")

f) Reading Page
---------------
![Reading Page](/proposal/Reading_page.png?raw=true "Reading Page")

g) Analytics Page
-----------------
![Analytics Page](/proposal/Analytics_page.png?raw=true "Analytics Page")


3. Data
--------------------------

	Users:
		- username (charField)
		- password (charField)
		- firstname (charField)
		- lastname (charField)
		- email (charField)

		Description: This is the model that sores the information of the users that have registered to our website. We will be using Django user model provided to us. 

	Graph(MPPTModel):
		- name (charField, unique)
		- parent TreeForeignKey('self', null=True, blank=True, related_name='children', db_index=True)
		- user (Foreign Key Users)
		- read (integer)

		Description: This is the model that stores the story tree. This is a recursive model that stores an access to itself in each instance. We will be using the django MPTT library to make the tree as this library provides us with many different tree functionalities. the name field is the stores the name of the branch, and the parent is the parent node. The user is the user who created the branch and the read field is the number of times this branch has been accessed. 

	Story: 
		- user (Foreign Key Users)
		- graph (Foreign Key Graph)
		- title (charField)
		- read (integer)
		- is_complete (boolean)
		- is_open (boolean)

		Description: This is the Model that will store all the stories that are made form the users registered on the web application. User will be the author of the story, the person who creates the story. Graph is the graph of all the story, which will store all the data about different branches of the story. read is an integer that denotes the number of times this story has been accessed and read. is_complete is a boolean value that denotes if the author of the story has marked the story as compete. is_open is a boolean value that tells us if the story is open for the entire community to edit. 

	Contributers:
		- user (Foreign Key Users)
		- story (Foreign Key Story)

		Description: This is the model that keeps track of the users that have contributed to a particular story. This model is mainly for the data analytics of the stories. 

	Likes: 
		- user (Foreign Key Users)
		- story (Foreign Key Story)

		Description: This model keeps track of the stores that a user has liked. This model is mainly for the data analytics of the stories.

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
