# JSON Server DEMO

a json-server but auto updated and folder based server in typescript

## How To start

run

> npm install

then

> npm run serve

now open **<http://localhost:3003>** and server will be visible

# How it works

create any json file inside **mock/json** directory and server will add the respective json with endpoint

you can edit the json file while running server and it will update without restarting

Alternative approach

> npm run start:port -- -port 4001

json server will start on port 4001 but it will not update the json runtime.

## routing

routing added so response also be accessible with api prefix for eg. _/api/<file-name>_

file name with separated by `-` can be accessible with `/`

## examples

- **hello-world.json** file data can be accessible at `http://localhost:3003/hello/world`
- _user.json_ data can be accessed at `http://localhost:3003/user` and `http://localhost:3003/api/user`
- folder can be nested under **json** folder and data is accessible at folder-file-name route
  for eg. _json/auth/login.json_ data can be accessible at
  `http://localhost:3003/auth-login` and `http://localhost:3003/api/auth-login`

## Note

all request are **GET** by default, no POST and other verb can be used while accessing data
