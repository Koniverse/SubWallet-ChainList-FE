import {Card, Space, Typography, Web3Block} from "@subwallet/react-ui";
import {GatsbyImage, getImage} from "gatsby-plugin-image";
import * as React from "react";
import {Chain} from "../../types/dataType";
import {Link} from "gatsby";

interface Props {
    node: Chain
}

const ChainItem = ({node}: Props) => {
    const symbol = node?.substrateInfo?.symbol || node?.evmInfo?.symbol
    return (
        <Card bordered={true} style={{width: 360, height: 300}}>
            <Space direction="vertical" style={{display: 'flex'}}>
                <Space>
                    <GatsbyImage
                        image={getImage(node?.icon?.localFile as any) as any}
                        className="mt-6" alt={node.name as string}/>
                    <Link to={`/chain/${node.slug}`}>
                        <Typography.Title level={4}>{node.name}</Typography.Title>
                    </Link>
                </Space>
                <Space direction='vertical' size={[16, 16]} wrap>
                    <Space direction='horizontal'  size='large'>
                        <Space direction='vertical'>
                            <Typography.Text>ChainID</Typography.Text>
                            <Typography.Text>{node.id.slice(0, 10)}</Typography.Text>
                        </Space>
                        <Space direction='vertical'>
                            <Typography.Text>Currency</Typography.Text>
                            <Typography.Title size='md'>{symbol}</Typography.Title>
                        </Space>
                        <Space direction='vertical'>
                            <Typography.Text>Slug</Typography.Text>
                            <Typography.Title size='md'>{node.slug}</Typography.Title>
                        </Space>
                    </Space>
                    <Space direction='horizontal' size='large'>
                        <Space direction='vertical'>
                            <Typography.Text>Type</Typography.Text>
                            <Typography.Text>{node.substrateInfo ? 'Substrate' : 'EVM'}</Typography.Text>
                        </Space>
                        <Space direction='vertical'>
                            <Typography.Text>IsTestnet</Typography.Text>
                            <Typography.Title size='md'>{node.isTestnet ? 'Yes': 'No'}</Typography.Title>
                        </Space>
                        <Space direction='vertical'>
                            <Typography.Text>Price</Typography.Text>
                            <Typography.Title size='md'>{symbol}</Typography.Title>
                        </Space>
                    </Space>
                </Space>
            </Space>`
        </Card>
    );
}
export default ChainItem;
