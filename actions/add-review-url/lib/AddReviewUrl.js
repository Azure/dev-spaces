"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
var _require = require('@octokit/graphql'),
    graphql = _require.graphql;

var core = require('@actions/core');

var AddComment =
/*#__PURE__*/
function () {
  function AddComment(comment) {
    (0, _classCallCheck2["default"])(this, AddComment);
    this.addComment(comment);
  }

  (0, _createClass2["default"])(AddComment, [{
    key: "getOwnerAndRepo",
    value: function getOwnerAndRepo() {
      if (process.env.GITHUB_REPOSITORY) {
        var _process$env$GITHUB_R = process.env.GITHUB_REPOSITORY.split('/'),
            _process$env$GITHUB_R2 = (0, _slicedToArray2["default"])(_process$env$GITHUB_R, 2),
            owner = _process$env$GITHUB_R2[0],
            repo = _process$env$GITHUB_R2[1];

        return {
          'owner': owner,
          'repo': repo
        };
      } else {
        throw new Error('not able to obtain GITHUB_REPOSITORY from process.env');
      }
    }
  }, {
    key: "getGraphqlWithAuth",
    value: function getGraphqlWithAuth() {
      var token = core.getInput('repo-token');
      return graphql.defaults({
        headers: {
          authorization: "token ".concat(token)
        }
      });
    }
  }, {
    key: "addPullRequestCommentMutation",
    value: function addPullRequestCommentMutation() {
      return "mutation AddPullRequestComment($subjectId: ID!, $body: String!) {\n  addComment(input:{subjectId:$subjectId, body: $body}) {\n    commentEdge {\n        node {\n        createdAt\n        body\n      }\n    }\n    subject {\n      id\n    }\n  }\n}";
    }
  }, {
    key: "getPullNumber",
    value: function getPullNumber() {
      if (process.env.GITHUB_REF) {
        return parseInt(process.env.GITHUB_REF.split('/')[2]);
      }
    }
  }, {
    key: "getGraphqlWithAuth",
    value: function getGraphqlWithAuth() {
      var token = core.getInput('repo-token');
      return graphql.defaults({
        headers: {
          authorization: "token ".concat(token)
        }
      });
    }
  }, {
    key: "findPullRequestQuery",
    value: function findPullRequestQuery() {
      return "query FindPullRequestID ($owner: String!, $repo: String!, $pullNumber: Int!){\n  repository(owner:$owner, name:$repo) {\n    pullRequest(number:$pullNumber) {\n      id\n    }\n  }\n}";
    }
  }, {
    key: "addCommentUsingSubjectId",
    value: function addCommentUsingSubjectId(pullRequestId, comment) {
      var obj = JSON.parse(JSON.stringify(pullRequestId));
      var graphqlWithAuth = this.getGraphqlWithAuth();
      graphqlWithAuth(this.addPullRequestCommentMutation(), {
        subjectId: obj.repository.pullRequest.id,
        body: comment
      });
    }
  }, {
    key: "addComment",
    value: function () {
      var _addComment = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(comment) {
        var nameAndRepo, graphqlWithAuth, findPullRequestIdQuery, subjectId;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                nameAndRepo = this.getOwnerAndRepo();
                console.log("after getowner and repo");
                graphqlWithAuth = this.getGraphqlWithAuth();
                console.log("after getGraphqlWithAuth");
                findPullRequestIdQuery = this.findPullRequestQuery();
                console.log("after findPullRequestQuery");
                _context.prev = 6;
                _context.next = 9;
                return this.getSubjectId(graphqlWithAuth, findPullRequestIdQuery, nameAndRepo);

              case 9:
                subjectId = _context.sent;
                console.log("subjectId: ".concat(subjectId));
                _context.next = 13;
                return this.addCommentUsingSubjectId(subjectId, comment);

              case 13:
                _context.next = 17;
                break;

              case 15:
                _context.prev = 15;
                _context.t0 = _context["catch"](6);

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[6, 15]]);
      }));

      function addComment(_x) {
        return _addComment.apply(this, arguments);
      }

      return addComment;
    }()
  }, {
    key: "getSubjectId",
    value: function getSubjectId(graphqlWithAuth, findPullRequestIdQuery, nameAndRepo) {
      graphqlWithAuth(findPullRequestIdQuery, {
        owner: nameAndRepo.owner,
        repo: nameAndRepo.repo,
        pullNumber: this.getPullNumber()
      });
    }
  }]);
  return AddComment;
}();

var _default = AddComment;
exports["default"] = _default;