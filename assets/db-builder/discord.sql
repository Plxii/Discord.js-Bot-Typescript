CREATE TABLE "ClientCredentials" (
	"Token"	TEXT NOT NULL UNIQUE,
	"Application Id"	TEXT NOT NULL UNIQUE,
	"Public Key"	TEXT NOT NULL UNIQUE,
	"Client Id"	TEXT NOT NULL UNIQUE,
	"Client Secret"	TEXT NOT NULL UNIQUE,
	PRIMARY KEY("Token","Application Id","Public Key","Client Id","Client Secret")
)