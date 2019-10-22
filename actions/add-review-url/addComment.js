const addReviewUrl = require('./lib/AddReviewUrl');
//const {core} = require('@actions/core');
async function run() {
    try { 
        //const host = core.getInput('host');
        //const headref = process.env.GITHUB_HEAD_REF.toString();
        //const comment = `You can see a private version of the changes made in this pull request here:\nhttp://${headref}.s.${host}/`;
        new addReviewUrl.default().addComment("hi comment");
    } 
    catch (error) {
      core.setFailed(error.message);
    }
  }
  run()
  