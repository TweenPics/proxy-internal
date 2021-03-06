"use strict";

const cert =
`-----BEGIN CERTIFICATE-----
MIIDRzCCAi+gAwIBAgIUSRsJ84W9c5D5oJu3t7IwvKmxVBwwDQYJKoZIhvcNAQEL
BQAwNjELMAkGA1UEBhMCRlIxETAPBgNVBAoMCFR3aWNQaWNzMRQwEgYDVQQDDAtp
LnR3aWMucGljczAeFw0xODEwMjkxNjA5NTRaFw0yMDEwMjgxNjA5NTRaMDYxCzAJ
BgNVBAYTAkZSMREwDwYDVQQKDAhUd2ljUGljczEUMBIGA1UEAwwLaS50d2ljLnBp
Y3MwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCrQ+uRTvarnxjq0WV1
thvWfJ2H7k0eQmLpeI1sU1F+qOfy+xaKy1HcDwgNWFNPDWSgS3zdvm5TTqk2fmKT
kiXqfJZ6L1FXTd0Ed387iaBIggxnnfznpvoVilYnNYcjTx0z7jxHGYKKwlhrTEUD
CgW6MCV09aI0TuAUu65NY1HYiT8ri/GPqJoXZktI9lPWUx4sbh7l+NdzXyrRIz1h
vD7/biX0FQHUZHwor+xm8t5BO2loMKaIJtorr6QaWKRnbnKxZsz+3+PHaukDcKYw
A08tqA7eTv+NqHQ9JPwbb8pVvO4cfEKBKJA77M6KkmKvmPuOllyh3OayFDIdoQZJ
eQCBAgMBAAGjTTBLMA4GA1UdDwEB/wQEAwID+DATBgNVHSUEDDAKBggrBgEFBQcD
ATAkBgNVHREEHTAbggtpLnR3aWMucGljc4IMaS50d2Vlbi5waWNzMA0GCSqGSIb3
DQEBCwUAA4IBAQAI/i5stR/PgSSv5apj9jYDLSCXxS9X6FW6bv/p40pDq7b3oGHg
Nl89wj31d8Yc7C67JQuJs3xhMV4tPhIkicQOf+cIwsjeHeITh+t6I0AxcfTrI+8d
ia4P2lUqTQRURVCvMB6SelVPFy/1bY0KzJdbY+OJwWvs+S6SKFu3I7BW7L7cGCYy
9p5Mezbzp2T/KqwB0JNtb2ZjWieLXrG2y+4DH41irxVVews2AmRqB4eRuQ3+CJrB
P+DL1LNyZJjYbxg1YrFCvfugasOKtrM9MngVfhrermWjxc6/Q4VrfOW9g3ZbnsbU
YKnN77zmKw830+WQS79sZ1FS0YKGEB7EJ7Qb
-----END CERTIFICATE-----
`;

const key =
`-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCrQ+uRTvarnxjq
0WV1thvWfJ2H7k0eQmLpeI1sU1F+qOfy+xaKy1HcDwgNWFNPDWSgS3zdvm5TTqk2
fmKTkiXqfJZ6L1FXTd0Ed387iaBIggxnnfznpvoVilYnNYcjTx0z7jxHGYKKwlhr
TEUDCgW6MCV09aI0TuAUu65NY1HYiT8ri/GPqJoXZktI9lPWUx4sbh7l+NdzXyrR
Iz1hvD7/biX0FQHUZHwor+xm8t5BO2loMKaIJtorr6QaWKRnbnKxZsz+3+PHaukD
cKYwA08tqA7eTv+NqHQ9JPwbb8pVvO4cfEKBKJA77M6KkmKvmPuOllyh3OayFDId
oQZJeQCBAgMBAAECggEAQ37NA8M+63wT8db8SVuvtOP/oWaE9fvrx18/PQXJBEXE
w7m4tJJUfIlf/wJkMq9wjMuzNiCqkiJaBaPhbY8XakYXd6fWQrXo+K2vcuNWS70U
7nERDqp7vKl8Mo+h5oRzWdf14X9oNw9IkWDJgd0dTLdUy7dSaZL8NK+SjeUqiE9J
jJJu4t1d9dOVZsDZughUwHXQTbwcE1FkCObgnqz4BvAVLJWKKXUrdD4fEF56a3et
bWJITwN/ZOQIdnp/TRRipSIiFDCHGfpUrzEHgLdmyU76xJIEuaUg6Vixfv6vSFIR
PSRRS+X0LqdiTGDIltcOfnFPZPKYpTY7Jmgbphx7kQKBgQDTtLlLFsBlIjvfKhge
5V29cMIe1sCU/KyBeL1Ipljgo78ZGdGEmS/s8/hVahsWwSFG812PrQGjtsCY2Csg
JNwC2S/mWWFEQ+64CWSCO9Ss5+dWTZBbgrtE4zwkjkcInIz9EGU/Md75NMvHI9tQ
sLnnPtcXboReYcMvWAqVXBI9jwKBgQDPGSMtseqySh0bz/ztqs2BUKO02pCJCnKE
7T5ValWLcAWE220XWUOn5FZXxA2hvL21dN35s+WYYXkKmWlJWVUbGqeqH02+2XcM
7DGUfns8kjbUC5AfRMDBTnmu/ueD2C2B9ucssu1zJDHKRKC9UEUeApii0vvw8Zx0
jVYIwMH47wKBgQC5JW2DSON7zwOzeNndc1SWz51FYSTNZ2jqVhCcD7bcxvfiWN0O
bPYn8Xm2IXSNYtvadA3YEELFzZcEVNDqbLHo385vUq2pCQwl8TjwWKj3ilyb8nuU
PHHQnjZD9hYTZu46h3M0YEYThePNRgOQvu3mWeO8P1AORstvhTzEQOBG6wKBgQCv
K1r3Bps2bLvMT5NnT+Z9L8EYcxp3369XwffMdaGfzIPOiW7vpeA0/U0O9VR2blek
SRKMZ96WkjO4hGRq1zXGNDiHC+1NtVEeTBXvvT/tztqzZohj+lpz5zXDj/YxLcPo
PvfwdfOkRYQbywqOtnuP07BZYM4bUbH9X6LayngHXwKBgAkJsq0b4qlzJCZhbkFo
0BeAF/35nLtX1H28FI4iSdZjbvnBodlFdAWjLIqqNlHAMlmFMFg+CZvgxePETEVa
y3wRMp9f+0KQij5AYYTo+AeWHNYz0Rm6u9lYUGwVDS1UYKUsOn2ltBqVFuyUkjwt
UEH9AvkWgN3OBL+Yp8oVZzCk
-----END PRIVATE KEY-----
`;

module.exports = () => ( {
    "authent": process.env.TWEENPICS_AUTHENT || null,
    "browser": `chrome`,
    "credentials": {
        cert,
        key,
    },
    "origin": process.env.TWEENPICS_PROXY_ORIGIN,
    "start": `https://www.twicpics.com`,
} );
