import axios from 'axios';
import { getUrl, getHeaders, getQuery } from '../utils/login';
import { parseParent } from '../utils/parse';
import User from '../data/User';

export const getUsers = async (accessToken: string, repository: string, branch: string) => {
    var prNumber: number = 30;
    var hasNextPage: boolean = true;
    var after: string | null = null;
    var pullRequests: Array<String> = [];

    do {
        await axios.post(getUrl(accessToken), {
            query: getQuery(prNumber, repository, after, branch),
            headers: getHeaders()
        })
            .then(response => {
                if (response.data.data.organization.repository === null) {
                    alert('repository does not exists');
                    hasNextPage = false;
                    return;
                }

                var prs = response.data.data.organization.repository.pullRequests;

                after = prs.pageInfo.endCursor;
                hasNextPage = prs.pageInfo.hasNextPage;

                pullRequests.push(prs.nodes)
            })
    } while (hasNextPage)

    console.log("som tu");
    console.log(pullRequests);

    var users: Array<[number, User]> = parseParent(pullRequests.concat(...pullRequests));

    return users;
}