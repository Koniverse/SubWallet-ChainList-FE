import type {GatsbyNode} from "gatsby"
import path from "path";
import allStrapiChainQuery = Queries.allStrapiChainQuery;
export const createPages: GatsbyNode["createPages"] = async ({
                                                                 actions, graphql
                                                             }) => {
    const {createPage} = actions;
    const templateChain = path.resolve("./src/templates/chain.tsx")

    const result = await graphql<allStrapiChainQuery>(
            `query allStrapiChain
            {
                allStrapiChain {
                    nodes {
                        slug,id,
                        name
                    }
                }
            }
        `
    )
    if (result.data && result?.data?.allStrapiChain) {
        const dataChainList = result.data?.allStrapiChain?.nodes;

        if (dataChainList.length > 0) {
            dataChainList.forEach((item: any) => {
                createPage({
                    path: `/chain/${item.slug}`,
                    component: templateChain,
                    context: {
                        slug: item.slug,
                    },
                })
            })
        }

    }
}
