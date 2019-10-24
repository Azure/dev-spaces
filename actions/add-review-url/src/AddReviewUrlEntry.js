// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const addReviewUrl = require('./AddReviewUrl.js').default;
const core = require('@actions/core');
async function run() {
    try { 
        const host = core.getInput('host');
        const headref = process.env.GITHUB_HEAD_REF.toString();
        const comment = `You can see a private version of the changes made in this pull request here:\nhttp://${headref}.s.${host}/`;        
        var call = new addReviewUrl(comment);        
    } 
    catch (error) {
      core.setFailed(error.message);
    }
  }
  run()  