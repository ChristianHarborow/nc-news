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

function isArticle(object, diffs={}) {
    const properties = {
        "author": expect.any(String),
        "title": expect.any(String),
        "article_id": expect.any(Number),
        "topic": expect.any(String),
        "created_at": expect.any(String),
        "votes": expect.any(Number),
        "article_img_url": expect.any(String),
        "comment_count": expect.any(Number)
    }

    Object.assign(properties, diffs)

    expect(Object.keys(object)).toHaveLength(Object.keys(properties).length)

    for(const [property, value] of Object.entries(properties)) {
        expect(object).toHaveProperty(property, value)
    }
}

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
                article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
                comment_count: 11
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

            articles.forEach(isArticle)
        })
    })
    test("200: the returned article array is sorted by created at date in descending order", () => {
        return request(app).get("/api/articles").expect(200).then((response) => {
            const {articles} = response.body
            expect(articles).toBeSortedBy("created_at", {descending: true})
        })
    })
    
    describe("Queries", () => {
        describe("GET /api/articles?topic=topic_slug", () => {
            test("200: returns an array of articles that contain the specified topic", () => {
                return request(app).get("/api/articles?topic=mitch").expect(200)
                .then((response) => {
                    const {articles} = response.body

                    expect(articles).toHaveLength(12)

                    articles.forEach((article) => {
                        isArticle(article, {topic: "mitch"})
                    })
                })
            })
            test("404: returns a 404 status code and a relevent message when a non-existant topic is passed", () => {
                return request(app).get("/api/articles?topic=thebesttopic").expect(404).then((response) => {
                    const {msg} = response.body
                    expect(msg).toBe("Topic not found")
                })
            })
        })
        describe("GET /api/articles?sort_by=field_name", () => {
            test("200: returns an array of articles that are sorted by the specified field", () => {
                return request(app).get("/api/articles?sort_by=title").expect(200)
                .then((response) => {
                    const {articles} = response.body
                    expect(articles).toHaveLength(13)
                    articles.forEach(isArticle)
                    expect(articles).toBeSortedBy("title", {descending: true})

                    return request(app).get("/api/articles?sort_by=author").expect(200)
                })
                .then((response) => {
                    const {articles} = response.body
                    expect(articles).toHaveLength(13)
                    articles.forEach(isArticle)
                    expect(articles).toBeSortedBy("author", {descending: true})

                    return request(app).get("/api/articles?sort_by=comment_count").expect(200)
                })
                .then((response) => {
                    const {articles} = response.body
                    expect(articles).toHaveLength(13)
                    articles.forEach(isArticle)
                    expect(articles).toBeSortedBy("comment_count", {descending: true})
                })
            })
            test("400: returns a 400 status code and a relevent message when an invalid field name is passed", () => {
                return request(app).get("/api/articles?sort_by=popularity").expect(400).then((response) => {
                    const {msg} = response.body
                    expect(msg).toBe("Bad request")
                })
            })
        })
        describe("GET /api/articles?order=asc/desc", () => {
            test("200: returns an array of articles that are sorted in the specified order", () => {
                return request(app).get("/api/articles?order=asc").expect(200)
                .then((response) => {
                    const {articles} = response.body
                    expect(articles).toHaveLength(13)
                    articles.forEach(isArticle)
                    expect(articles).toBeSortedBy("created_at", {ascending: true})

                    return request(app).get("/api/articles?order=desc").expect(200)
                })
                .then((response) => {
                    const {articles} = response.body
                    expect(articles).toHaveLength(13)
                    articles.forEach(isArticle)
                    expect(articles).toBeSortedBy("created_at", {descending: true})
                })
            })
            test("400: returns a 400 status code and a relevent message when an invalid order is passed", () => {
                return request(app).get("/api/articles?order=whichever").expect(400).then((response) => {
                    const {msg} = response.body
                    expect(msg).toBe("Bad request")
                })
            })
        })
        describe("Combinations", () => {
            test("200: returns a filtered array of articles that are sorted using the specified field and order", () => {
                return request(app).get("/api/articles?topic=mitch&sort_by=title&order=asc").expect(200)
                .then((response) => {
                    const {articles} = response.body

                    expect(articles).toHaveLength(12)

                    articles.forEach((article) => {
                        isArticle(article, {topic: "mitch"})
                    })

                    expect(articles).toBeSortedBy("title", {ascending: true})
                })
            })
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

describe("POST /api/articles", () => {
    test("201: Creates a new articles record using the provided object and returns the newly created article", () => {
        const newArticle = {
            author: "lurker",
            title: "New Article",
            body: "This is a new article",
            topic: "cats",
            article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
        }
        return request(app).post("/api/articles").send(newArticle).expect(201)
        .then((response) => {
            const {article} = response.body
            const expectedArticle = {
                article_id: 14,
                votes: 0,
                comment_count: 0
            }
            Object.assign(expectedArticle, newArticle)

            isArticle(article, expectedArticle)
        })
    })

    test("201: If article_img_url is not provided a default value is used", () => {
        const newArticle = {
            author: "lurker",
            title: "New Article",
            body: "This is a new article",
            topic: "cats"
        }
        return request(app).post("/api/articles").send(newArticle).expect(201)
        .then((response) => {
            const {article} = response.body
            const expectedArticle = {
                article_id: 14,
                votes: 0,
                comment_count: 0,
                article_img_url: "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
            }
            Object.assign(expectedArticle, newArticle)

            isArticle(article, expectedArticle)
        })
    })

    test("404: returns a 404 status code when a non existant author or topic is passed", () => {
        const newArticle = {
            author: "not a user",
            title: "New Article",
            body: "This is a new article",
            topic: "cats"
        }
        return request(app).post("/api/articles").send(newArticle).expect(404)
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Not found")

            newArticle.author = "lurker"
            newArticle.topic = "not a topic"
            return request(app).post("/api/articles").send(newArticle).expect(404)
        })
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Not found")
        })
    })

    test("400: returns a 400 status code and relevent error message when require keys are missing from request object", () => {
        const newArticle = {
            title: "New Article",
            body: "This is a new article",
            topic: "cats"
        }
        return request(app).post("/api/articles").send(newArticle).expect(400)
        .then((response) => {
            const {msg} = response.body
            expect(msg).toBe("Bad request")

            newArticle.author = "lurker"
            delete newArticle.body
            return request(app).post("/api/articles").send(newArticle).expect(400)
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