# TangTangsWebSite
## 📜 Preface
This is my first time to learn by myself and build the website step by step.  
After thinking for a long time, finally there is a clear picture in my head.  
I decide to build a website which can collect useful knowlege and some records about my cat "Tang-Tang".  
Here are some function in this website....  

## 📜 Main Function
* 🔐 **log & reg function** : Get authority to do operations like _**upload**_, _**modify**_ and _**delete**_ contents.
* 📝 **text editor** : Provide some functions such as _**style changing**_, _**simple typography**_, and _**image inserting**_.
* 📋 **message board** :  Display articles by category, and provide _**deleting**_ and _**modifing**_ functions to authors.
* 📕 **photo album** : _**view**_ and _**upload**_ photos, but _**only provider can delete**_ photos.

## 📜 Details
This website is built by web application framework "Express", and uses view engine "PUG" to render the web pages, and also uses some node.js modules and extra libraries such as Jquery and Bootstrap 4 for faster and easier website constructing. 
In server side, I use "mongoDB" cloud database to store data of the interaction between server and client.
* * *
#### 🛠  List of node modules used in this project.
module name | description
 :-: | - 
express-session | Store client status in the session which is in the server
express-validator | validate some form fields on the server side 
connect-mongo | Save the session in mongoDB database 
mongoose | Model this site's data (like article, photo etc). Create, save and query the instance in mongoDB
passport | Set a local strategy for authenticating requests
csurf | Prevent CSRF attack
connect-flash | Flash some messages to client for user to understand the situation clearly
dotenv | Set some environment variables in server.(The variable are stored in .env file)
multer | Handle the form which enctype is multipart/form-data (file upload)
sharp | Compress image file size and resize image dimension size
bcryptjs | For security hash the password and store the result rather than original one
crypto | Generate strong pseudo-random data for the token of resetting account password
nodemailer | Send an email with authorized link to user who forgot own password

* * *
### Function description
- #### login / logout
  Member needs to insert account name and password to login. The field of account name is masked by the module input-mask to filter non-alphabetic and non-numeric characters.\
  💠 *display operation*\
  ![function: register](https://i.imgur.com/x3DuquT.gif)

- #### register
  User needs to fill up every field which is compliant with what the tip required for, and the symbol at right side of each field means the result of immediate validating.\
  ⚠️ **There will be an alert if the file for user icon isn't the type of image.**\
  💠 *display operation*\
  ![function: register](https://i.imgur.com/d67Jt9p.gif)

- #### reset password
  Members who forget their own password can just use account name to request an email with one link of permission. This permission is a token with strong pseudo-random value generated by the server, and is **valid for only 5 minutes**, so members need to use this link in time to enter the password resetting page, and then set a new password to replace the unknown.\
  💠 *display operation*\
  ![function: register](https://i.imgur.com/W0hw702.gif)

- #### text editor
  ❗*To build this editor, I don't use the API ~~"document.execCommand"~~ but use the function "editStyle" which is coding by myself*.\
  This editor provide some common text editting command such as bold, italic, underline, delete line, font-size, font-color, highlight, text-align, indent, outdent, style removeing, image inserting.\
  ⚠️ **There will be an alert if the inserting file isn't the type of image.**\
  🙂 For users, it is quite convenient to keep the selections after changing the style, and this text editor can do so.\
  💠 *display operation*\
  ![function: textEditor](https://i.imgur.com/qyl00GP.gif)

- #### message board
  All user can browse all articles by catagory here, but only authors can modify and delete their publications.\
  ⚠️ **Deleting and editing buttons is displayed only when the publisher has been logged in**.\
  💠 *display operation*\
  ![function: message board](https://i.imgur.com/hIWefu4.gif)

- #### photo album
  🙂 Thanks to "turn.js".  I can build a pretty flipbook easily. 🙂

  ##### 📖 &nbsp; turn page
  User can just click the blank in the corner of the page or the button to turn pages, and also use the drop list button to go to the specific page.\
  Users can click the star mark to record the page so that later they can quickly go back.\
  💠 *display operation*\
  ![function: turn page](https://i.imgur.com/gTS8KMA.gif)

  ##### 📂 &nbsp; upload photo in local
  Only members can upload photos in local directory.\
  ⚠️ **Upload up to 5 photos once a time and each photo size is 10mb or less.**\
  ⚠️ **The inserting file should be the type of image.**\
  💠 *display operation*\
  ![function: upload in local](https://i.imgur.com/QijTFfF.gif)
  
  ##### 🌏 &nbsp; upload photo by URL
  Only members can upload photos by URL.\
  ⚠️ **The acceptable url is not only in the https protocol, but also links to an actual available image**\
  💠 *display operation*\
  ![function: upload by URL](https://i.imgur.com/NQbvIiZ.gif)
  
  ##### ✂ &nbsp; delete photo
  Only members can delete photo.\
  🔶 The steps for deleting photos:\
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; First, click scissors icon to cut out the photo.\
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Second, click garbage can button to delete the photo.\
  ⚠️ **Scissors icon is displayed only when the publisher has been logged in**.\
  💠 *display operation*\
  ![function: delete photo](https://i.imgur.com/77EAlFS.gif)