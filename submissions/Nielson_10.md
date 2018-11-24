1. Project Title / One sentence description:
Project 2 - Therapist Admin History Tracker

2. Copy and paste the URL for one of your Web service endpoints at Heroku:
https://rocky-bayou-47557.herokuapp.com/user/login


3. Copy and paste the URL for your source code repository (e.g., GitHub):
https://github.com/adunsulag/therapist-admin-history-tracker-nodejs.git


4. List the name of each of the Web service endpoints that are working:
POST   /user/login 	 Authenticate to get access to other endpoints
GET    /client 		 Retrieve list of clients
POST   /client		 Create a new client
GET    /client/<id>	 Retrieve a client resource
DELETE /client/<id>	 Delete a client
POST   /client/<id>	 Update an existing client
GET    /therapist	 Retrieve a list of therapist resources
POST   /therapist	 Create a new therapist resource
GET    /therapist/<id>	 Get a therapist resource
DELETE /therapist/<id>	 Delete a therapist resource
POST   /therapist/<id>	 Update an existing therapist resource
GET    /appointment	 Get a list of appointment resources
POST   /appointment	 Create a new appointment resource
GET    /appointment/<id> Retrieve an appointment resource
DELETE /appointment/<id> Delete an appointment resource
POST   /appointment/<id> Update an existing appointment resource
GET    /logs?action=<action>&entity=<entity>&entityID=<entityID>	List & search the activity logs
POST   /user/logout	 Log out the current user.

5. List any Web service endpoints that are not yet functioning:
All are functioning.

6. Please select the category you feel best describes your assignment:
A - Some attempt was made
B - Developing, but significantly deficient
C - Slightly deficient, but still mostly adequate
D - Meets requirements
E - Shows creativity and excels above and beyond requirements
E

7. Provide a brief justification (1-2 sentences) for selecting that category.
I spent a lot of time and effort in integrating a Node.JS object relationship mapper into the system that goes above and beyond the web service endpoints.  I also developed my own middleware to inject the current user that's logged into the express request that made it possible to track who was doing with easily without the use of database triggers.

8. Please list any questions you have for the instructor regarding this assignment or this week's topic.
I'm not sure that I have any questions outside of the fact that it seems like having the entire REST API layer built in this first week was the biggest part of the entire project.  Since I already have my SPA built from my php project and I'm redoing the service layer in Node.JS I found I ended up having to complete almost the entirety of Project 2 in this first week.  For some reason I didn't think we'd have to build the complete back end in one week.  I'm not sure if that can be better communicated in future semesters.  I think based on conversations with my team mates this week's assignment is very overwhelming and I know I personally spent 2-3 times as many hours this week as I had projected.
