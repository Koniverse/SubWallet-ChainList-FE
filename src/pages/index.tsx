import * as React from "react"
import Layout from "../components/Layout";
import Seo from "../components/seo";
import ChainList from "../components/Chain/ChainList";

const IndexPage: () => React.JSX.Element = () => {
    return (
        <Layout>
            <ChainList/>
        </Layout>
    )
}
export default IndexPage

export const Head = () => <Seo title="Page index"/>
