"use strict";

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
var addReviewUrl = require('../lib/AddReviewUrl')["default"];

describe("Add comment tests", function () {
  beforeEach(function () {
    process.env.GITHUB_REPOSITORY = 'someactionowner/reponame';
  });
  describe("getOwnerAndRepo", function () {
    it("should return Owner And Repo", function () {
      var value = new addReviewUrl("");
      var a = value.getOwnerAndRepo();
      var obj = JSON.parse(JSON.stringify(a));
      expect(obj.owner).toBe("someactionowner");
      console.log("obj.owner = ".concat(obj.owner));
      expect(obj.repo).toBe("reponame");
    });
  });
});