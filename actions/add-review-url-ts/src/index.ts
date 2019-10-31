import AddComment from './AddReviewUrl';
import * as core from "@actions/core";

async function run() {
    const  addComment = new AddComment();
    try {
        const host = core.getInput('host');
        let headref = '';
        if (process.env.GITHUB_HEAD_REF)
        {
          headref = process.env.GITHUB_HEAD_REF.toString();
        }
        const comment = `You can see a private version of the changes made in this pull request here:\nhttp://${headref}.s.${host}/`;   
        await addComment.addComment(comment);
    }catch (e) {
        console.log(e);
    }
}

run().catch(e => console.log(e));