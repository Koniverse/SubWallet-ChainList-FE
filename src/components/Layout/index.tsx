/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/how-to/querying-data/use-static-query/
 */

import * as React from "react"
import {useStaticQuery, graphql} from "gatsby"

import "./layout.css"
import {AppStateProvider} from "../../providers/AppStateProvider";
import NotificationProvider from "../../providers/NotificationProvider";
import {ThemeProvider} from "../../providers/ThemeProvider";
import {Col, Row} from "@subwallet/react-ui";

interface Props {
    children: React.ReactNode
}

const Layout = ({children}: Props) => {
    const data = useStaticQuery(graphql`
        query SiteTitleQuery {
            site {
                siteMetadata {
                    title
                }
            }
        }
    `)

    return (
        <ThemeProvider>
            <NotificationProvider>
                <AppStateProvider>
                    <Row>
                        <Col span={16} offset={4}>
                            {children}
                        </Col>
                    </Row>
                </AppStateProvider>
            </NotificationProvider>
        </ThemeProvider>
    )
}

export default Layout
