import ChainItem from "./ChainItem";
import {Card, Checkbox, Col, Input, Row, Select, Space, Typography} from "@subwallet/react-ui";
import * as React from "react";
import {graphql, useStaticQuery} from "gatsby";
import {Chain} from "../../types/dataType";
import {useMemo, useState} from "react";
import {CheckboxChangeEvent} from "@subwallet/react-ui/es/checkbox";

interface DataChain {
    node: Chain
}

const ChainList = () => {
    const [searchInput, setSearchInput] = useState('');
    const [searchType, setSearchType] = useState('substrate');
    const [searchTestnet, setSearchTestnet] = useState(false);
    const data = useStaticQuery(graphql`
        {
            allStrapiChain(filter: {name: {regex: "//i"}}) {
                edges {
                    node {
                        id
                        name
                        slug
                        isTestnet
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
    const dataFilter = useMemo(() => {
        console.log(searchInput, searchType, searchTestnet)
        return data.allStrapiChain.edges.filter(({node}: DataChain) => {
            if (searchType === 'substrate') {
                return node.name.toLowerCase().includes(searchInput.toLowerCase())
                && node.isTestnet === searchTestnet
                && node.substrateInfo !== null;
            }
            return node.name.toLowerCase().includes(searchInput.toLowerCase())
                && node.isTestnet === searchTestnet
            && node.evmInfo !== null;

        });
    }, [searchInput, searchType, searchTestnet])
    const onChangeSearchInput = (e: any) => {
        setSearchInput(e.target.value)
    }
    const handleChange = (value: string) => {
        console.log(`selected ${value}`);
        setSearchType(value);
    }

    const onChangeTestnet = (e: CheckboxChangeEvent) => {
        console.log(`checked = ${e.target.checked}`);
        setSearchTestnet(e.target.checked);
    };

    return (
        <Space direction='vertical'  style={{display: 'flex'}}>
            <Row>
                <Col span={24}>
                    <Card size={'default'}>
                        <Row>
                            <Col span={24}>
                                <Space direction='vertical' style={{display: 'flex'}}>

                                    <Input style={{marginBottom: 10}} placeholder="Search chain"
                                           onChange={onChangeSearchInput} size='md'
                                           prefix={<i className="icon icon-search"/>}/>

                                    <Space>
                                        <Typography.Text>Type</Typography.Text>
                                        <Select
                                            value={searchType}
                                            style={{width: 120}}
                                            onChange={handleChange}
                                            options={[
                                                {value: 'substrate', label: 'Substrate'},
                                                {value: 'evm', label: 'EVM'},
                                            ]}
                                        />
                                        <Checkbox checked={searchTestnet} onChange={onChangeTestnet}>Testnet</Checkbox>
                                    </Space>

                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
            <Space direction="horizontal" style={{display: 'flex'}} size={[12, 16]} wrap>
                {
                    dataFilter.map(({node}: DataChain) => {
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
