import request from "supertest";
import express from "express";
import attachBeforeNext from "../src/index";

describe("express-before-next", function() {
  test("calls before next method", async function() {
    const app = express();
    attachBeforeNext(app);

    const beforeNext = jest.fn();

    app.use(function(req, res, next) {
      req.beforeNext(beforeNext);
      next();
    });

    const outer = express();
    outer.use(app);
    outer.use(function(req, res) {
      res.end();
    });

    await request(outer).get("/").expect(200);

    expect(beforeNext.mock.results).toHaveLength(1);
  });

  test("doesn't call before next if next is never called", async function() {
    const app = express();
    attachBeforeNext(app);

    const beforeNext = jest.fn();

    app.use(function(req, res, next) {
      req.beforeNext(beforeNext);
      next();
    });

    app.use(function(req, res) {
      res.end();
    });

    const outer = express();
    outer.use(app);
    outer.use(function(req, res) {
      res.end();
    });

    await request(outer).get("/").expect(200);

    expect(beforeNext.mock.results).toHaveLength(0);
  });

  test("removes before next for other routes", async function() {
    expect.assertions(1);

    const app = express();
    attachBeforeNext(app);

    const outer = express();
    outer.use(app);
    outer.use(function(req, res) {
      expect(req.beforeNext).toBeUndefined();
      res.end();
    });

    await request(outer).get("/").expect(200);
  });
});
