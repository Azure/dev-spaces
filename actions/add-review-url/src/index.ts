// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import AddComment from './AddReviewUrl';
import * as core from "@actions/core";

async function run() {
    const addComment = new AddComment();
    try {
        const host = core.getInput('host');
        /* let headref = '';
        if (process.env.GITHUB_HEAD_REF)
        {
          headref = process.env.GITHUB_HEAD_REF.toString();
        } */
        let headref = process.env.GITHUB_HEAD_REF || '';
        const comment = `You can see a private version of the changes made in this pull request here:\nhttp://${headref}.s.${host}/`;   
        await addComment.addComment(comment);
    }catch (error) {
        core.setFailed(error.message);
    }
}

run().catch(error => core.setFailed(error.message));