// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState, useEffect } from 'react';
import { Row, Col, Button} from 'antd/lib/grid';
import { MoreOutlined, DeleteOutlined } from '@ant-design/icons';
import Modal from 'antd/lib/modal';
import Dropdown from 'antd/lib/dropdown';
import Text from 'antd/lib/typography/Text';
import serverProxy from 'cvat-core/src/server-proxy';
import { ObjectType, ShapeType, ColorBy } from 'reducers/interfaces';
import CVATTooltip from 'components/common/cvat-tooltip';
import LabelSelector from 'components/label-selector/label-selector';
import ItemMenu, { RemoveItem } from './object-item-menu';

interface Props {
    jobInstance: any;
    readonly: boolean;
    clientID: number;
    serverID: number | undefined;
    labelID: number;
    labels: any[];
    shapeType: ShapeType;
    objectType: ObjectType;
    color: string;
    colorBy: ColorBy;
    type: string;
    locked: boolean;
    changeColorShortcut: string;
    copyShortcut: string;
    pasteShortcut: string;
    propagateShortcut: string;
    toBackgroundShortcut: string;
    toForegroundShortcut: string;
    removeShortcut: string;
    changeColor(color: string): void;
    changeLabel(label: any): void;
    copy(): void;
    remove(): void;
    propagate(): void;
    createURL(): void;
    switchOrientation(): void;
    toBackground(): void;
    toForeground(): void;
    resetCuboidPerspective(): void;
}

interface abcd {
    changeColorPickerVisible(visible: boolean): void;
    colorPickerVisible: boolean;
}

type Pprops = Props & abcd;
// const mainProps = Props && abcd

function ItemTopComponent(props: Pprops): JSX.Element {
    const {
        readonly,
        clientID,
        serverID,
        labelID,
        labels,
        shapeType,
        objectType,
        color,
        colorBy,
        type,
        locked,
        changeColorShortcut,
        copyShortcut,
        pasteShortcut,
        propagateShortcut,
        toBackgroundShortcut,
        toForegroundShortcut,
        removeShortcut,
        changeColor,
        changeLabel,
        copy,
        remove,
        propagate,
        createURL,
        switchOrientation,
        toBackground,
        toForeground,
        resetCuboidPerspective,
        jobInstance,
    } = props;

    const [menuVisible, setMenuVisible] = useState(false);
    const [colorPickerVisible, setColorPickerVisible] = useState(false);

    const changeMenuVisible = (visible: boolean): void => {
        if (!visible && colorPickerVisible) return;
        setMenuVisible(visible);
    };

    const changeColorPickerVisible = (visible: boolean): void => {
        if (!visible) {
            setMenuVisible(false);
        }
        setColorPickerVisible(visible);
    };

    const [currentId,setCurrentId] = useState(0);

    async function updateAgain(){
        serverProxy.jobs.getSrMainAndTrackId(jobInstance.id)
        .then((data) => {
                let currObj = data.track_ids.filter((item:any) => {
                    let ko = Object.keys(item);
                    if(Number(ko[0]) === serverID){
                        return item;
                    }
                })
                if(currObj.length < 1){
                    if(data.track_ids.length < 1){
                        setCurrentId(0);
                    }else{
                        let obj = data.track_ids[data.track_ids.length - 1];
                        let vals = Object.values(obj);
                        let val = Number(vals[0]) + 1;
                        setCurrentId(val);
                    }
                }else{
                    let values = Object.values(currObj[0]);
                    setCurrentId(values[0]);     
                }
        })  
        .catch(err => console.log(err));
    }

    async function updatetrackId(){
        serverProxy.jobs.getSrMainAndTrackId(jobInstance.id)
            // .then((response) => response.json())
            .then((data) => {
                let currObj = data.track_ids.filter((item:any) => {
                    let ko = Object.keys(item);
                    if(Number(ko[0]) === serverID){
                        return item;
                    }
                })
                if(currObj.length < 1){
                    updateAgain();
                }else{
                    let values = Object.values(currObj[0]);
                    setCurrentId(values[0]);
                }
            })  
            .catch(err => console.log(err));
    }

    useEffect(()=>{
        updatetrackId();
    },[]);

    // const handleDeleteClick = () => {
    //     return(
    //         <>
    //             <RemoveItem toolProps={props}/>
    //         </>
    //     )

    // }
    
    return (
        <Row align='middle'>
            <Col span={10}>
            <Text style={{ fontSize: 12 }}>{`${serverID} (${currentId})`}</Text>
                <br />
                <Text
                    type='secondary'
                    style={{ fontSize: 10 }}
                    className='cvat-objects-sidebar-state-item-object-type-text'
                >
                    {type}
                </Text>
            </Col>
            <Col span={12}>
                <CVATTooltip title='Change current label'>
                    <LabelSelector
                        disabled={readonly}
                        size='small'
                        labels={labels}
                        value={labelID}
                        onChange={changeLabel}
                        className='cvat-objects-sidebar-state-item-label-selector'
                    />
                </CVATTooltip>
            </Col>
            <Col span={2}>
                <Dropdown
                    visible={menuVisible}
                    onVisibleChange={changeMenuVisible}
                    placement='bottomLeft'
                    overlay={ItemMenu({
                        jobInstance,
                        readonly,
                        serverID,
                        locked,
                        shapeType,
                        objectType,
                        color,
                        colorBy,
                        colorPickerVisible,
                        changeColorShortcut,
                        copyShortcut,
                        pasteShortcut,
                        propagateShortcut,
                        toBackgroundShortcut,
                        toForegroundShortcut,
                        removeShortcut,
                        changeColor,
                        copy,
                        remove,
                        propagate,
                        createURL,
                        switchOrientation,
                        toBackground,
                        toForeground,
                        resetCuboidPerspective,
                        changeColorPickerVisible,
                    })}
                >
                    <MoreOutlined />
                </Dropdown>
            </Col>
            <div style={{marginBottom:"-83px", marginLeft: '5px'}}>                
                <DeleteOutlined />
            </div>
        </Row>
    );
}

export default React.memo(ItemTopComponent);
