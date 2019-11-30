import axios from 'axios';
import { getUrl, getHeaders, getQuery } from '../utils/login';

export const getPullRequests = async (accessToken: string, organization: string, repository: string, branch: string) => {
    var prNumber: number = 30;
    var pullRequests: Array<String> = [];
    var hasNextPage: boolean = true;
    var after: string | null = null;

    do {
        let response: any = await axios.post(getUrl(accessToken), {
            query: getQuery(prNumber, organization, repository, after, branch),
            headers: getHeaders()
        })

        if (response.data.data.organization.repository === null) {
            alert('repository does not exist');
            hasNextPage = false;
            return;
        }

        let prs = response.data.data.organization.repository.pullRequests;

        after = prs.pageInfo.endCursor;
        hasNextPage = prs.pageInfo.hasNextPage;

        pullRequests.push(prs.nodes)
    } while (hasNextPage)

    return pullRequests.concat(...pullRequests);
}