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

describe("GET /api/articles/:article_id/comments", () => {
    test("200: returns all comments for a specified article id", () => {
        return request(app).get("/api/articles/1/comments").expect(200)
        .then((response) => {
            const {comments} = response.body

            expect(comments).toHaveLength(11)

            comments.forEach((comment) => {
                expect(Object.keys(comment)).toHaveLength(6)

                expect(comment).toHaveProperty("comment_id", expect.any(Number))
                expect(comment).toHaveProperty("votes", expect.any(Number))
                expect(comment).toHaveProperty("created_at", expect.any(String))
                expect(comment).toHaveProperty("author", expect.any(String))
                expect(comment).toHaveProperty("body", expect.any(String))
                expect(comment).toHaveProperty("article_id", 1)
            })
        })
    })
    test("200: returns an empty array when passed an existing article id with no comments", () => {
        return request(app).get("/api/articles/2/comments").expect(200)
        .then((response) => {
            const {comments} = response.body
            expect(comments).toEqual([])
        })
    })
    test("404: returns a 404 status code and a relevent message when a valid but non-existant id is passed", () => {
        return request(app).get("/api/articles/99/comments").expect(404).then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Article not found")
        })
    })
    test("400: returns a 400 status code and a relevent message when an invalid id is passed", () => {
        return request(app).get("/api/articles/not-an-id/comments").expect(400).then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Bad request")
        })
    })
})

describe("POST /api/articles/:article_id/comments", () => {
    test("201: creates a new record in the comments table for the given article_id using the provided object and then retutrns the newly created object", () => {
        const newComment = {author: "lurker", body: "lurker's new comment"}
        return request(app).post("/api/articles/2/comments").send(newComment).expect(201)
        .then((response) => {
            const {comment} = response.body
            
            expect(comment).toHaveProperty("comment_id", 19)
            expect(comment).toHaveProperty("votes", 0)
            expect(comment).toHaveProperty("created_at", expect.any(String))
            expect(comment).toHaveProperty("author", "lurker")
            expect(comment).toHaveProperty("body", "lurker's new comment")
            expect(comment).toHaveProperty("article_id", 2)
        })
    })
    test("404: returns a 404 status code and a relevent message when a valid but non-existant id is passed", () => {
        const newComment = {author: "lurker", body: "lurker's new comment"}
        return request(app).post("/api/articles/99/comments").send(newComment).expect(404)
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Not found")
        })
    })
    test("400: returns a 400 status code and a relevent message when an invalid id is passed", () => {
        const newComment = {author: "lurker", body: "lurker's new comment"}
        return request(app).post("/api/articles/not-an-id/comments").send(newComment).expect(400)
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Bad request")
        })
    })
    test("404: returns a 404 status code and a relevent message when a valid but non-existant author is passed", () => {
        const newComment = {author: "user_not_present", body: "this account doesn't exist"}
        return request(app).post("/api/articles/2/comments").send(newComment).expect(404)
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Not found")
        })
    })
    test("400: returns a 400 status request and a relevent message when an invalid object is sent", () => {
        const newComment = {username: "<-should be author", body: "this is an invalid object"}
        return request(app).post("/api/articles/2/comments").send(newComment).expect(400)
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Bad request")
        })
    })
    test("400: returns a 400 status request and a relevent message when the passed object is missing the required keys", () => {
        return Promise.all([
            request(app).post("/api/articles/2/comments").send({author: "lurker"}).expect(400),
            request(app).post("/api/articles/2/comments").send({body: "lurker's new comment"}).expect(400),
            request(app).post("/api/articles/2/comments").send({}).expect(400)
        ])
        .then((responses) => {
            responses.forEach((response) => {
                const {msg} = response.body
                expect(msg).toBe("Bad request")
            })
        })
    })
})