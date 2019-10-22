const addReviewUrl = require('./lib/AddReviewUrl');
async function run() {
    try { 
        const host = core.getInput('host');
        const headref = process.env.GITHUB_HEAD_REF.toString();
        const comment = `You can see a private version of the changes made in this pull request here:\nhttp://${headref}.s.${host}/`;
        addReviewUrl.default.addComment(comment);
    } 
    catch (error) {
      core.setFailed(error.message);
    }
  }
  run()
  