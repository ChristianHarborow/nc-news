const fs = require("fs/promises")
const app = require("../app")
const request = require("supertest")
const seed = require("../db/seeds/seed")
const testData = require("../db/data/test-data")
const db = require("../db/connection")

beforeEach(() => {
    return seed(testData);
});
  
afterAll(() => {
    return db.end();
});

describe("GET /api", () => {
    test("200: returns a 200 status code", () => {
        return request(app).get("/api").expect(200)
    })
    test("200: returns an object containing a description of all the currently implemented endpoints", () => {
        return request(app).get("/api").expect(200).then((response) => {
            const {api} = response.body
            
            fs.readFile(`${__dirname}/../endpoints.json`, "utf-8").then((data) => {
                const details = JSON.parse(data)
                expect(api).toEqual(details)
            })
        })
    })
})