# Northcoders News API

## Summary

An API to access data about Northcoders News' articles, topics, comments and users

## Usage

### Link to hosted API: https://nc-news-gdc6.onrender.com/

### To test locally:

1. Clone to local repo using: `git clone https://github.com/ChristianHarborow/nc-news`
2. Install dependencies using: `npm i`
3. Create the following .env files in the project's top level directory:
    - .env.test with the content:
        - `PGDATABASE=nc_news_test`
    - .env.development with the content:
        - `PGDATABASE=nc_news`
4. Setup the database using the following commands:
    1. `npm run setup-dbs`
    2. `npm run seed`
5. Start the server and have it listen for requests using the command: `npm run start`
6. Requests can then be made to `localhost:9090` e.g. `localhost:9090/api/articles`

<br>

Minimum versions required: 
- Node: 20.1.0
- Postgres: 14.8