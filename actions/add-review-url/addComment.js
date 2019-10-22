const addReviewUrl = require('./lib/AddReviewUrl');
async function run() {
    try { 
      addReviewUrl.default;
    } 
    catch (error) {
      core.setFailed(error.message);
    }
  }
  run()
  