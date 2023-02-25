import { type Response } from "express";
import User from "../../database/models/User";
import { mockRequest, mockResponse, mockNext } from "../../mocks/mocks";
import { getUsers } from "./userControllers";

describe("Given a getUsers controller", () => {
  describe("When it receives a response and User.find returns a collection of users", () => {
    test("Then it should call the response's status method with code 200", async () => {
      User.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue({}),
      }));

      await getUsers(mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    test("Then it should call the response's json method", async () => {
      User.find = jest.fn().mockImplementationOnce(() => ({
        exec: jest.fn().mockReturnValue({}),
      }));

      await getUsers(mockRequest, mockResponse as Response, mockNext);

      expect(mockResponse.json).toHaveBeenCalled();
    });
  });

  describe("When it receives a response and User.find returns an error", () => {
    test("Then it should invoke the received next function with an error with status code 500", async () => {
      User.find = jest.fn().mockReturnValue(new Error());

      await getUsers(mockRequest, mockResponse as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: 500,
        })
      );
    });
  });
});
