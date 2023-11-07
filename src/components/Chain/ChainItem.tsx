import {Card, Space, Typography} from "@subwallet/react-ui";
import {GatsbyImage, getImage} from "gatsby-plugin-image";
import * as React from "react";
import {Chain} from "../../types/chain";

interface Props {
    node: Chain
}

const ChainItem = ({node}: Props) => {
    const symbol = node?.substrateInfo?.symbol || node?.evmInfo?.symbol
    return (
        <Card bordered={true} style={{width: 320, height: 200}}>
            <Space direction="vertical">
                <Space>
                    <GatsbyImage
                        image={getImage(node?.icon?.localFile as any) as any}
                        className="mt-6" alt={node.name as string}/>
                    <Typography.Title level={4}>{node.name}</Typography.Title>
                </Space>
                <Space direction='horizontal'>
                    <Space direction='vertical'>
                        <Typography.Text>ChainID</Typography.Text>
                        <Typography.Text>{node.id.slice(0, 10)}</Typography.Text>
                    </Space>
                    <Space direction='vertical'>
                        <Typography.Text>Currency</Typography.Text>
                        <Typography.Title size='md'>{symbol}</Typography.Title>
                    </Space>
                </Space>
            </Space>`
        </Card>
    );
}
export default ChainItem;
