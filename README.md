# HOTKEYS.HELP ⌨️
## Used technologies
### API
* [Node](https://nodejs.org/)
* [ExpressJS](https://expressjs.com/)
* [BcryptJS](https://www.npmjs.com/package/bcryptjs)
* [mysql2](https://www.npmjs.com/package/mysql2)

## Quick setup
* In `/`, create a `config.json` file with those attributes
    ```json
    {
      "api": {
        "server": {
          "port": "" // Your choice
        },
        "database": {
          "host": "", // localhost
          "username": "", // root
          "password": "",
          "port": 0, // 3306
          "database": "" // hotkeys.help
        },
        "bcrypt": {
          "seed": 0 // any number
        }
      }
    }