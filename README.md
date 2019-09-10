# ampd

![Screenshot of ampd](.github/screenshot.png)

ampd is a web-based client for MPD. It is build with Angular and Spring Boot.

## Building

Set `AMPD_URL` to the url of your server in `angularclient/src/environments/environment.prod.ts`:

```
const AMPD_URL = 'punica:8003';
```

Build Angular:

```
cd angularclient
npm install

# Optional: Update the version string for the web ui
version=$(date +%Y-%m-%d\ %H:%M:%S)
substitue="ampdVersion: '${version}',"
sed -i "s/ampdVersion.*/${substitue}/" src/environments/environment.prod.ts

npm run build-prod
```

Now copy the website to the backend:

```
cp -r dist/ampd/* ../src/main/resources/static/
```

Open `src/main/resources/application.properties` and fill in the address of your MPD server, the path to your music files, listening port etc.

Build the jar file:

```
mvn package spring-boot:repackage
```

Start it!

```
java -jar target/server-0.0.1-SNAPSHOT.jar
```
