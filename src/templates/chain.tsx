import React, {useMemo} from "react"
import {graphql} from "gatsby"
import Seo from "../components/seo"
import Layout from "../components/Layout"
import {Chain, ChainAsset} from "../types/dataType";
import ChainItem from "../components/Chain/ChainItem";
import {Card, Space, Table, Tag, Typography} from "@subwallet/react-ui";
import {ColumnsType} from "@subwallet/react-ui/es/table";
import StatusIcon from "../components/StatusIcon";
import {GatsbyImage, getImage} from "gatsby-plugin-image";

interface Props {
    data: {
        strapiChain: Chain,
        allStrapiChainAsset: {
            edges: {
                node: ChainAsset
            }[]
        }
    }
}

interface DataType {
    key: string;
    address: string;
    latency: number;
    score: string;
    privacy: string;
}

interface DataTypeToken {
    icon: string;
    symbol: string;
    contractAddress: string;
    price: string;
    canBy: string;
}
function shuffleArray(originalArray: any[]): any[] {
  const shuffledArray = [...originalArray]; // Sao chép mảng gốc để không làm thay đổi nó
  return shuffledArray.sort(() => Math.random() - 0.5);
}

const ChainPage = ({data}: Props) => {
    const {strapiChain,allStrapiChainAsset} = data;
    console.log(data)


    const columnsTokens: ColumnsType<DataTypeToken> = [
        {
            title: 'Icon',
            key: 'icon',
            dataIndex: 'icon',
            render: (icon: any) => (
                <>
                    <GatsbyImage
                        image={getImage(icon as any) as any}
                        className="mt-6" alt={'image'}/>
                </>
            ),
        },
        {
            title: 'Symbol',
            key: 'symbol',
            dataIndex: 'symbol',
        },
        {
            title: 'Contract Address',
            key: 'contractAddress',
            dataIndex: 'contractAddress',
        },
        {
            title: 'Price',
            key: 'price',
            dataIndex: 'price',
        },
        {
            title: 'Can By',
            key: 'canBy',
            dataIndex: 'canBy',
        },
    ];



    const columns: ColumnsType<DataType> = [
        {
            title: 'RPC Server Address',
            dataIndex: 'address',
            key: 'address',
        },
        {
            title: 'Height',
            dataIndex: 'age',
            key: 'height',
        },
        {
            title: 'Latency',
            dataIndex: 'latency',
            key: 'latency',
        },
        {
            title: 'Score',
            key: 'score',
            dataIndex: 'score',
            render: (score: string) => (
                <>
                    {<StatusIcon status={score}/>}
                </>
            ),
        },
        {
            title: 'Privacy',
            key: 'privacy',
            dataIndex: 'privacy',
            render: (score: string) => (
                <>
                    {<StatusIcon status={score}/>}
                </>
            ),
        },
        {
            key: 'action',
            render: (score: string) => (
                <>
                    <Typography.Text>Add to wallet</Typography.Text>
                </>
            ),
        },
    ];

    const dataTable: DataType[] = useMemo(() => {
        const dataValueTable = strapiChain.providers.map((provider) => {

            return {
                key: provider.id,
                latency: 0,
                height: 32,
                address: provider.url,
                score: shuffleArray(['success', 'info', 'error', 'warning'])[0],
                privacy: shuffleArray(['success', 'info', 'error', 'warning'])[0],
            }
        });
        return dataValueTable;
    }, [strapiChain]);

    const dataTokenTable: DataTypeToken[] = useMemo(() => {
        const dataValueTable = allStrapiChainAsset.edges.map(({node}) => {
            return {
                icon: node?.icon?.localFile,
                symbol: node.symbol,
                contractAddress: '',
                price: '',
                canBy: 'Yes',

            }
        });
        return dataValueTable;
    }, [strapiChain]);

    return (
        <Layout>
            <Seo title={strapiChain?.name}/>
            <Space direction='vertical'>
                <ChainItem node={strapiChain}/>
                <Card bordered={true}>
                    <Table columns={columns} dataSource={dataTable}/>;
                </Card>
                <Card bordered={true}>
                    <Table columns={columnsTokens} dataSource={dataTokenTable}/>;
                </Card>
            </Space>
        </Layout>
    )
}

export const query = graphql`
    query ($slug: String) {
        strapiChain(slug: {eq: $slug}) {
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
            providers {
                id
                name
                url
            }
        }
        allStrapiChainAsset(filter: {originChain: {slug: {eq: $slug}}}) {
            edges {
                node {
                    id
                    assetRefs {
                        id
                    }
                    symbol
                    icon {
                        localFile{
                            childImageSharp {

                                gatsbyImageData(width: 30)
                            }
                        }
                    }
                }
            }
        }
    }
`

export default ChainPage
