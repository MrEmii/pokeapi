<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Ejecutar en Desarrollo

1. Clonar el repositorio
2. Ejecutar
  ```
  yarn install
  ```
3. Tener NestCLI instalado
  ```
  npm i -g @nest/cli
  ```
4. Levantar base de datos
  ```
  docker-compose up -d
  ```
5. Clonar ```.env.template``` y utilizar ```.env```

6. Definir variables de entorno

7. Ejecutar aplicación con:
```
yarn start:dev
```

# Carga base de datos
```
http://localhost:3000/api/v2/seed
```

# Api Preview
```
https://pokeapixd.herokuapp.com/api/v2/
```

# Heroku
Hacer deploy sin cambios
```
git commit --allow-empy -m "Deploy sin cambios"
git push heroku master
```

# Producción
1. Clonar ```.env.template``` y utilizar ```.env.prod```
2. Definir variables de entorno
3. Crear imagen
 ```
 docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
 ```

# Stack
  * MongoDB
  * NestJS
  * Mongoose