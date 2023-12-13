// Copyright 2019-2022 @polkadot/extension-ui authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* eslint-disable react/jsx-no-bind */
import type {ColumnsType} from '@subwallet/react-ui/es/table';

import {Table} from '@subwallet/react-ui';
import React from 'react';
import {TablePaginationConfig} from "@subwallet/react-ui/lib";

type Props<T> = {
    className?: string
    columns: ColumnsType<T>
    dataSource: T[]
    onClick?: (item: T) => void
    pagination?: TablePaginationConfig | false
}

const Component = <T extends object>({
                                         className,
                                         columns,
                                         dataSource,
                                         pagination,
                                         onClick
                                     }: Props<T & { slug: string }>): React.ReactElement<Props<T & {
    slug: string
}>> => {

    return (
        <Table
            className={className}
            columns={columns}
            dataSource={dataSource}
            onRow={(record) => {
                return {
                    onClick: () => {
                        onClick && onClick(record);
                    }
                };
            }}
            pagination={pagination}
            rowKey={(record) => record.slug}
        />
    );
};

export default Component;
