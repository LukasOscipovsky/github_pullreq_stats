export const getOrgAndRepo = (organization: string, repository: string): string => {
    return `query {
    organization(login: "${organization}") {
      repository(name: "${repository}") {
        name 
      }
    }
  }`
}