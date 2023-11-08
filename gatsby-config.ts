import type { GatsbyConfig } from "gatsby"
require("dotenv").config({
    path: `.env`,
})
const config: GatsbyConfig = {
  siteMetadata: {
    title: `SubWallet-ChainList-FE`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [

        `gatsby-plugin-image`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,

        {
            resolve: "gatsby-source-strapi",
            options: {
                apiURL: process.env.STRAPI_API_URL || "http://localhost:1337",
                accessToken: process.env.STRAPI_TOKEN,
                collectionTypes: ["chain", "data-content-test"],
            }
        },
  ],
}

export default config
