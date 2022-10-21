// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState, useEffect } from 'react';
import { Radio } from 'antd';
import Button from 'antd/lib/button';
import InputNumber from 'antd/lib/input-number';
import type { RadioChangeEvent } from 'antd';
import Menu from 'antd/lib/menu';
import Modal from 'antd/lib/modal';
import { MoreOutlined, DeleteOutlined } from '@ant-design/icons';
import { Row, Col} from 'antd/lib/grid';
import Dropdown from 'antd/lib/dropdown';
import Text from 'antd/lib/typography/Text';
import serverProxy from 'cvat-core/src/server-proxy';
import { ObjectType, ShapeType, ColorBy } from 'reducers/interfaces';
import CVATTooltip from 'components/common/cvat-tooltip';
import LabelSelector from 'components/label-selector/label-selector';
import ItemMenu from './object-item-menu';

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
    const [option, setOption] = useState<string>('current-frame');
    const [startFrame, setStartFrame] = useState<number>(0);
    const [endFrame, setEndFrame] = useState<number>(0);
    // const { toolProps, ...rest } = props;
    // const { removeShortcut, locked, remove, serverID } = toolProps;

    const [start, setStart] = useState<any>();
    const [end, setEnd] = useState<any>(null);
    const [value, setValue] = useState(1);
    const currentFrameValue = localStorage.getItem('frameNumber')

    const onRadioChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
        if(e.target.value === 5){
          setStart(null);
          setEnd(null);
        }
      };


  React.useEffect(() => {    
    if (value == 1) {
        console.log("currentFrameValue", currentFrameValue)
      setStart(currentFrameValue);
      setEnd(currentFrameValue);
    } else if (value == 2) {
      setStart(currentFrameValue);
      setEnd(jobInstance.stopFrame);
    } else if (value == 3) {
    //   setStart(jobInstance.startFrame);
    console.log("value 3")
    const sFrame = 'start'
      setStart(sFrame);
      setEnd(currentFrameValue);
    }
    else if (value == 4) {
        // setStart(jobInstance.startFrame);
        setStart("start");
        setEnd(jobInstance.stopFrame);
      }
      
  }, [value]);   

    const frames_delete = {        
        first: start,
        last: end,
    };

    // console.log("jobInstance", jobInstance)
    // const abc = `${jobInstance}`
    // JSON.parse(txt)
    // localStorage.setItem("jobInstance", JSON.stringify(jobInstance))
   
    window.localStorage.setItem('delete_frames', JSON.stringify(frames_delete));

    const handleRemoveAnnotation = (): void => {        
        const delete_frames = JSON.parse(window.localStorage.getItem('delete_frames'));
        console.log("delete_frames", delete_frames)
        const payLoad: payLoadProps = {
            frame: delete_frames.first == 'start' ? "start" : parseInt(delete_frames.first),
            next_frame: parseInt(delete_frames.last) + 1,
            track_id: serverID,
        };

        serverProxy.jobs
            .saveBulkDelete(jobInstance.id, payLoad)
            .then((result: any) => {
                window.location.reload();
                return result;
            })
            .catch((error: any) => {
                return error;
            });
    };

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

    
    enum MenuKeys {        
        REMOVE_ITEM = 'remove_item',
    }
    
    return (
        <Row align='middle'>
            <Col span={10}>
            <Text style={{ fontSize: 12 }}>{`${serverID}`}</Text>
            {/* <Text style={{ fontSize: 12 }}>{`${serverID} (${currentId})`}</Text> */}
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
            <div style={{marginBottom:"-86px", marginLeft: '-10px'}}>                
            <Button style={{color: 'black'}} key={MenuKeys.REMOVE_ITEM} type='link' onClick={(): void => {
                        Modal.info({
                            className: 'cvat-modal-confirm',
                            title: 'Delete Annotation',
                            onOk() {
                                if (locked) {
                                    Modal.confirm({
                                        className: 'cvat-modal-confirm',
                                        title: 'Object is locked',
                                        content: 'Are you sure you want to remove it?',
                                        onOk() {
                                            remove();
                                        },
                                    });
                                } else {
                                    handleRemoveAnnotation();
                                }
                            },
                            content: (
                                <>
                                    <Row align='middle' justify='space-between'>
                                        <div className='delete-head'>
                                            <p>Single ROI for deletion</p>
                                        </div>
                                        <Radio.Group className='radio-container' onChange={onRadioChange}>
                                            <Radio value={1}>Current Frame</Radio>
                                            <Radio value={2}>
                                                Current Frame to End Frame
                                            </Radio>
                                            <Radio value={3}>
                                                Start Frame to Current Frame
                                            </Radio>
                                            <Radio value={4}>Start Frame to End Frame</Radio>
                                            <Radio value={5}>
                                                Enter Start Frame &nbsp;
                                                <InputNumber  min={1} onChange={(value:number) => setStart(value)} />
                                                
                                                to End &nbsp;Frame &nbsp;
                                                <InputNumber    min={start} onChange={(value: number) => setEnd(value)} />
                                               
                                            </Radio>
                                        </Radio.Group>
                                    </Row>

                                </>
                            ),
                        });
                    }} >
            <DeleteOutlined />
            </Button>
            </div>
        </Row>
    );
}

export default React.memo(ItemTopComponent);
