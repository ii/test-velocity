import React from "react";
import {
  graphql
} from "gatsby";
import Layout from "../components/layout";
import SEO from "../components/seo";
import dayjs from 'dayjs';
// import { upperFirst } from 'lodash'

const DustyPage = ({data}) => {
  let today = dayjs();
  let inReviewEdge = data.github.organization.project.columns.edges.filter(({node}) => node.name === "In Review");
  let inReviewCards = inReviewEdge[0].node.cards;

  let dustyCards = inReviewCards.edges.filter(({node}) => {
    let lastUpdated = node.updatedAt
    return today.diff(lastUpdated, 'day') > 21
  });

  return (
      <Layout>
      <SEO title = "Dusty Pages" />
      <h1> hi i 'm dusty In Review Cards</h1>
      {dustyCards.map(({node}) => {
        return (
          <div>
          <h2 > {node.content.title}</h2>
          <p> Last Updated on: {dayjs(node.updatedAt).format("MMMM DD YYYY")}</p>
          <p>{node.content.reviews.totalCount}</p>
          </div>
        );
      })}
    </Layout>
  )
};


export const query = graphql`
query{
  github {
    organization(login: "kubernetes") {
      project(number: 9) {
        columns(last: 10) {
          edges {
            node {
              name
              cards(last: 100, archivedStates: [NOT_ARCHIVED]) {
                edges {
                  node {
                    ... on GitHub_ProjectCard {
                      content {
                        ... on GitHub_PullRequest {
                          title
                          reviews {
                            totalCount
                          }
                        }
                      }
                      state
                      updatedAt
                      column {
                        name
                      }
                    }
                    content {
                      ... on GitHub_PullRequest {
                        title
                        reactions {
                          totalCount
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}`

export default DustyPage;
