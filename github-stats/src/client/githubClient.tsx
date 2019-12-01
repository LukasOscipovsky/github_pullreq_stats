import axios from 'axios';
import { getPrData } from './prQuery';
import { getOrgAndRepo } from './repoQuery';

const url: string = 'https://api.github.com/graphql';

const getUrl = (accessToken: string): string => {
    return url + '?access_token=' + accessToken;
}

const getHeaders = (): Headers => {
    return new Headers({
        'Content-Type': 'application/json'
    })
}

export const getOrgOrRepo = async (accessToken: string, organization: string, repository: string) => {
    return await axios.post(getUrl(accessToken), {
        query: getOrgAndRepo(organization, repository),
        headers: getHeaders()
    })
}


export const getPullRequests = async (accessToken: string, organization: string, repository: string, branch: string) => {
    var prNumber: number = 30;
    var pullRequests: Array<String> = [];
    var hasNextPage: boolean = true;
    var after: string | null = null;

    do {
        let response: any = await axios.post(getUrl(accessToken), {
            query: getPrData(prNumber, organization, repository, after, branch),
            headers: getHeaders()
        })

        let prs = response.data.data.organization.repository.pullRequests;

        after = prs.pageInfo.endCursor;
        hasNextPage = prs.pageInfo.hasNextPage;

        pullRequests.push(prs.nodes)
    } while (hasNextPage)

    return pullRequests.concat(...pullRequests);
}