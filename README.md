# Quasar App (id-card-app)

A Quasar Project for LGU employees ID card editor

## Env configuration
Copy `.env.development.example` and
`.env.production.example` to 
`.env.development` and
`.env.production`.
Change addresses corresponding to your dev and production machine's address.

## Note: 
When adding/updating features in ihris backend, make sure to change the files's permissions on the production server.
Also, change the permissions of `id_cards` and `id_photos` folders.

```bash
sudo chown -R $USER:www-data .
sudo chmod -R a+rw .
```

## Install the dependencies
```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Lint the files
```bash
yarn lint
# or
npm run lint
```


### Format the files
```bash
yarn format
# or
npm run format
```



### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).
