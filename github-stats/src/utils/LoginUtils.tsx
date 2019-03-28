export default class LoginUtils {
    private static url : string = 'https://api.github.com/graphql';
    private static accessToken: string = '81e417a19b4d639547dc29e544032c24c7b972cf';
    private static userAgentHeader: string = 'user-agent';
    private static userAgentHeaderValue: string = 'lukaso89';

    static getUrl() : string {
        return this.url + '?access_token=' + this.accessToken; 
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