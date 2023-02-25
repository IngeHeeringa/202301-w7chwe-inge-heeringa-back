import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import User from "../../database/models/User";
import connectDatabase from "../../database/connectDatabase";
import { app } from "..";
import {
  type UserCredentialsStructure,
  type UserDataStructure,
} from "../../types";

let server: MongoMemoryServer;

beforeAll(async () => {
  server = await MongoMemoryServer.create();
  await connectDatabase(server.getUri());
});

afterAll(async () => {
  await mongoose.connection.close();
  await server.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

const userData: UserDataStructure = {
  username: "User",
  password: "123",
  avatar: "image.png",
  email: "user@user.com",
};

describe("Given a POST '/users/register' endpoint", () => {
  const endpoint = "/users/register";

  describe("When it receives a request with username 'User', password '123', avatar 'image.png' and email 'user@user.com'", () => {
    test("Then the response body should include the username 'User' and the message 'User registered successfully'", async () => {
      const expectedStatusCode = 201;
      const expectedResponseBody = {
        username: userData.username,
        message: "User registered successfully",
      };

      const response = await request(app)
        .post(endpoint)
        .send(userData)
        .expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedResponseBody);
    });
  });

  describe("When it receives a request with username 'User', avatar 'image.png', email 'user@user.com' and no password", () => {
    const userData = {
      username: "User",
      password: null,
      avatar: "image.png",
      email: "user@user.com",
    };
    test("Then it should respond with status code 500", async () => {
      const expectedStatusCode = 500;

      const response = await request(app)
        .post(endpoint)
        .send(userData)
        .expect(expectedStatusCode);

      expect(response.status).toBe(expectedStatusCode);
    });

    test("Then it should respond with error message 'Couldn't register the user'", async () => {
      const expectedStatusCode = 500;
      const expectedErrorMessage = { error: "Couldn't register the user" };

      const response = await request(app)
        .post(endpoint)
        .send(userData)
        .expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedErrorMessage);
    });
  });
});

describe("Given a POST '/users/login' endpoint", () => {
  describe("When it receives a request with username 'User' and password '123'", () => {
    beforeAll(async () => {
      await User.create(userData);
    });

    test("Then it should respond with status code 200 and a token", async () => {
      const endpoint = "/users/login";
      const expectedStatusCode = 200;
      const expectedProperty = "token";
      jwt.sign = jest.fn().mockReturnValue({
        token: "abc",
      });
      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);

      const response = await request(app)
        .post(endpoint)
        .send(userData)
        .expect(expectedStatusCode);

      expect(response.body).toHaveProperty(expectedProperty);
    });
  });

  describe("When it receives a request with username 'User' and incorrect password '124'", () => {
    beforeAll(async () => {
      await User.create(userData);
    });

    test("Then it should respond with status code 401 and error message 'Wrong credentials'", async () => {
      const userDataWrongPassword: UserCredentialsStructure = {
        username: "User",
        password: "124",
      };
      const endpoint = "/users/login";
      const expectedStatusCode = 401;
      const expectedErrorMessage = { error: "Wrong credentials" };

      const response = await request(app)
        .post(endpoint)
        .send(userDataWrongPassword)
        .expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedErrorMessage);
    });
  });

  describe("When it receives a request with username 'User' and password '123' from a user that doesn't exist in the database", () => {
    test("Then it should respond with status code 401 and error message 'Wrong credentials'", async () => {
      const endpoint = "/users/login";
      const expectedStatusCode = 401;
      const expectedErrorMessage = { error: "Wrong credentials" };

      const response = await request(app)
        .post(endpoint)
        .send(userData)
        .expect(expectedStatusCode);

      expect(response.body).toStrictEqual(expectedErrorMessage);
    });
  });
});
