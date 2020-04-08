# node-monitor-control-linux (nmcl)

Node server to control your screens (linux). Can be used in conjunction with the home-assistant [REST](https://www.home-assistant.io/integrations/switch.rest/) switch integration

## Installation
##### Requirements
 - pm2 : run the script as a deamon
 - The program must run as the current user logged into the current X Session
```sh
sudo npm i -g pm2
git clone https://github.com/mj-sakellaropoulos/node-monitor-control-linux ~/nmcl
cd nmcl
bash ./deploy.pm2.bash
```
To change the default username and password, modify the contents of opts.txt

## Troubleshooting
```
pm2 logs nmcl
```

## home-assistant
#### Example configuration:
configuration.yaml
 - Replace all relevent values in <> brackets.
 - You must replace the value of the Authorization header with a base64 encoded string of "username:password"
```yaml
...
switch:
- platform: rest
  name: 'screens'
  resource: 'https://<hostname>:<port>/dpms'
  body_on: '{"monitor":"on"}'
  body_off: '{"monitor":"off"}'
  headers:
    Authorization: 'Basic <BASE64: username:password>'
    Content-Type: application/json
  verify_ssl: false
...
```

## Building and Development
Recommended IDE : VSCode
```
npm run build
node ./build/main/index.js
```

## CLI usage
```
node index.js port username password
```
