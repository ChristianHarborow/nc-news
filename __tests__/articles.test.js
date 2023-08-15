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
            const expectedArticle = {
                article_id: 1,
                title: 'Living in the shadow of a great man',
                topic: 'mitch',
                author: 'butter_bridge',
                body: 'I find this existence challenging',
                created_at: '2020-07-09T20:11:00.000Z',
                votes: 100,
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
            }
            expect(article).toEqual(expectedArticle)
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

describe("GET /api/articles", () => {
    test("200: returns an array of all the articles stored in the articles table", () => {
        return request(app).get("/api/articles").expect(200).then((response) => {
            const {articles} = response.body

            expect(articles).toHaveLength(13)

            articles.forEach((article) => {
                expect(Object.keys(article)).toHaveLength(8)

                expect(article).toHaveProperty("author", expect.any(String))
                expect(article).toHaveProperty("title", expect.any(String))
                expect(article).toHaveProperty("article_id", expect.any(Number))
                expect(article).toHaveProperty("topic", expect.any(String))
                expect(article).toHaveProperty("created_at", expect.any(String))
                expect(article).toHaveProperty("votes", expect.any(Number))
                expect(article).toHaveProperty("article_img_url", expect.any(String))
                expect(article).toHaveProperty("comment_count", expect.any(Number))
            })
        })
    })
    test("200: the returned article array is sorted by created at date in descending order", () => {
        return request(app).get("/api/articles").expect(200).then((response) => {
            const {articles} = response.body
            expect(articles).toBeSortedBy("created_at", {descending: true})
        })
    })
})

describe("PATCH /api/articles/:article_id", () => {
    test("200: increments the specified article's votes property by the given amount and returns the article object", () => {
        const increase = {inc_votes: 15}
        const decrease = {inc_votes: -30}
        const expectedArticle = {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 115,
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        }
        return request(app).patch("/api/articles/1").send(increase).expect(200)
        .then((response) => {
            const {article} = response.body
            expect(article).toEqual(expectedArticle)
            return request(app).patch("/api/articles/1").send(decrease).expect(200)
        })
        .then((response) => {
            const {article} = response.body
            expectedArticle.votes -= 30
            expect(article).toEqual(expectedArticle)
        })
    })
    test("404: returns a 404 status code and a relevent message when a valid but non-existant id is passed", () => {
        const increase = {inc_votes: 15}
        return request(app).patch("/api/articles/99").send(increase).expect(404)
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Article not found")
        })
    })
    test("400: returns a 400 status code and a relevent message when an invalid id is passed", () => {
        const increase = {inc_votes: 15}
        return request(app).patch("/api/articles/not-an-id").send(increase).expect(400)
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Bad request")
        })
    })
    test("400: returns a 400 status code when an invalid inc_votes object is passed", () => {
        return request(app).patch("/api/articles/1").send({inc_votes: "not an int"}).expect(400)
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Bad request")

            return request(app).patch("/api/articles/1").send({wrong_key: "15"}).expect(400)
        })
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Bad request")

            return request(app).patch("/api/articles/1").send({}).expect(400)
        })
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Bad request")
        })
    })
})

describe("ALL", () => {
    test("404: returns a 404 status code and a relevent message when passed a non existant endpoint", () => {
        return request(app).get("/api/not-an-endpoint").expect(404)
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Not found")
        })
    })
})