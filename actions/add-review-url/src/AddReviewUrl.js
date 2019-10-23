// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const {graphql} = require('@octokit/graphql');
const core = require('@actions/core');

class AddComment {

  constructor(comment)
  {
    this.addComment(comment);
  }

  getOwnerAndRepo() {
    if (process.env.GITHUB_REPOSITORY) {
      const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
      return {'owner': owner, 'repo': repo};

    } else {
      throw new Error('not able to obtain GITHUB_REPOSITORY from process.env');
    }
  }

  getGraphqlWithAuth() {
    const token = core.getInput('repo-token');
    return graphql.defaults({
      headers: {
        authorization: `token ${token}`,
      },
    });
  }

  addPullRequestCommentMutation() {
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

  getPullNumber() {
    if (process.env.GITHUB_REF) {
      return parseInt(process.env.GITHUB_REF.split('/')[2]);
    }
  }

  getGraphqlWithAuth() {
    const token = core.getInput('repo-token');
    return graphql.defaults({
      headers: {
        authorization: `token ${token}`,
      },
    });
  }

  findPullRequestQuery() {
    return `query FindPullRequestID ($owner: String!, $repo: String!, $pullNumber: Int!){
  repository(owner:$owner, name:$repo) {
    pullRequest(number:$pullNumber) {
      id
    }
  }
}`;
  }

  addCommentUsingSubjectId(pullRequestId, comment) {
    let obj = JSON.parse(JSON.stringify(pullRequestId));
    console.log(`obj: ${obj}`);
    console.log(`obj.repository.pullRequest.id: ${obj.repository.pullRequest.id}`);
    const graphqlWithAuth = this.getGraphqlWithAuth();
    graphqlWithAuth(this.addPullRequestCommentMutation(), {
        subjectId: obj.repository.pullRequest.id,
        body: comment,
      },
    );

  }

  async addComment(comment) {
    const nameAndRepo = this.getOwnerAndRepo();
    console.log(`after getowner and repo: ${nameAndRepo}`);
    const graphqlWithAuth = this.getGraphqlWithAuth();
    console.log(`after getGraphqlWithAuth: ${graphqlWithAuth}`);
    const findPullRequestIdQuery = this.findPullRequestQuery();
    console.log(`after findPullRequestQuery ${findPullRequestIdQuery}`);
    try {
      const subjectId = await this.getSubjectId(graphqlWithAuth, findPullRequestIdQuery, nameAndRepo);
      console.log(`subjectId: ${subjectId}`);
      await this.addCommentUsingSubjectId(subjectId, comment);
    } catch (e) {
    }
  }

  getSubjectId(graphqlWithAuth, findPullRequestIdQuery, nameAndRepo) {
    return graphqlWithAuth(findPullRequestIdQuery, {
        owner: nameAndRepo.owner,
        repo: nameAndRepo.repo,
        pullNumber: this.getPullNumber(),
      },
    );
  }
}

export default AddComment;