openssl req -x509 -nodes -days 730 -newkey rsa:2048  -keyout cert.key -out cert.pem -config req.cnf -sha256
