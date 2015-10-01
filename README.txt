This app requires mongodb to be running on localhost with a database named 'linkme'

On linux (possibly mac and windows) you can run it by cd'ing into the root folder and type 'nodemon' or 'node app.js'


type 'npm install' to auto download any missing dependancies.


Start by looking at layout.jade to sett how the views are organized/used. I use files in the models folder to interact with mongo. I use jade mixins stored in the mixins folder. 

I use cropper for image cropping and it causes some issues. need to work that out.


So far it does have a working membership system however crude it may be, complete with email verification.  You'll need your own stmp/gmail account credentials in /routes/index.js in the sendmail function at the bottom. Everythings sorta all over the place because 0 refactoring and cleanup has taken place.