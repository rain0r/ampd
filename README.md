# ampd

ampd is a web-based client for MPD. It is build with `Angular` and `Spring Boot`.


## Screenshots
![Screenshot of ampd](.github/screenshot.png)


## Installation

Since `ampd` is distributed as a single `jar`-file, it doesn't need a traditional installation. Just copy it wherever you like. I would recommend `/opt/ampd/ampd.jar`. If you like, you can place a config file under `/opt/ampd/ampd.conf` which contains additional parameters, for example:

```
$ cat /opt/ampd/ampd.conf
JAVA_OPTS="-Dspring.profiles.active=prod" # see application.properties for a full list
JAVA_HOME="/opt/openjdk-bin-11.0.6_p10/" # if you have multiple JRE installed
```


## Running

Requires Java 11. To run ampd, just run the `jar`-file:

```
java -jar server-0.0.1-SNAPSHOT.jar
```

Additional options can be passed via the `-D` arguments, for example:

```
java -jar -Dserver.port=8082 server-0.0.1-SNAPSHOT.jar
```

To persist these options, create a config file. See chapter `Installation`.

For a full list of options, see [`application.properties`](src/main/resources/application.properties)


## Building from source

If you like to hack around or just build from source, clone this repository:

```
git clone https://github.com/rain0r/ampd
```

Building and starting the server:

```
mvn spring-boot:run
```

Building and starting the Angular frontend:

```
cd angularclient/
npm install 
ng serve
```
