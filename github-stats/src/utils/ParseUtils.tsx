import User from '../data/User';
import DateUtils from './DateUtils'

export default class ParseUtils {

  static parseParent(users: Array<User>, prs: Array<String>, isMonthlyMode: boolean) {
    prs.forEach(pr => {
      var pObj = JSON.parse(JSON.stringify(pr));
      var date = new Date(pObj.closedAt);

      if (isMonthlyMode) {
        var currentDate = new Date();

        if (pObj.author != null && DateUtils.isDateInCurrentMonthAndYear(date, currentDate)) {
          this.parse(users, pObj.participants.nodes, pObj.reviewRequests.nodes, pObj.reviews.nodes, pObj.author.login);
        }
      } else {
        if (pObj.author != null) {
          this.parse(users, pObj.participants.nodes, pObj.reviewRequests.nodes, pObj.reviews.nodes, pObj.author.login);
        }
      }
    });
  }

  static parse(users: Array<User>, participants: Array<String>, reviewRequests: Array<String>, reviews: Array<String>, author: string) {
    reviewRequests.forEach(rqst => {
      var rObj = JSON.parse(JSON.stringify(rqst));

      if (rObj.requestedReviewer === null) {
        return;
      }

      var user = users.find(user => user.name === rObj.requestedReviewer.login);

      if (user === undefined) {
        var newUser = new User(rObj.requestedReviewer.login, rObj.requestedReviewer.avatarUrl);

        newUser.total++;

        users.push(newUser);
      } else {
        user.total++;
      }
    });

    participants.forEach(p => {
      var pObj = JSON.parse(JSON.stringify(p));
      var user = users.find(user => user.name === pObj.login);

      if (user === undefined) {
        var newUser = new User(pObj.login, pObj.avatarUrl);

        this.increaseApproves(author, pObj.login, newUser);

        users.push(newUser);
      } else {
        this.increaseApproves(author, pObj.login, user);
      }
    })

    this.updateUsersWithReviews(users, reviews)
  }

  static updateUsersWithReviews(participants: Array<User>, reviews: Array<String>) {
    reviews.forEach(r => {
      var rObj = JSON.parse(JSON.stringify(r));
      if (rObj.author != null) {
        this.update(participants, rObj.author.login, rObj.comments.totalCount);
      }
    });
    return participants;
  }

  static increaseApproves(author: string, login: string, user: User) {
    if (author !== login) {
      user.approves++;
      user.total++;
    }
  }

  static update(users: Array<User>, login: string, comments: number) {
    users.forEach(user => {
      if (user.name === login) {
        user.comments = user.comments + comments;
      }
    })
  }
}