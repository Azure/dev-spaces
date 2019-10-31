import * as core from "@actions/core";
import {graphql} from "@octokit/graphql";
import {GraphQlQueryResponseData} from "@octokit/graphql/dist-types/types";


class AddComment {


    private getOwnerAndRepo(): string[] {
        console.log(`process.env.GITHUB_REPOSITORY ${process.env.GITHUB_REPOSITORY}`)
        if (process.env.GITHUB_REPOSITORY) {
            return process.env.GITHUB_REPOSITORY.split('/');

        } else {
            console.log('Error in getOwnerAndRepo');
            throw new Error('not able to obtain GITHUB_REPOSITORY from process.env');
        }

    }


    private addPullRequestCommentMutation(): string {
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


    private getPullNumber(): number {
        if (process.env.GITHUB_REF) {

            return parseInt(process.env.GITHUB_REF.split('/')[2]);
        } else {
            throw new Error('GITHUB_REF is missing in process.env');
        }

    }


    private findPullRequestQuery(): string {
        return `query FindPullRequestID ($owner: String!, $repo: String!, $pullNumber: Int!){
                repository(owner:$owner, name:$repo) {
                    pullRequest(number:$pullNumber) {
                        id
                    }
                }
            }`;
    }

    private async addCommentUsingSubjectId(pullRequestId: GraphQlQueryResponseData, comment: string) {
        console.log(`pullRequestId  ===>>>> ${pullRequestId}`)
        let data = JSON.parse(JSON.stringify(pullRequestId));
        console.log(`Parsed pull request id ${data}`)
        const token = core.getInput('repo-token');
        let graphQlResponse = graphql(this.addPullRequestCommentMutation(), {
                headers: {
                    authorization: `token ${token}`,
                },
                subjectId: data.repository.pullRequest.id,
                body: comment,

            },
        );
        console.log(`Adding the comment ...`);
        return await graphQlResponse;

    }


    private async getSubjectId(findPullRequestIdQuery: string, nameAndRepo: string[]) {
        console.log('Inside getSubjectId');
        const token = core.getInput('repo-token');
        let newVar: GraphQlQueryResponseData = await graphql(findPullRequestIdQuery, {
                headers: {
                    authorization: `token ${token}`,
                },
                owner: nameAndRepo[0],
                repo: nameAndRepo[1],
                pullNumber: this.getPullNumber(),
            },
        );
        console.log(`Exiting getSubject Id`);
        return newVar;

    }

    async addComment(comment: string) {
        console.log('Inside addComment');
        const nameAndRepo: string[] = this.getOwnerAndRepo();
        const [name, repo] = nameAndRepo
        console.log(`Name is ${name}  and repo is ${repo}`);
        const findPullRequestIdQuery = this.findPullRequestQuery();
        try {
            const subjectId = await this.getSubjectId(findPullRequestIdQuery, nameAndRepo);
            return await this.addCommentUsingSubjectId(subjectId, comment);
        } catch (e) {
            console.error(e);
        }
    }
}

export default AddComment;
