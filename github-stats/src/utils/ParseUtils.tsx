import User from '../data/User';
import DateUtils from './DateUtils'

export default class ParseUtils {

  static parseParent(prs: Array<String>, isMonthlyMode: boolean) : Array<User> {
    var users: Array<User> = [];
    var monthlyUsers: Array<User> = [];

    prs.forEach(pr => {
      var pObj = JSON.parse(JSON.stringify(pr));
      var date = new Date(pObj.closedAt);
      var currentDate = new Date();

      if (isMonthlyMode) {
        if (pObj.author != null && DateUtils.isDateInCurrentMonthAndYear(date, currentDate.getMonth(), currentDate.getFullYear())) {
          this.parse(users, pObj.participants.nodes, pObj.reviewRequests.nodes, pObj.reviews.nodes, pObj.author.login);
        }
      } else {
        if (pObj.author != null) {
          this.parse(users, pObj.participants.nodes, pObj.reviewRequests.nodes, pObj.reviews.nodes, pObj.author.login);
        }

        if (pObj.author != null && DateUtils.isDateInCurrentMonthAndYear(date, currentDate.getMonth() - 1, currentDate.getFullYear())) {
          this.parse(monthlyUsers, pObj.participants.nodes, pObj.reviewRequests.nodes, pObj.reviews.nodes, pObj.author.login);
        }      
      }
    });

    if (!isMonthlyMode) {
      monthlyUsers = monthlyUsers.filter(u => u.total > 0).sort((u1 ,u2) => u1.approves < u2.approves ? 1 : -1)
      var user = monthlyUsers.entries().next().value["1"];

      console.log(monthlyUsers);
      var best = users.find(u => user.name === u.name);

      if (best !== undefined) {
        best.bestInTheMonth = true
      }
    }

    return users.filter(u => u.total > 0).sort((u1 ,u2) => ((u1.approves/u1.total) < (u2.approves/u2.total)) ? 1 : -1);
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