/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const dayjs = require('dayjs')

const dateFormat = 'YYYY-MM-DD'

// takes a number X and date format,
// returns a date string for a day X weeks back in set format
let pastWeekDate = (numOfWeeks, format) => dayjs().subtract(numOfWeeks, 'week').format(format)

const oneWeekAgo = pastWeekDate(1, dateFormat)
const twoWeeksAgo = pastWeekDate(2, dateFormat)
const threeWeeksAgo = pastWeekDate(3, dateFormat)
const fourWeeksAgo = pastWeekDate(4, dateFormat)
const fiveWeeksAgo = pastWeekDate(5, dateFormat)




// this is a function that runs every time a page is compiled by gatsby
// and so we are saying, for each page, add these context items.
// this allows us to pass them to any graphql query as an argument.
exports.onCreatePage = ({page, actions}) => {
  const { createPage } = actions

  createPage({
    ...page,
    context: {
      mergedPastWeek: `project:kubernetes/9 is:merged merged:>${oneWeekAgo} type:pr`,
      mergedTwoWeeksAgo: `project:kubernetes/9 is:merged merged:${twoWeeksAgo}..${oneWeekAgo} type:pr`,
      mergedThreeWeeksAgo: `project:kubernetes/9 is:merged merged:${threeWeeksAgo}..${twoWeeksAgo} type:pr`,
      mergedFourWeeksAgo: `project:kubernetes/9 is:merged merged:${fourWeeksAgo}..${threeWeeksAgo} type:pr`,
      mergedFiveWeeksAgo: `project:kubernetes/9 is:merged merged:${fiveWeeksAgo}..${fourWeeksAgo} type:pr`
    }
  })
}

