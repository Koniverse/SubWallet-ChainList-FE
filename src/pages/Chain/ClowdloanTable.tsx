import {ThemeProps} from "../../types";
import React, { useMemo} from "react";
import styled from "styled-components";
import DetailTable from "./DetailTable";
import {useTranslation} from "react-i18next";
import {CrowdloanType} from "../../types/dataType";
import CN from "classnames";
import CrowdloanTag from "../../components/Crowdloans/CrowdloanTag";
import {CrowdloanItem} from "../../components/Crowdloans/CrowdloanItem";
import moment from "moment-timezone";

type Props = ThemeProps & {
    crowdLoanList: CrowdloanType[];
};
interface _CrowdloanTagType extends CrowdloanType{
  slug: string;
}

const Component = ({crowdLoanList, className}: Props) => {
    const {t} = useTranslation();
    const filteredList:_CrowdloanTagType[] = useMemo(() => {
        return crowdLoanList && crowdLoanList.map((item) => {
            return {...item, slug: item.fundId.toString()}
        })
    }, [crowdLoanList]);
    return (
        <div className={CN(className)}>
            <DetailTable<_CrowdloanTagType>
                columns={[
                    {
                        title: t<string>('Crowdloan round'),
                        dataIndex: 'clowloanRound',
                        key: 'clowloanRound',
                        render: (_, row: _CrowdloanTagType) => {
                            return (
                                <CrowdloanItem
                                    key={row.slug}
                                    status={row.status}
                                    fundId={row.fundId}
                                />
                            );
                        }
                    },
                    {
                        title: t<string>('Status'),
                        dataIndex: 'status',
                        className: '__center-col',
                        render: (_, row) => {
                            return (
                                <CrowdloanTag status={row.status}/>
                            );
                        }
                    },
                    {
                        title: 'Start time',
                        dataIndex: 'startTime',
                        key: 'type',
                        className: '__center-col',
                        render: (_, row) => {
                            return (
                                <>{moment(row.startTime).format('DD/MM/YYYY')}</>
                            );
                        }
                    },

                    {
                        title: t<string>('End time'),
                        dataIndex: 'endTime',
                        key: 'endTime',
                        className: '__center-col',
                        render: (_, row) => {
                            return (
                                <>{moment(row.endTime).format('DD/MM/YYYY')}</>
                            );
                        }
                    },
                ]}
                pagination={false}
                dataSource={filteredList}
            />
        </div>
    )
}


const ClowdloanTable = styled(Component)<ThemeProps>(({theme: {extendToken, token}}: ThemeProps) => {
    return {
        '.ant-table .ant-table-content table .ant-table-thead .ant-table-cell.__center-col': {
            textAlign: 'center'
        },
        '.ant-table .ant-table-content table .ant-table-row .ant-table-cell.__center-col': {
            textAlign: 'center'
        },
    }
});
export default ClowdloanTable;
