Step 1:
        Run the app using " node index.js " cmt.

Step 2:
        Open the browser enter localhost:3000

Step 3 - creating user:
        url  : localhost:3000/users
     method  :  Post
payload data : user  details includes {name:'' , email:'', address:'' , password:'' } in json format


Step 4 - login user:
        url  : localhost:3000/login
     method  :  Post
payload data : user details includes { email:'', password:''  } in json format

Step 5 - view menus :
        url  : localhost:3000/menus
     method  :  get
     token   : include token in header

Step 6 - order :
        url  : localhost:3000/order
     method  :  Post
     token   : token in header
payload data : user and menus details includes {name:'' , email:'', address:'' , items:'' } in json format