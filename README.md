# HOTKEYS.HELP ⌨️

## Used technologies

### API
* [Node](https://nodejs.org/)
* [ExpressJS](https://expressjs.com/)
* [BcryptJS](https://www.npmjs.com/package/bcryptjs)
* [mysql2](https://www.npmjs.com/package/mysql2)

## Quick setup
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
    
* ###In `/api`
  * execute this command
     ```shell
     ssh-keygen -t rsa -b 4096 -m PEM -f jwt.key
  * run this script
    ```shell
    node .\dbSetup.js