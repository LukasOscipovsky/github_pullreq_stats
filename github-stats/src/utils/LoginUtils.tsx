export default class LoginUtils {
    private static url : string = 'https://api.github.com/graphql';

    static getUrl(accessToken: string) : string {
        return this.url + '?access_token=' + accessToken; 
    }

    static getHeaders() : Headers {
        return new Headers({
            'Content-Type': 'application/json'
        })
    }

    static getQuery(number: number, repository: string, afterToken: string|null, branch: string|null) : string {
      var after: string = '';
      var branchString: string = '';

      if (afterToken != null) {
        after = `after: "${afterToken}",`
      }

      if (branch != null) {
         branchString = `baseRefName: "${branch}",`
      }

      return `query {
        organization(login: "performgroup") {
          repository(name: "${repository}") {
            pullRequests(first: ${number}, ${after} ${branchString} states: MERGED) {
              pageInfo {
                hasNextPage
                endCursor
              }
              nodes {
                closedAt
                author {
                  login
                }
                reviews(first: 100, states: COMMENTED) {
                  nodes {
                    comments(first: 100) {
                    totalCount 
                    }
                    author {
                      login
                    }
                  }
                }
                reviewRequests(first: 100) {
                  nodes {
                    requestedReviewer {
                      ... on User {
                        login
                        avatarUrl
                      }
                    }
                  }
                }
                participants(first: 100) {
                  nodes {
                    login
                    avatarUrl
                  }
                }
              }
            }
            }
          }
        }`
  }
}