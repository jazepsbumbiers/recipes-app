# recipe-app

A web-app for user to manage his or hers recipes made with Vue 2. 
Consists of two parts:
1. Local collection with CRUD + search, sort, filter
2. External search for searching the web for recipes with option to add found recipes to local collection using MealDB API

## Project setup
```
npm install -g @vue/cli (if needed)
npm install -g json-server (package for hosting local mock rest api client with json db)
npm install
```

### Serve backend, frontend
```
json-server --watch db.json
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
