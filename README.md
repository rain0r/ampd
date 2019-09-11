# ampd

![Screenshot of ampd](.github/screenshot.png)

ampd is a web-based client for MPD. It is build with Angular and Spring Boot.

## Building

Set `AMPD_URL` to the url of your server in `angularclient/src/environments/environment.prod.ts`:

```
const AMPD_URL = 'punica:8003';
```

Also, check the context path under which ampd will be accessed later in `angularclient/build.js`:

```
const CONTEXT_PATH = '/ampd/';
```

Build Angular:

```
cd angularclient
npm install
npm run build-prod
```

Now copy the website to the backend:

```
cp -r dist/ampd/* ../src/main/resources/static/
```

Open `src/main/resources/application.properties` and fill in the address of your MPD server, the path to your music files, listening port etc.

Build the jar file:

```
mvn clean package spring-boot:repackage
```

Start it!

```
java -jar target/server-0.0.1-SNAPSHOT.jar
```

Every property from `src/main/resources/application.properties` can be overwritten by command line aruments:

```
java -jar -Dserver.port=8082 target/server-0.0.1-SNAPSHOT.jar
```
