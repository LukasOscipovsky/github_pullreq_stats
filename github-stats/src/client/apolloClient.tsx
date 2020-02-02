import ApolloClient from 'apollo-boost';
import { gql } from "apollo-boost";
import { useQuery } from 'react-apollo';
import User from '../data/User';

const getHeaders = (accessToken: String): Headers => {
    return new Headers({
        // 'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
    })
}

const GET_TEAM_NAME = gql`
{
    organization(login: $org) {
        team(slug: "the-sirius-crew") {
            members(first: 10) {
                nodes {
                    id
                    login
                }
            }
        }
    }
}
`
export const getClient = (accessToken: string, org: string): any => {
    var users: Array<User> = []

    var client = new ApolloClient({
        uri: `https://api.github.com/graphql?access_token=${accessToken}`,
    })

    client.query({
        query: gql`
        {
            organization(login: "${org}") {
                team(slug: "the-sirius-crew") {
                    members(first: 10) {
                        nodes {
                            id
                            login
                            avatarUrl
                        }
                    }
                }
            }
        }
        `
    }).then(result => {
        var members: Array<String> = result.data.organization.team.members.nodes

        members.forEach(element => {
            var m = JSON.parse(JSON.stringify(element))
            users.push(new User(m.login, m.avatarUrl))
        });
    })

    console.log(users)
}