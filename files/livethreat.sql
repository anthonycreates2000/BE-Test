-- Membuat tabel untuk menampung data-data live threat.
CREATE TABLE public.livethreat (
	"id" serial4 NOT NULL,
	"sourceCountry" varchar(100) NULL, 
	"destinationCountry" varchar(100) NULL, 
 	"milisecond" int NULL, 
	"type" varchar(100) NOT NULL, 
	"weight" int NOT NULL, 
	"attackTime" timestamptz NOT NULL
);