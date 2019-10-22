const addReviewUrl = require('./AddReviewUrl.js');
//const {core} = require('@actions/core');
async function run() {
    try { 
        //const host = core.getInput('host');
        //const headref = process.env.GITHUB_HEAD_REF.toString();
        //const comment = `You can see a private version of the changes made in this pull request here:\nhttp://${headref}.s.${host}/`;
        console.log("before the actual call");
        console.log(`addReviewUrl: ${addReviewUrl}`);
        new addReviewUrl.addComment("Hello from check");
        new addReviewUrl.default().addComment("hi comment");
        console.log("before the actual call");
    } 
    catch (error) {
      core.setFailed(error.message);
    }
  }
  run()
  