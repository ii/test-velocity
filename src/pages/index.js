import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"
import dayjs from 'dayjs'

const dateFormat = 'YYYY-MM-DD'
const today = dayjs().format(dateFormat)
const oneWeekAgo = dayjs().subtract(1, 'week').format(dateFormat)
console.log({today, oneWeekAgo})

const IssueItem = ({issue}) => {
  return (
      <li>
      <a href={issue.url}target="_blank" rel="noreferrer noopen">#{issue.number}: {issue.title}</a>
      <p>Authored by: <a href={issue.author.url} target="_blank" rel="noreferrer noopen">{issue.author.name}</a></p>
    </li>
  )
}

const IndexPage = ({ data }) => {
  const issues = data.github
  let oneWeekAgo = issues.oneWeekAgo
  return (
      <Layout>
      <SEO title="Home" />
      <h1>Hi Stephen!</h1>
      <p>PR's Merged This Week: {issues.oneWeekAgo.issueCount}</p>
      <ul>
      {oneWeekAgo.edges.map(({node}) => {
        return (
            <IssueItem issue={node} />
        )
      })}
      </ul>
      <p>Issues closed last week: {issues.twoWeeksAgo.issueCount}</p>
      </Layout>
  )
}


// Figure out how the reviews are collated, we want to have the person who says lgtm,
// not necessarily the last review comment (as it is often from the original author)
export const query = graphql`
query($mergedPastWeek: String!) {
  github {
    oneWeekAgo: search(query:$mergedPastWeek, type: ISSUE, first: 100) {
      issueCount
      edges {
        node {
          ... on GitHub_PullRequest {
            ...PullRequestDetails
          }
        }
      }
    }
    twoWeeksAgo: search(query: "project:kubernetes/9 is:closed closed:<2019-06-10 type:pr", type: ISSUE, first: 100) {
      issueCount
    }
  }
}

fragment PullRequestDetails on GitHub_PullRequest {
  state
  title
  url
  number
  closedAt
  author {
    ...AuthorDetails
  }
  reviews(last: 1) {
    edges {
      node {
        author {
          ...AuthorDetails
        }
        comments(last: 1) {
          totalCount
          edges {
            node {
              bodyText
            }
          }
        }
      }
    }
  }
}

fragment AuthorDetails on GitHub_Actor {
  ... on GitHub_User {
    name
    company
    url
    avatarUrl
  }
}
`

export default IndexPage
