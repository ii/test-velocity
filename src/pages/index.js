import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

const IndexPage = ({ data }) => {
  console.log({ data })
  const issues = data.github
  return (
      <Layout>
      <SEO title="Home" />
      <h1>Hi Stephen!</h1>
      <p>Issues closed this week: {issues.oneWeekAgo.issueCount}</p>
      <p>Issues closed last week: {issues.twoWeeksAgo.issueCount}</p>
      <h1>Hi people</h1>
      <p>Welcome to your new Gatsby site.</p>
      <p>Now go build something great.</p>
      <div style={{ maxWidth: `300px`, marginBottom: `1.45rem` }}>
      <Image />
      </div>
      <Link to="/page-2/">Go to page 2</Link>
      </Layout>
  )
}

export const query = graphql`
query Issues {
  github{
   oneWeekAgo: search (query: "project:kubernetes/9 is:closed closed:>2019-06-10 type:pr", type: ISSUE, first: 100) {
    issueCount
  }
  twoWeeksAgo: search (query: "project:kubernetes/9 is:closed closed:<2019-06-10 type:pr", type: ISSUE, first: 100) {
    issueCount
  }
  }
}
`

export default IndexPage
