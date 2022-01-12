# HOTKEYS.HELP ⌨️

## Used technologies

### API
* [Node](https://nodejs.org/)
* [ExpressJS](https://expressjs.com/)
* [BcryptJS](https://www.npmjs.com/package/bcryptjs)
* [mysql2](https://www.npmjs.com/package/mysql2)

## Quick setup
* ### In `/` 
  * create a `config.json` file with those attributes
    ```YAML
    {
      "api": {
        "server": {
          "port": "444" # server port
        },
        "database": { # database connection 
          "host": "localhost", 
          "username": "root",
          "password": "",
          "port": 3306,
          "database": "hotkeys.help"
        },
        "bcrypt": {
          "seed": 8 # password bcrypt seed (backend)
        }
        "mail": { # mail service connection 
          "service": "gmail",
          "mail": "example@gmail.com",
          "password": ""
        }
      }
    }