const { graphql } = require("@octokit/graphql");
const core = require('@actions/core');
const { App } = require("@octokit/app");

const token =  core.getInput('repo-token');

const repo = process.env.GITHUB_REPOSITORY.toString();
const commitId = process.env.GITHUB_REF;
let repoNameWithOwnerArray = repo.split("/", 2);
const owner = repoNameWithOwnerArray[0];
const actualRepo = repoNameWithOwnerArray[1];

const host = core.getInput('host');

const parent = process.env.GITHUB_PARENT_SPACE.toString();

const headref = process.env.GITHUB_HEAD_REF.toString();    
   
const bodyprime = `You can see a private version of the changes made in this pull request here:\nhttp://${headref}.s.${host}/`;

function getPullNumber(){
    let commitIdArray = commitId.split("/", 3);
    const pullNumber = commitIdArray[2];
    return parseInt(pullNumber, 10);
}

function getGraphqlWithAuth(token) {
    return graphql.defaults({
        headers: {
            authorization: `token ${token}`
        }
    });
}

function addCommentToPullRequest(body, pullRequestId){
    let obj = JSON.parse(JSON.stringify(pullRequestId));
    const  graphqlWithAuth =  getGraphqlWithAuth(token);
    graphqlWithAuth(pullRequestCommentMutation, {
            subjectId:obj.repository.pullRequest.id,
            body: body

        }
    ).catch(err => console.log(err)).then(result => console.log(result));

}
function findPullRequestAndAddComment(owner, repo, commentBody) {

    const  graphqlWithAuth =  getGraphqlWithAuth(token);
    const  findPullRequestIdQuery = findPullRequestQuery();
    graphqlWithAuth(findPullRequestIdQuery, {
            owner: owner,
            repo: repo,
            pullNumber: getPullNumber()
        }
    ).catch(err => console.log(err)).then(pullRequestId => addCommentToPullRequest(commentBody, pullRequestId));
}


let pullRequestCommentMutation = addPullRequestCommentMutation();
function addPullRequestCommentMutation() {
    return `mutation AddPullRequestComment($subjectId: ID!, $body: String!) {
  addComment(input:{subjectId:$subjectId, body: $body}) {
    commentEdge {
        node {
        createdAt
        body
      }
    }
    subject {
      id
    }
  }
}`;
}

function findPullRequestQuery() {
    return `query FindPullRequestID ($owner: String!, $repo: String!, $pullNumber: Int!){
  repository(owner:$owner, name:$repo) {
    pullRequest(number:$pullNumber) {
      id
    }
  }
}`;
}

findPullRequestAndAddComment(owner,actualRepo,bodyprime);