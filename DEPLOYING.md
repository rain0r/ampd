# Deploying `ampd` behind a webserver

Here are some example configurations if you like to run `ampd` behind another webserver via reverse proxy. 

## Apache
### Without SSL (`http://your-server/ampd`)

Please make sure to use the releases named `ampd-with-context-<version>.jar` if you plan to access
`ampd` via `/ampd` (instead of `/`).

```
<VirtualHost *:80>
    ServerName localhost
    Include /etc/apache2/vhosts.d/default_vhost.include

    ProxyPass           "/ampd" "http://127.0.0.1:8080/"
    ProxyPassReverse    "/ampd" "http://127.0.0.1:8080/"
    RewriteEngine       On
    RewriteCond         %{HTTP:Upgrade} websocket [NC]
    RewriteCond         %{HTTP:Connection} upgrade [NC]
    RewriteRule         ^/ampd?(.*) "ws://127.0.0.1:8080/$1" [P,L]
</VirtualHost>
</IfDefine>
```

### With SSL (`https://your-server/ampd`)
```
<VirtualHost _default_:443>
	ServerName localhost
	Include /etc/apache2/vhosts.d/default_vhost.include
	SSLEngine on

    # Your other SSL Settings here

    ProxyPreserveHost   On
    ProxyRequests       Off
    ProxyPass           /ampd http://127.0.0.1:8080/
    ProxyPassReverse    /ampd http://127.0.0.1:8080/

    RewriteEngine       On
    RewriteCond         %{HTTP:Upgrade} websocket [NC]
    RewriteCond         %{HTTP:Connection} upgrade [NC]
    RewriteRule         ^/ampd?(.*) "ws://127.0.0.1:8080/$1" [P,L] 

</VirtualHost>
```

## Nginx
### Without SSL (`http://ampd.network.local`)

```
server {
    listen 80;
    server_name ampd.network.local;
    server_name_in_redirect off;
    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Server $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        return 301 https://$server_name$request_uri;
    }
}
```

### With SSL (`https://ampd.network.local`)

```
server {
    listen 443 ssl;
    server_name ampd.network.local;
    ssl_certificate /etc/ssl/certs/ampd.network.local.crt;
    ssl_certificate_key /etc/ssl/private/ampd.network.local.key;
    server_name_in_redirect off;
    location / {
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Server $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
    }
}
```