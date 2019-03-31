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

    static getQuery(number: number) : string {
        return `query {
            organization(login: "performgroup") {
              repository(name: "rp-rights-platform") {
                pullRequest(number: ${number}) {
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
          }`
    }
}