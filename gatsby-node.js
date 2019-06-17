/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const dayjs = require('dayjs')

const dateFormat = 'YYYY-MM-DD'
const oneWeekAgo = dayjs().subtract(1, 'week').format(dateFormat)

console.log({oneWeekAgo})

exports.onCreatePage = ({page, actions}) => {
  const { createPage } = actions

  createPage({
    ...page,
    context: {
      mergedPastWeek: `project:kubernetes/9 is:merged merged:>${oneWeekAgo} type:pr`
    }
  })
}

