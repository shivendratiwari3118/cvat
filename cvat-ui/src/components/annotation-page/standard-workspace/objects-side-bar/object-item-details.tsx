// Copyright (C) 2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { Row } from 'antd/lib/grid';
import Collapse from 'antd/lib/collapse';
import {DeleteOutlined} from '@ant-design/icons'
import ItemAttribute from './object-item-attribute';
import Corrector from './labelGenerator/corrector';

interface Props {
    points:any;
    readonly: boolean;
    collapsed: boolean;
    clientID: number;
    attributes: any[];
    serverID: number | undefined;
    AnnotationId: number | undefined;
    jobInstance: any;
    values: Record<number, string>;
    changeAttribute(attrID: number, value: string): void;
    collapse(): void;
}

export function attrValuesAreEqual(next: Record<number, string>, prev: Record<number, string>): boolean {
    const prevKeys = Object.keys(prev);
    const nextKeys = Object.keys(next);

    return (
        nextKeys.length === prevKeys.length &&
        nextKeys.map((key: string): boolean => prev[+key] === next[+key]).every((value: boolean) => value)
    );
}

function attrAreTheSame(prevProps: Props, nextProps: Props): boolean {
    return (
        nextProps.readonly === prevProps.readonly &&
        nextProps.collapsed === prevProps.collapsed &&
        nextProps.attributes === prevProps.attributes &&
        attrValuesAreEqual(nextProps.values, prevProps.values)
    );
}

function ItemAttributesComponent(props: Props): JSX.Element {
    const {
        AnnotationId, jobInstance,points, serverID, collapsed, attributes, values, readonly, changeAttribute, collapse,clientID,
    } = props;
    const popOverHide = () =>{
        console.log("")
    }

    return (
        <Row>
            {/* <div style={{marginTop: '-23px', marginLeft:'6px'}}>
            <DeleteOutlined />
            </div> */}
            <Corrector serverID={serverID} AnnotationId={AnnotationId} attributes={attributes} jobInstance={jobInstance} popOverHide={popOverHide}/>
            <Collapse
                className='cvat-objects-sidebar-state-item-collapse'
                activeKey={collapsed ? [] : ['details']}
                onChange={collapse}
            >
                <Collapse.Panel header={<span style={{ fontSize: '11px' }}>Details</span>} key='details'>
                    {attributes.map(
                        (attribute: any): JSX.Element => (
                            <Row
                                key={attribute.id}
                                align='middle'
                                justify='start'
                                className='cvat-object-item-attribute-wrapper'
                            >
                                <ItemAttribute
                                    points={points}
                                    jobInstance={jobInstance}
                                    AnnotationId={AnnotationId}
                                    readonly={readonly}
                                    clientID={clientID}
                                    attrValue={values[attribute.id]}
                                    attrInputType={attribute.inputType}
                                    attrName={attribute.name}
                                    attrID={attribute.id}
                                    attrValues={attribute.values}
                                    changeAttribute={changeAttribute}                           />
                            </Row>
                        ),
                    )}
                </Collapse.Panel>
            </Collapse>
        </Row>
    );
}

export default React.memo(ItemAttributesComponent, attrAreTheSame);
