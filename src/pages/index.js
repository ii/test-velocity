import React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"
import dayjs from 'dayjs'
import { upperFirst } from 'lodash'

// takes a timestamp and returns it in nice month/day/year format.
let prettyDate = (timestamp) => dayjs(timestamp).format('MM-DD-YYYY');


// Takes a take a week key, from graphql query, plus the graphql issues
// makes a component that lists all merged issues from that week.
const WeekSection = ({weekRange, issues}) => {
  let weekResults = issues[weekRange]
  let title = "PR's Merged " + upperFirst(weekRange.split(/(?=[A-Z])/).join(" "))
  return (
    <section>
    <h2>{title}</h2>
    <p>Total PR's Merged: {weekResults.issueCount}</p>
        {weekResults.edges.map(({node}) => <IssueItem issue={node} key={node.id} />)}
    </section>
  )
}


//given an Issue object, return a <li> item with the issue details
const IssueItem = ({issue}) => {
  return (
      <li>
      <p>{prettyDate(issue.mergedAt)}</p>
      <a href={issue.url}target="_blank" rel="noreferrer noopen">#{issue.number}: {issue.title}</a>
      <p>Authored by: <a href={issue.author.url} target="_blank" rel="noreferrer noopen">{issue.author.name}</a></p>
    </li>
  )
}

// Run through our query and grab each week section, returning a <WeekSection /> component for each
const IndexPage = ({ data }) => {
  const issues = data.github
  let weekQueries = Object.keys(data.github)
  return (
      <Layout>
        <SEO title="Home" />
        {weekQueries.map((weekRange) => <WeekSection issues={issues} weekRange={weekRange} />)}
      </Layout>
  )
}


// TODO: Figure out how the reviews are collated, we want to have the person who says lgtm,
// not necessarily the last review comment (as it is often from the original author)

// the date for each search query is dynamic,
// but graphql wont' accept template string variables for security reasions
// and so we pass the queries into our site's 'context', then pass it as arguments to the query.
// see gatsby-node.js for where this happens.
export const query = graphql`
query($mergedPastWeek: String!, $mergedTwoWeeksAgo: String!, $mergedThreeWeeksAgo: String!, $mergedFourWeeksAgo: String!, $mergedFiveWeeksAgo: String!) {
  github {
    pastOneWeek: search(query:$mergedPastWeek, type: ISSUE, first: 100) {
      issueCount
      ...PRSearchResults
      }
    pastTwoWeeks: search(query: $mergedTwoWeeksAgo, type: ISSUE, first: 100) {
      issueCount
      ...PRSearchResults
    }
    pastThreeWeeks: search(query: $mergedThreeWeeksAgo, type: ISSUE, first: 100) {
      issueCount
      ...PRSearchResults
    }
    pastFourWeeks: search(query: $mergedFourWeeksAgo, type: ISSUE, first: 100) {
      issueCount
      ...PRSearchResults
    }
    pastFiveWeeks: search(query: $mergedFiveWeeksAgo, type: ISSUE, first: 100) {
      issueCount
      ...PRSearchResults
    }
  }
}

fragment PRSearchResults on GitHub_SearchResultItemConnection {
  edges {
    node {
      ... on GitHub_PullRequest {
        ...PullRequestDetails
      }
    }
  }
}

fragment PullRequestDetails on GitHub_PullRequest {
  state
  title
  id
  url
  number
  closedAt
  mergedAt
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
