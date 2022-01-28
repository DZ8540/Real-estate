docker run --name postgres -e POSTGRES_PASSWORD=root -e PGDATA=/var/lib/postgresql/data/pgdata -p 5432:5432 -v ~/Postgres/Kino++/:/var/lib/postgresql/data -d postgres
