import User from '../data/User';
import DateUtils from './DateUtils'

export default class ParseUtils {

  static parseParent(prs: Array<String>) : Array<User> {
    var users: Array<User> = [];
    var currentDate = new Date();

    prs.forEach(pr => {
      var pObj = JSON.parse(JSON.stringify(pr));
      var date = new Date(pObj.closedAt);

      var isInPreviousMonth = DateUtils.isDateInCurrentMonthAndYear(date, currentDate.getMonth() - 1, currentDate.getFullYear());

      if (pObj.author != null) {
        this.parse(users, pObj.participants.nodes, pObj.reviewRequests.nodes, pObj.reviews.nodes, pObj.author.login, isInPreviousMonth);
      }
    });

    return users.filter(u => u.total > 0).sort((u1 ,u2) => ((u1.approves/u1.total) < (u2.approves/u2.total)) ? 1 : -1);
  }

  static parse(users: Array<User>, participants: Array<String>, reviewRequests: Array<String>, reviews: Array<String>, 
    author: string, isInPreviousMonth: boolean) {
    reviewRequests.forEach(rqst => {
      var rObj = JSON.parse(JSON.stringify(rqst));

      if (rObj.requestedReviewer === null) {
        return;
      }

      var user = users.find(user => user.name === rObj.requestedReviewer.login);

      if (user === undefined) {
        var newUser = new User(rObj.requestedReviewer.login, rObj.requestedReviewer.avatarUrl);

        newUser.total++;

        if (isInPreviousMonth) {
          newUser.monthlyTotal++
        }

        users.push(newUser);
      } else {
        user.total++;

        if (isInPreviousMonth) {
          user.monthlyTotal++
        }
      }
    });

    participants.forEach(p => {
      var pObj = JSON.parse(JSON.stringify(p));
      var user = users.find(user => user.name === pObj.login);

      if (user === undefined) {
        var newUser = new User(pObj.login, pObj.avatarUrl);

        this.increaseApproves(author, pObj.login, newUser);

        if (isInPreviousMonth) {
          this.increaseMonthlyApproves(author, pObj.login, newUser);
        }

        users.push(newUser);
      } else {
        this.increaseApproves(author, pObj.login, user);

        if (isInPreviousMonth) {
          this.increaseMonthlyApproves(author, pObj.login, user);
        }
      }
    })

    reviews.forEach(r => {
      var rObj = JSON.parse(JSON.stringify(r));
      if (rObj.author != null) {
        this.update(users, rObj.author.login, rObj.comments.totalCount);
        
        if (isInPreviousMonth) {
          this.monthlyUpdate(users, rObj.author.login, rObj.comments.totalCount);
        }  
      }
    });
  }

  static increaseApproves(author: string, login: string, user: User) {
    if (author !== login) {
      user.approves++;
      user.total++;
    }
  }

  static increaseMonthlyApproves(author: string, login: string, user: User) {
    if (author !== login) {
      user.monthlyApproves++;
      user.monthlyTotal++;
    }
  }

  static update(users: Array<User>, login: string, comments: number) {
    users.forEach(user => {
      if (user.name === login) {
        user.comments = user.comments + comments;
      }
    })
  }

  static monthlyUpdate(users: Array<User>, login: string, comments: number) {
    users.forEach(user => {
      if (user.name === login) {
        user.monthlyComments = user.monthlyComments + comments;
      }
    })
  }
}