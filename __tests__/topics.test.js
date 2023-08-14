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

describe("GET /api/topics", () => {
    test("200: returns a 200 status code", () => {
        return request(app).get("/api/topics").expect(200)
    })
    test("200: returns an array of all the topics stored in the topics table", () => {
        return request(app).get("/api/topics").expect(200).then((response) => {
            const {topics} = response.body
            expect(topics).toHaveLength(3)
            
            topics.forEach((topic) => {
                expect(topic).toHaveProperty("slug", expect.any(String))
                expect(topic).toHaveProperty("description", expect.any(String))
            })
        })
    })
})