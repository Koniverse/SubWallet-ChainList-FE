import * as React from "react"
import Layout from "../components/Layout";
import Seo from "../components/seo";
import ChainList from "../components/Chain/ChainList";
import {Col, Row} from "@subwallet/react-ui";

const IndexPage: () => React.JSX.Element = () => {
    return (
        <Layout>
            <Row>
                <Col span={16} offset={4}>
                    <ChainList/>
                </Col>
            </Row>
        </Layout>
    )
}
export default IndexPage

export const Head = () => <Seo title="Page index"/>
