"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _require = require('@octokit/graphql'),
    graphql = _require.graphql;

var core = require('@actions/core');
    
var AddComment =
/*#__PURE__*/
function () {
  function AddComment() {
    (0, _classCallCheck2.default)(this, AddComment);
  }

  (0, _createClass2.default)(AddComment, [{
    key: "getOwnerAndRepo",
    value: function getOwnerAndRepo() {
      if (process.env.GITHUB_REPOSITORY) {
        var _process$env$GITHUB_R = process.env.GITHUB_REPOSITORY.split('/'),
            _process$env$GITHUB_R2 = (0, _slicedToArray2.default)(_process$env$GITHUB_R, 2),
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
      var _addComment = (0, _asyncToGenerator2.default)(
      /*#__PURE__*/
      _regenerator.default.mark(function _callee(comment) {
        var nameAndRepo, graphqlWithAuth, findPullRequestIdQuery, subjectId;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                nameAndRepo = this.getOwnerAndRepo();
                graphqlWithAuth = this.getGraphqlWithAuth();
                findPullRequestIdQuery = this.findPullRequestQuery();
                _context.prev = 3;
                _context.next = 6;
                return this.getSubjectId(graphqlWithAuth, findPullRequestIdQuery, nameAndRepo);

              case 6:
                subjectId = _context.sent;
                _context.next = 9;
                return this.addCommentUsingSubjectId(subjectId, comment);

              case 9:
                _context.next = 13;
                break;

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](3);

              case 13:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[3, 11]]);
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
exports.default = _default;