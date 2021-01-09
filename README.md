# BulletinBoardRestAPI
REST API to bulletin board web-service. This was a test task.
-----------------------------------------------------------------------------------------------------------------------------

FOR CORRECT WORK OF THIS APP YOU SHOULD INSTALL MYSQL AND CONFIGURE BY YOURSELF

MySQL tables structures:

users: id int primary key auto_increment, name varchar(255), password varchar(255), email varchar(255), phone varchar(255)

items: id int primary key auto_increment, created_at bigint, title varchar(255), price int, image varchar(255), user_id int

-----------------------------------------------------------------------------------------------------------------------------

1. Execute 'start_app.bat'
2. Open postman collection and let's test it!

Thanks for attention!
-----------------------------------------------------------------------------------------------------------------------------
