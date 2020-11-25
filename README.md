# TangTangsWebSite
#
## 📜 Preface
This is my first time to learn by myself and build the website step by step.  
After thinking for a long time, finally there is a clear picture in my head.  
I decide to build a website which can collect useful knowlege and some records about my cat "Tang-Tang".  
Here are some function in this website....  

## 📜 Main Function
* 🔐 **log & reg function** : Get authority to do operation like _**upload**_, _**modify**_ and _**delete**_ contents.
* 📝 **text editor** : Provide some functions such as _**style changing**_, _**simple typography**_, and _**image inserting**_.
* 📋 **message board** :  Display articles by category, and provide _**deleting**_ and _**modifing**_ functions to author.
* 📕 **photo album** : _**view**_ and _**upload**_ photos, but _**only provider can delete**_ photos.

## 📜 Details
This website is built by web application framework "Express", and uses view engine "PUG" to render the web pages, and also uses some node.js modules and extra libraries such as Jquery and Bootstrap 4 for faster and easier website constructing. 
In server side, I use "mongoDB" cloud database to store data of the interaction between server and client.
* * *
Here are some node modules used in this project.
module name | &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; description
 :-: | - 
express-session | Store client status in session which is in server 
express-validator | vaildate some form fields on the server side 
connect-mongo | Save session in mongoDB database 
mongoose | Model this site's data (like article, photo etc). Create, save and query the instance in mongoDB
passport | Set local strategy for authenticating requests
csurf | Prevent CSRF attack
connect-flash | Flash some messages to client for user to understand the situation clearly
dotenv | Set environment variable in server.(The variable are store in .env file)
multer | Handle the form which enctype is multipart/form-data (file upload)
sharp | Compress image file size and resize image dimension size
bcryptjs | For security hash the password and store the result rather than original one
crypto | Generate strong pseudo-random data for the token of resetting account password
nodemailer | Automatically send email with authorized link to user who wants to reset password

* * *
### Function description
- #### login / logout
  Member needs to insert account name and password to login. The field of account name is masked by module input-mask to filter non-alphabetic and non-numeric characters.
  💠 *display operation*
  ![function: register](https://i.imgur.com/4hhS0WQ.gif)

- #### register
  User needs to fill up every field which is compliant with what the tip required for, and the symbol at right side of each field means the result of immediate validating.
  ⚠️ **There will be an alert if the file for user icon isn't the type of image.**
  💠 *display operation*
  ![function: register](https://i.imgur.com/SegqUNF.gif)

- #### text editor
  To build this editor, I don't use the API ~~"document.execCommand"~~ but use the function "changeStyle" which is written by myself. It's a challenge for me to write such a function which works just like "document.execCommand". After a plenty debugging time, I think it could run pretty good now. 
  
  This editor provide some common text editting command such as bold, italic, underline, delete line, font-size, font-color, highlight, text-align, indent, outdent, style removeing, image inserting.
  ⚠️ **There will be an alert if the inserting file isn't the type of image.**
  For users, it is quite convenient to keep the selections after changing the style, and this text editor can do so. 
  💠 *display operation*
  ![function: textEditor](https://i.imgur.com/wylaf98.gif)

- #### message board
  All user can browse all articles by catagory here, but only authors can modify and delete their publications.
  ⚠️ **Only in the login state and being the publisher that deleting and modifying buttons will be displayed**.
  💠 *display operation*
  ![function: message board](https://i.imgur.com/8SrAPx9.gif)

- #### photo album
  🙂 Thanks to "turn.js".  I can build a pretty flipbook easily. 🙂

  ##### 📖 &nbsp; turn page
  User can just click the blank of the page or the button to turn pages, and also use the drop list button to go to the specific page.
  Users can click the star mark to record the page so that later they can quickly go back.
  💠 *display operation*
  ![function: turn page](https://i.imgur.com/tgqU4b9.gif)

  ##### 📂 &nbsp; upload photo in local
  Only members can upload photos in local directory.
  ⚠️ **Upload up to 5 photos once a time and each photo size is 10mb or less.**
  ⚠️ **The inserting file should be the type of image.**
  💠 *display operation*
  ![function: upload in local](https://i.imgur.com/V2galuy.gif)
  
  ##### 🌏 &nbsp; upload photo by URL
  Only members can upload photos by URL.
  ⚠️ **The acceptable URL is not only the https protocol, but also links to actual images**
  💠 *display operation*
  ![function: upload by URL](https://i.imgur.com/AgaHXzF.gif)
  
  ##### ✂ &nbsp; delete photo
  Only members can delete photo.
  The steps for deleting photos:
  First, click scissors icon to cut out the photo.
  Second, click garbage can icon button to delete the photo.
  ⚠️ **Only in the login state and being the photo publisher that scissors icon will be displayed**.
  💠 *display operation*
  ![function: delete photo](https://i.imgur.com/cpwwLKs.gif)