Project Proposal
=================

1. Features
--------------------------



- Data Analytics:
	We would enhance the user experience to help the author to understand what branch the audience liked the most by:	
		1) Displaying what the stories that are liked more often, 
		2) Displaying what branch is the most popular among the readers. 
	All the needed data will be stored in the database and will be processed at the front-end with the a data analysis API such as keen.io that allows us to display and process the data that is received form the back-end of our web application.    

2. User Interface
--------------------------

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


