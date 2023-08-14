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

describe("GET /api/articles/:article_id", () => {
    test("200: returns a 200 status code", () => {
        return request(app).get("/api/articles/1").expect(200)
    })
    test("200: returns the article object with the specified article_id", () => {
        return request(app).get("/api/articles/1").expect(200).then((response) => {
            const {article} = response.body

            const properties = {
                author: String,
                title: String,
                article_id: Number,
                body: String,
                topic: String,
                created_at: String,
                votes: Number,
                article_img_url: String
            }

            expect(Object.keys(article)).toHaveLength(Object.keys(properties).length)
            
            for (const [propName, propType] of Object.entries(properties)) {
                expect(article).toHaveProperty(propName, expect.any(propType))
            }
        })
    })
    test("404: returns a 404 status code and a relevent message when a valid but non-existant id is passed", () => {
        return request(app).get("/api/articles/99").expect(404).then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Article not found")
        })
    })
    test("400: returns a 400 status code and a relevent message when an invalid id is passed", () => {
        return request(app).get("/api/articles/not-an-id").expect(400).then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Bad request")
        })
    })
})