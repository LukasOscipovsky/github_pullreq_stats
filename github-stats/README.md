# Github Stats Tool

## Goal

The project was created to motivate people in the team to do the reviews https://www.atlassian.com/agile/software-development/code-reviews

Github Stats tool displays stats of the reviews based on given organization and repository in periodic intervals set by app. 

Tool takes pull requests data and parse them to calculate all the approves/request changes and given comments per user asked to do review on the pull request.

Users are ordered by the overall percentage of the approves/requestChanges to number of assignemts of the user to PRs on giver repository.

There is also percentage for last month per user shown as well.

There is option to highlight most and least active user. Most and least active user is calculated based on last month stats, that means each month there is option to have
different highlighted users.

!!! Tool is not made to punish anybody in the team, just do the opposite and motivate people to do the reviews based on overall standing and increase overall quality 
of the code.

Mandatory fields: personal access token, organization, repository and refresh interval.

Optional: branch, if branch is not filled, then it will take all branches in repository

Ranking: highlighting most active and least active user

## Team

[![img](https://avatars3.githubusercontent.com/u/34230432?s=60&v=4)](https://github.com/LukasOscipovsky)


## Tech

- React
- Typescript
- Github GraphQl API

## Usage

Tool is available on personal AWS S3 bucket: http://github-stats-tool.s3-website.eu-central-1.amazonaws.com/