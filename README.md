# UUID Key Generator Web Application
Interface for Authentication and Authorization using Session and JWT.
![example workflow](https://github.com/berazo29/randomApiAuth/actions/workflows/node.js.yml/badge.svg)?branch=feature-1

## Installation:
1. Clone the repo
```git
git clone https://github.com/berazo29/randomApiAuth.git
```
2. Go inside the project
```sh
cd randomApiAuth
```
3. Build the project with the `Yarn` 
```js
yarn install
```

## Usage
Inside the folder `randomApiAuth` 
1. Create a file `.env` 
2. Add the environment variables following the `.env.sample`:

## Development
```
yarn dev
```
*Output:*
```
Server listening at http://localhost:3000
MySQL connected
```

## DevTools
Create the project database (MYSQL 8.0)<br>
`Warning:` It will drop the database if it exists to create a new database.
```
node ./Models/devtools/dbschema-cli.js init
```



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>
