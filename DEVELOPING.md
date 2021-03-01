# Developing `ampd`

## Building from source

Dependencies:

- [JDK 11](https://openjdk.java.net/projects/jdk/11/)
- [Node.js](https://nodejs.org/)

---

If you like to make some small changes to `ampd` or just build your own application from source, clone (or fork) this repository:

```shell script
git clone https://github.com/rain0r/ampd
```

To get a fully runing `ampd` you can just use type:

```shell script
mvn package
```

This will:

- Build the Angular frontend and place the files under `src/main/resources/static`
- Build the whole Spring Boot application and packge it into a runnable jar-file

## Working on the frontend

Getting the frontend up and running is as easy as:

```shell script
cd angularclient/
npm install
ng serve
```

On OSX, the package needs to be installed as well:

```shell script
npm i --no-save fsevents
```

The flag `--no-save` prevents it from showing up under `dependencies` (since it's only needed on OSX).

This should get you started, you can see the UI at `http://localhost:4200/` but `ampd` won't connect to the backend server.
If you already have a running `ampd` instance, you can tell the frontend to use that:
Open the file `angularclient/src/environments/environment.ts` and set change `AMPD_URL` in the first line to your
computer name or ip.
Run `ng serve` again and - provided there is a `ampd` instance running on that address - the frontend will connect to that.

## Working on the backend

Now let's take a look at the backend server, which is using Spring Boot.
To get it all up and running, just hit `mvn spring-boot:run`. By default, this would also build the `Angular` frontend.
If you want to skip that, pass the `-Dskip.npm=true` flag to Maven: `mvn -Dskip.npm=true spring-boot:run`

The `Build fronted` part of the `pom.xml` is basically calling the file `angularclient/build.js`.  
This means, you have two options to build the frontend:

 1. Every time you the Maven `compile` goal is called
 2. Manually via `node build.js`

See `node angularclient/build.js --help` for more info. Every option can be set in the `<properties>` of the file `pom.xml`.
So, for example, you want to build `ampd` for yourself with these options:

- It should be a production build
- `ampd` should be accessible via the url `https:punica:8003/my-music`

This would be realized via:

```shell script
mvn -Dfrontend.url=punica:8003 -Dfrontend.context=/my-music/ compile
```

After that, you can start the resulting jar file:

```shell script
java -jar target/ampd-*.jar
```
