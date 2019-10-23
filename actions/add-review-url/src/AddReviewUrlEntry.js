// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const addReviewUrl = require('./AddReviewUrl.js').default;
const core = require('@actions/core');
async function run() {
    try { 
        const host = core.getInput('host');
        const headref = process.env.GITHUB_HEAD_REF.toString();
        const comment = `You can see a private version of the changes made in this pull request here:\nhttp://${headref}.s.${host}/`;
        console.log("before the actual call");
        console.log(`addReviewUrl: ${addReviewUrl}`);
        new addReviewUrl(comment);
        console.log(`addReviewUrl: ${addReviewUrl}`);
        console.log("after the actual call");
    } 
    catch (error) {
      core.setFailed(error.message);
    }
  }
  run()
  