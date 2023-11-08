import ChainItem from "./ChainItem";
import {Card, Col, Input, Row, Space, Typography} from "@subwallet/react-ui";
import * as React from "react";
import {graphql, useStaticQuery} from "gatsby";
import {Chain} from "../../types/chain";
import {useState} from "react";

interface DataChain {
    node: Chain
}

const ChainList = () => {
    const [searchInput, setSearchInput] = useState('int');
    const data = useStaticQuery(graphql`
        {
             allStrapiChain(filter: {name: {regex: "//i"}}) {
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
        <Space direction='vertical'>
            <Row>
                <Col span={24}>
                    <Card size={'default'}>
                        <Input placeholder="Search chain" size='md' prefix={<i className="icon icon-search"/>}/>

                    </Card>
                </Col>
            </Row>
            <Space direction="horizontal" style={{display: 'flex'}} size={[12, 16]} wrap>
                {
                    data.allStrapiChain.edges.map(({node}: DataChain) => {
                        return (
                            <ChainItem node={node} key={node.id}/>
                        )
                    })
                }
            </Space>
        </Space>
    )
}
export default ChainList
