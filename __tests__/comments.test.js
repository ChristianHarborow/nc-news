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
        return request(app).post("/api/articles/2/comments").send({author: "lurker"}).expect(400)
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Bad request")

            return request(app).post("/api/articles/2/comments").send({body: "lurker's new comment"}).expect(400)
        })
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Bad request")

            return request(app).post("/api/articles/2/comments").send({}).expect(400)
        })
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Bad request")
        })
    })
})

describe("DELETE /api/comments/:comment_id", () => {
    test("204: Returns a status code of 204 when passed an existing comment id", () => {
        return request(app).delete("/api/comments/1").expect(204)
    })
    test("404: returns a 404 status code and a relevent message when a valid but non-existant id is passed", () => {
        return request(app).delete("/api/comments/99").expect(404)
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Comment not found")
        })
    })
    test("204->404: The comment with the specified id is deleted", () => {
        return request(app).delete("/api/comments/1").expect(204)
        .then(() => {
            return request(app).delete("/api/comments/1").expect(404)
        })
    })
    test("400: returns a 400 status code and a relevent message when an invalid id is passed", () => {
        return request(app).delete("/api/comments/not-an-id").expect(400)
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Bad request")
        })
    })
})

describe("PATCH /api/comments/:comment_id", () => {
    test("200: increments the specified comment's votes property by the given amount and returns the comment object", () => {
        const increase = {inc_votes: 15}
        const decrease = {inc_votes: -30}
        const expectedComment = {
            comment_id: 1,
            body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
            votes: 31,
            author: "butter_bridge",
            article_id: 9,
            created_at: "2020-04-06T12:17:00.000Z",
        }
        return request(app).patch("/api/comments/1").send(increase).expect(200)
        .then((response) => {
            const {comment} = response.body
            expect(comment).toEqual(expectedComment)
            return request(app).patch("/api/comments/1").send(decrease).expect(200)
        })
        .then((response) => {
            const {comment} = response.body
            expectedComment.votes -= 30
            expect(comment).toEqual(expectedComment)
        })
    })
    test("404: returns a 404 status code and a relevent message when a valid but non-existant id is passed", () => {
        const increase = {inc_votes: 15}
        return request(app).patch("/api/comments/99").send(increase).expect(404)
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Comment not found")
        })
    })
    test("400: returns a 400 status code and a relevent message when an invalid id is passed", () => {
        const increase = {inc_votes: 15}
        return request(app).patch("/api/comments/not-an-id").send(increase).expect(400)
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Bad request")
        })
    })
    test("400: returns a 400 status code when an invalid inc_votes object is passed", () => {
        return request(app).patch("/api/comments/1").send({inc_votes: "not an int"}).expect(400)
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Bad request")

            return request(app).patch("/api/comments/1").send({wrong_key: "15"}).expect(400)
        })
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Bad request")

            return request(app).patch("/api/comments/1").send({}).expect(400)
        })
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Bad request")
        })
    })
})