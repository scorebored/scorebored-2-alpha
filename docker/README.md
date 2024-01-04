Scorebored Docker
==================

Build
------

```
make docker
```


Runtime
--------

The Docker image is based on `nginx:alpine` and serves static HTML over HTTP/80.

A sample startup with port 80 binding to the host system:

```
docker run -p 0.0.0.0:80:80/tcp blackchip/scorebored:latest
```

It is probably possible to configure HTTPS/443 but that exercise is left to the reader.
