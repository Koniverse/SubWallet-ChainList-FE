import ChainItem from "./ChainItem";
import {Space} from "@subwallet/react-ui";
import * as React from "react";
import {graphql, useStaticQuery} from "gatsby";
import {Chain} from "../../types/chain";
interface DataChain {
    node: Chain
}
const ChainList = () => {
    const data = useStaticQuery(graphql`
        {
            allStrapiChain {
                edges {
                    node {
                        id
                        name
                        slug
                        substrateInfo{
                            symbol
                        }
                        evmInfo{
                            symbol
                        }
                        icon {
                            localFile{
                                url
                                childImageSharp{
                                    gatsbyImageData(width: 30)
                                }
                            }
                        }
                    }
                }
            }
        }
    `)
    return (
        <Space direction="horizontal" style={{display: 'flex'}} size={[8, 16]} wrap>
            {
                data.allStrapiChain.edges.map(({node}: DataChain) => {
                    console.log(node)
                    return (
                        <ChainItem node={node} key={node.id}/>
                    )
                })
            }
        </Space>
    )
}
export default ChainList
