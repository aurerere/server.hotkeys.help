# <img src="logo.svg" alt="logo" width="200"/>
# The hotkeys.help API 

## Most used node modules
* [ExpressJS](https://expressjs.com/)
* [BcryptJS](https://www.npmjs.com/package/bcryptjs)
* [mysql2](https://www.npmjs.com/package/mysql2)

## Quick setup
* ### Dependencies
  * [NodeJS](https://nodejs.org/)
  * A [MySQL](https://www.mysql.com/) server

* ### In `/` 
  * create and fill a `config.json` file with those attributes
    ```JSON
    {
      "api": {
        "server": {
          "port": "444"
        },
        "database": { 
          "host": "localhost", 
          "user": "root",
          "password": "",
          "port": 3306,
          "database": "hotkeys.help"
        },
        "bcrypt": {
          "seed": 8 
        },
        "mail": {  
          "service": "gmail",
          "mail": "example@gmail.com",
          "password": ""
        }
      }
    }
    ```
* ### In `/api`
  * execute those commands
    ```shell
     npm i
    ```
     ```shell
     ssh-keygen -t rsa -b 4096 -m PEM -f jwt.key
    ```
  * run this script
    ```shell
    node .\dbSetup.js
    ```
