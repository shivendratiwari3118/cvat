// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React, { useState, useEffect, useRef } from 'react';
import { Radio } from 'antd';
import { Row, Col } from 'antd/lib/grid';
import Button from 'antd/lib/button';
import Menu from 'antd/lib/menu';
import InputNumber from 'antd/lib/input-number';
import type { RadioChangeEvent } from 'antd';
import Modal from 'antd/lib/modal';
import { MoreOutlined, DeleteOutlined } from '@ant-design/icons';
import Dropdown from 'antd/lib/dropdown';
import Text from 'antd/lib/typography/Text';
import serverProxy from 'cvat-core/src/server-proxy';
import { ObjectType, ShapeType, ColorBy } from 'reducers/interfaces';
import CVATTooltip from 'components/common/cvat-tooltip';
import LabelSelector from 'components/label-selector/label-selector';
import ItemMenu from './object-item-menu';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnnotationsAsync, removeAnnotationsAsync, removeObjectAsync, saveAnnotationsAsync } from 'actions/annotation-actions';

interface Props {
    jobInstance: any;
    points: any;
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
interface ItemProps {
    toolProps: Props;
}

function ItemTopComponent(props: Props): JSX.Element {
    const {
        readonly,
        clientID,
        points,
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

    const dispatch = useDispatch()

    const abcData = useSelector((state) => state);
    const [menuVisible, setMenuVisible] = useState(false);
    const [colorPickerVisible, setColorPickerVisible] = useState(false);
    const [start, setStart] = useState<any>(null);
    const [end, setEnd] = useState<any>(null);
    const [value, setValue] = useState(1);
    const [cflag, setCFlag] = useState(false)
    const copyId = localStorage.getItem("copyShapeId")
    const copyFlag: any = localStorage.getItem("copyFlag")
    const currentFrameValue = localStorage.getItem('frameNumber')
    const [removeFlag, setRemoveFlag] = useState(true)


    const onRadioChange = (e: RadioChangeEvent) => {
        setValue(e.target.value);
        if (e.target.value === 5) {
            setStart(null);
            setEnd(null);
        }
    };
    const pasteDeleteFlag: any = localStorage.getItem("setRemoveFlag")
    const previousSidRef = useRef(null)
    const previousReduxData = useRef(null);
    console.log(previousReduxData, "previousReduxData abcd", abcData?.annotation?.annotations?.states?.map(item =>{return {id: item.serverID, time:item.updated}}))
   
//     const fdata = abcData?.annotation?.annotations?.states?.map(item =>{return {id: item.serverID, time:item.updated}})
//     let maxTime = '';
//     fdata.forEach(item => {
//         if(item.time > maxTime){
//             maxTime = item.time
//         }
//     })
//     const filterData = fdata.find(item => item.time === maxTime)
// console.log("filterData", filterData);

const annotationFunc = async() => {
   const res = await serverProxy?.annotations?.getAnnotations("job", jobInstance?.id)
    .then(response => {
        console.log("response", response?.data?.tracks)
        const aData = response?.data?.tracks[response?.data?.tracks.length -1]?.id;
        console.log("annotationCopyData", aData)
        localStorage.setItem("annotationCopyData",aData)

})
console.log("annotationCopyData", res)
return res;
}

// useEffect(() => {
//     console.log("jobInstance?.id", jobInstance?.id)
//     // annotationFunc();
//     dispatch(fetchAnnotationsAsync())
// },[])
const [responseData, setResponseData] = useState();
// useEffect(() => {
//     serverProxy?.annotations?.getAnnotations("job", jobInstance?.id)
//         .then((response:any) => {
//             console.log("useEffect response", response?.data?.tracks[response?.data?.tracks.length -1]?.id)
//             setAFlag(true)
//             localStorage.setItem("annotationCopyData",response?.data?.tracks[response?.data?.tracks.length -1]?.id)
//             setResponseData(response)
//             // idd = response?.tracks[response.tracks.length - 1]?.id
//         })
// },[])
// console.log("responseData", responseData);
const payLoadPostAPI = async (jobData:any, jobid:any) => {
    // return serverProxy.jobs
    //   .saveBulkupdate(payload)
    //   .then((result: any) => {
    //     return result;
    //   })
    console.log("jobid", jobid)
      

     return await serverProxy?.annotations?.getAnnotations(jobData, jobid)
     .then((result: any) => {
        let abc:any = [];
        result.tracks.map((item:any) => abc.push(item?.id));
        console.log("abc", abc)
        return abc;
      })
      .catch((error: any) => {
        return error;
      })
  }

  const [aFlag, setAFlag] = useState(false)
  const fetchAnnotationsId:any = localStorage.getItem("fetchAnnotationsId")
  const fetchAnnotationsIdFlag = localStorage.getItem("fetchAnnotationsIdFlag")
  console.log(fetchAnnotationsIdFlag,"fetchAnnotationsId", fetchAnnotationsId)
    // useEffect( ()=>  {
    //     // console.log(removeFlag, "removeFlag useEffect", abc)
    //     // let idd = "";
    //     // serverProxy?.annotations?.getAnnotations("job", jobInstance?.id)
    //     // .then((response:any) => {
    //     //     console.log("response", response)
    //     //     setAFlag(true)
    //     //     idd = response?.tracks[response.tracks.length - 1]?.id
    //     // })
            
    //             // console.log("previousSidRef.current !== sId", previousSidRef.current, sId)
               
        
    //     if (pasteDeleteFlag == "true") {

    //         // localStorage.setItem("useEffectId", true)
    //         // dispatch(fetchAnnotationsAsync());
    //         const test1 = abcData?.annotation?.annotations?.states
    //         const sId = test1[test1.length - 1]?.serverID
    //         const idd:any = copyId;
    //         console.log("jobInstance?.id", jobInstance?.id)
    //         const responseData =  payLoadPostAPI("job", jobInstance.id)
    //         console.log("responseData", responseData)
    //         // serverProxy?.annotations?.getAnnotations("job", jobInstance?.id)
    //         // .then((response:any) => {
    //         //     console.log("response", response)
    //         //     setAFlag(true)
    //         //     idd = response?.tracks[response.tracks.length - 1]?.id
    //         // })

    //         const annotationCopyData:any = localStorage.getItem("annotationCopyData")
    //         console.log("annotationCopyData", annotationCopyData)
    //         const fdata = abcData?.annotation?.annotations?.states?.map(item =>{return {id: item.serverID, time:item.updated}})
    //         let maxTime = '';
    //         fdata.forEach(item => {
    //             if(item.time > maxTime){
    //                 maxTime = item.time
    //             }
    //         })
    //         const filterData = fdata.length > 1 ? fdata.filter(item => item.time === maxTime) : {}
    //         console.log("filterData", filterData);
    //         // const arr2 = previousReduxData?.current?.map(item => item.serverID)
           
    //         // let test11:any = abcData?.annotation?.annotations?.states?.map(item => item.serverID);
    //         // const test1 = abcData?.annotation?.annotations?.states
    //         // console.log("test1,", test1)
    //         // console.log(arr2,"previousReduxData in useEffect 1->", test11);
    //         // let unique1 = test11.filter((o) => arr2.indexOf(o) === -1);
    //         // let unique2 = arr2.filter((o) => arr1.indexOf(o) === -1);
    //         // const unique = unique1.concat(unique2);
    //         console.log("aFlag", aFlag)
    //         // const fetchAnnotationsId = localStorage.getItem("fetchAnnotationsId")
    //         console.log("fetchAnnotationsId", fetchAnnotationsId)
    //         // if( sId > idd){
    //         // if(idd < fetchAnnotationsId && fetchAnnotationsIdFlag == "true" && fetchAnnotationsId !== "undefined"){
    //         //     const payload = {
    //         //         "paste_delete": true,
    //         //         "copied_track": "",
    //         //         "new_track": fetchAnnotationsId,
    //         //     }
    //         //     console.log("Payload in paste Delete useEffect : ",payload);
    //         //     // if(aFlag == true){
    //         //         serverProxy.jobs.copyTrackAndPaste(payload).then((res: any) => {
    //         //             // dispatch(removeObjectAsync(jobInstance, abcData?.annotation?.annotations?.states[test1.length -1], true))
    //         //             window.location.reload();
    //         //             console.log("Server result in pastdellete useEffect : ",res);
    //         //         })
    //         // }
    //         // }
            
    //         localStorage.setItem("setRemoveFlag", false);
    //     } // dispatch(removeObjectAsync(jobInstance, ))
    //     // previousReduxData.current = abcData?.annotation?.annotations?.states?.map(item => item.serverID);
    // // })
    //     // }
    // }, [fetchAnnotationsId])


    React.useEffect(() => {
        if (value == 1) {
            setStart(currentFrameValue);
            setEnd(currentFrameValue);
        } else if (value == 2) {
            setStart(currentFrameValue);
            setEnd(jobInstance.stopFrame);
        } else if (value == 3) {
            console.log("value", value)
            /*  setStart(jobInstance.startFrame); */
            setStart("start");
            setEnd(currentFrameValue);
        }
        else if (value == 4) {
            setStart(jobInstance.startFrame);
            setEnd(jobInstance.stopFrame);
        }
    }, [value]);

    const frames_delete = {
        first: start,
        last: end,
    };
    window.localStorage.setItem('delete_frames', JSON.stringify(frames_delete));

    const handleRemoveAnnotation = (): void => {
        const delete_frames = JSON.parse(window.localStorage.getItem('delete_frames'));
        const payLoad: any = {
            frame: (delete_frames.first),
            next_frame: parseInt(delete_frames.last) + 1,
            track_id: serverID,
        };
        console.log("payload")

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

    const [currentId, setCurrentId] = useState(0);

    async function updateAgain() {
        serverProxy.jobs.getSrMainAndTrackId(jobInstance.id)
            .then((data) => {
                let currObj = data.track_ids.filter((item: any) => {
                    let ko = Object.keys(item);
                    if (Number(ko[0]) === serverID) {
                        return item;
                    }
                })
                if (currObj.length < 1) {
                    if (data.track_ids.length < 1) {
                        setCurrentId(0);
                    } else {
                        let obj = data.track_ids[data.track_ids.length - 1];
                        let vals = Object.values(obj);
                        let val = Number(vals[0]) + 1;
                        setCurrentId(val);
                    }
                } else {
                    let values = Object.values(currObj[0]);
                    setCurrentId(values[0]);
                }
            })
            .catch(err => console.log(err));
    }

    async function updatetrackId() {
        serverProxy.jobs.getSrMainAndTrackId(jobInstance.id)
            .then((data) => {
                let currObj = data.track_ids.filter((item: any) => {
                    let ko = Object.keys(item);
                    if (Number(ko[0]) === serverID) {
                        return item;
                    }
                })
                if (currObj.length < 1) {
                    updateAgain();
                } else {
                    let values = Object.values(currObj[0]);
                    setCurrentId(values[0]);
                }
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        updatetrackId();
    }, []);

    enum MenuKeys {
        REMOVE_ITEM = 'remove_item',
    }

   

    const fdataa:any = localStorage.getItem("annotationIdForCopyPaste")
    console.log("fdataa", fdataa)
    useEffect(() => {
        (async () => {
            const test1 = abcData?.annotation?.annotations?.states
            const sId = test1[test1.length - 1]?.serverID
            if (copyFlag == "true") {
                if (sId == undefined) {
                    await dispatch(saveAnnotationsAsync(jobInstance))
                }
                //  const delete_frames = JSON.parse(window.localStorage.getItem('delete_frames'));
                    const idd:any = copyId;
                // console.log("previousSidRef.current !== sId", previousSidRef.current, sId)
                if (sId > idd && copyId !== sId && sId !== undefined && previousSidRef.current !== sId) {
                    const payload = {
                        "paste_delete": false,
                        "copied_track": copyId,
                        "new_track": sId
                    }

                    await serverProxy.jobs.copyTrackAndPaste(payload).then((res) => {
                        setRemoveFlag(true)

                        localStorage.setItem("setRemoveFlag", true)
                        // dispatch(removeObjectAsync(jobInstance, abcData?.annotation?.annotations?.states[test1.length -1], true))
                        localStorage.setItem("copyFlag", false)
                        console.log("copy paste success", abcData)
                        window.location.reload();
                    })
                }
                else {
                    setCFlag(true)
                }
            }

            if(pasteDeleteFlag === "true"){
                if (sId == undefined) {
                    await dispatch(saveAnnotationsAsync(jobInstance))
                }
                //  const delete_frames = JSON.parse(window.localStorage.getItem('delete_frames'));
                    const idd:any = copyId;
                // console.log("previousSidRef.current !== sId", previousSidRef.current, sId)
                if (sId > idd && copyId !== sId && sId !== undefined && previousSidRef.current !== sId) {
                    const payload = {
                        "paste_delete": true,
                        "copied_track": "",
                        "new_track": sId
                    }

                    await serverProxy.jobs.copyTrackAndPaste(payload).then((res) => {
                        // setRemoveFlag(true)

                        localStorage.setItem("setRemoveFlag", false)
                        // // dispatch(removeObjectAsync(jobInstance, abcData?.annotation?.annotations?.states[test1.length -1], true))
                        // localStorage.setItem("copyFlag", false)
                        // console.log("copy paste success", abcData)
                        window.location.reload();
                    })
                }
            }
            previousSidRef.current = sId;
            previousReduxData.current =  test1;
            // console.log("inSide after useEffect ref", previousSidRef)
        })();
    }, [copyFlag, cflag])
    const ccId : any = localStorage.getItem("initialStateId");

    return (
        <Row align='middle'>
            <Col span={10}>
                {/* <Text style={{ fontSize: 12 }}>{`${serverID} (${currentId})`}</Text> */}
                {/* <Text style={{ fontSize: 12 }}>{copyFlag == "true" ? ccId : `${serverID}`}</Text> */}
                <Text style={{ fontSize: 12 }}>{`${serverID}`}</Text>
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
            <div style={{ marginBottom: "-86px", marginLeft: '-10px' }}>
                <Button key={MenuKeys.REMOVE_ITEM} type='link' onClick={(): void => {
                    Modal.info({
                        width: "650px",
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
                                            <InputNumber disabled={value == 5} min={1} onChange={(value: number) => setStart(value)} />

                                            to End &nbsp;Frame &nbsp;
                                            <InputNumber disabled={value == 5} min={start} onChange={(value: number) => setEnd(value)} />

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

            {/* {!readonly && <RemoveItem key={MenuKeys.REMOVE_ITEM} toolProps={props} />} */}

        </Row>
    );

}

export default React.memo(ItemTopComponent);
