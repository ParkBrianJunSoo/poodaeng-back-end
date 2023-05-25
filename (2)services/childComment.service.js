const ChildCommentRepository = require("../(3)repositories/childComment.repository.js");
const CommentRepository = require("../(3)repositories/comment.repository.js");

const { ChildComments, Comments, Users, Posts } = require("../models");

class ChildCommentService {
    childCommentRepository = new ChildCommentRepository(ChildComments);
    commentRepository = new CommentRepository(Comments, Users, Posts);

    // 대댓글 생성
    createChildComment = async (userId, postId, commentId, childComment) => {
        return await this.childCommentRepository.createChildComment(userId, postId, commentId, childComment);
    };

    // 대댓글 조회
    findChildCommentsByCommentId = async (commentId) => {
        const childComments = await this.childCommentRepository.findChildCommentsByCommentId(commentId);

        const childCommentsWithDetail = await Promise.all(
            childComments.map(async (childComment) => {
                const user = await this.commentRepository.findUserById(childComment.UserId);

                return {
                    childCommentId: childComment.childCommentId,
                    CommentId: childComment.CommentId,
                    UserId: childComment.UserId,
                    PostId: childComment.PostId,
                    childComment: childComment.childComment,
                    nickname: user.nickname,
                    userPhoto: user.userPhoto, // userphotoUrl
                    createdAt: childComment.createdAt,
                    updatedAt: childComment.updatedAt
                }
            })
        )

        return childCommentsWithDetail.sort((a, b) => b.createdAt - a.createdAt);
    };

    // 대댓글 하나 찾기
    findChildCommentById = async (childCommentId) => {
        return await this.childCommentRepository.findChildCommentById(childCommentId);
    };

    // 대댓글 삭제
    deleteChildComment = async (userId, postId, commentId, childCommentId) => {
        return await this.childCommentRepository.deleteChildComment(userId, postId, commentId, childCommentId);
    };
};


module.exports = ChildCommentService;