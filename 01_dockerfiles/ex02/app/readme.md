Quick Hello World App
====================

-  Download and Install the Rails Installer kit - http://railsinstaller.org/
-	Download Sublime Text - http://www.sublimetext.com/

Create new application
----------------------
- Command: *rails new <name of application>*
- CD into the newly created folder
- Fire up the server: *rails server*
- Navigate to: http://localhost:3000/ - you should see the “Welcome Aboard” page

Controller-View: Hello World
----------------------------
- Create controller: *rails generate controller home index*
- Open your Rails project in Sublime
- Go to /views/home/index.html.erb
- Replace the code with: 

        <h1>Hello, World!</h1>
- Delete the default “Welcome Aboard Page”: *del public\index.html*
- Open config/routes.rb and add the following just below the first line: 

        root :to => "home#index"
- Refresh http://localhost:3000/ - it should now say, “Hello World!”
