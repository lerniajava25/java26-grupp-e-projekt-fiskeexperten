# Fiskeexperten
En fiskekarta med AI-analys av fiskebilder

Kopiera `.env.example` till `.env` och anpassa lösenorden innan tjänsterna startas med `podman compose up -d`. Värdena i exemplet är endast avsedda för lokal utveckling. Spring Boot läser också `.env`; databasanslutningen i `src/main/resources/application.properties` använder PostGIS-inställningarna som anges i exemplet. Spring Boots automatiska Docker Compose-integration är avstängd, så starta tjänsterna separat innan applikationen startas.

Ändringar av databasnamn, användare eller lösenord i `.env` tillämpas bara när PostgreSQL-volymen initieras första gången. Befintliga databaser måste uppdateras separat.
