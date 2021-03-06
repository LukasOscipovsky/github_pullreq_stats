export const getPrData = (number: number, organization: string, repository: string, afterToken: string | null, branch: string | null): string => {
  var after: string = '';
  var branchString: string = '';

  if (afterToken !== null) {
    after = `after: "${afterToken}",`
  }

  if (branch !== '') {
    branchString = `baseRefName: "${branch}",`
  }

  return `query {
    organization(login: "${organization}") {
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
