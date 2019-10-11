import User from '../data/User';
import { isDateInPreviousMonth } from './date'


export const parsePullRequests = (prs: Array<String>): Array<[number, User]> => {
  var users: Array<User> = [];

  prs.forEach(pr => {
    var pObj = JSON.parse(JSON.stringify(pr));
    var date = new Date(pObj.closedAt);

    var isInPreviousMonth = isDateInPreviousMonth(date);

    if (pObj.author !== null && pObj.participants !== undefined) {
      parse(users, pObj.participants.nodes, pObj.reviewRequests.nodes, pObj.reviews.nodes, pObj.author.login, isInPreviousMonth);
    }
  });

  var usersWithIndex = rate(users.filter(u => u.total > 0 && u.monthlyTotal !== 0));

  return usersWithIndex.sort((u1, u2) => ((u1[1].approves / u1[1].total) < (u2[1].approves / u2[1].total)) ? 1 : -1)
}

const rate = (users: Array<User>): Array<[number, User]> => {
  var usersWithIndex: Array<[number, User]> = []

  var maxComments: number = Math.max.apply(Math, users.map(u => u.monthlyComments));

  users.forEach(u => u.rating = (u.monthlyApproves / u.monthlyTotal) + (u.monthlyComments / maxComments));

  users.sort((u1, u2) => u1.rating < u2.rating ? 1 : -1)
    .forEach((u, i) => usersWithIndex.push([i, u]));

  return usersWithIndex;
}

const parse = (users: Array<User>, participants: Array<String>, reviewRequests: Array<String>, reviews: Array<String>,
  author: string, isInPreviousMonth: boolean) => {
  reviewRequests.forEach(rqst => {
    updateReviewRequest(users, rqst, isInPreviousMonth);
  });

  participants.forEach(p => {
    updateParticipant(users, author, p, isInPreviousMonth);
  })

  reviews.forEach(r => {
    updateReviews(users, r, isInPreviousMonth);
  });
}

const updateReviewRequest = (users: Array<User>, request: String, isInPreviousMonth: boolean) => {
  var rObj = JSON.parse(JSON.stringify(request));

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
}

const updateParticipant = (users: Array<User>, author: string, participant: String, isInPreviousMonth: boolean) => {
  var pObj = JSON.parse(JSON.stringify(participant));
  var user = users.find(user => user.name === pObj.login);

  if (user === undefined) {
    var newUser = new User(pObj.login, pObj.avatarUrl);

    increaseApproves(author, pObj.login, newUser);

    if (isInPreviousMonth) {
      increaseMonthlyApproves(author, pObj.login, newUser);
    }

    users.push(newUser);
  } else {
    increaseApproves(author, pObj.login, user);

    if (isInPreviousMonth) {
      increaseMonthlyApproves(author, pObj.login, user);
    }
  }
}

const updateReviews = (users: Array<User>, review: String, isInPreviousMonth: boolean) => {
  var rObj = JSON.parse(JSON.stringify(review));
  if (rObj.author != null) {
    update(users, rObj.author.login, rObj.comments.totalCount);

    if (isInPreviousMonth) {
      monthlyUpdate(users, rObj.author.login, rObj.comments.totalCount);
    }
  }
}

const increaseApproves = (author: string, login: string, user: User) => {
  if (author !== login) {
    user.approves++;
    user.total++;
  }
}

const increaseMonthlyApproves = (author: string, login: string, user: User) => {
  if (author !== login) {
    user.monthlyApproves++;
    user.monthlyTotal++;
  }
}

const update = (users: Array<User>, login: string, comments: number) => {
  users.forEach(user => {
    if (user.name === login) {
      user.comments = user.comments + comments;
    }
  })
}

const monthlyUpdate = (users: Array<User>, login: string, comments: number) => {
  users.forEach(user => {
    if (user.name === login) {
      user.monthlyComments = user.monthlyComments + comments;
    }
  })
}
