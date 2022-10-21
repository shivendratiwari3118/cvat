// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React,{useEffect} from 'react';
import Icon from '@ant-design/icons';
import { MergeIcon } from 'icons';
import { Canvas } from 'cvat-canvas-wrapper';
import { ActiveControl } from 'reducers/interfaces';
import CVATTooltip from 'components/common/cvat-tooltip';
import serverProxy from 'cvat-core/src/server-proxy';
import { useSelector, useDispatch } from 'react-redux'
import { saveAnnotationsAsync } from 'actions/annotation-actions';

export interface Props {
    canvasInstance: Canvas;
    activeControl: ActiveControl;
    switchMergeShortcut: string;
    disabled?: boolean;
    mergeObjects(enabled: boolean): void;
}

function MergeControl(props: Props): JSX.Element {
    const {
        switchMergeShortcut, activeControl, canvasInstance, mergeObjects, disabled,
    } = props;

    const dispatch = useDispatch()

    const data = useSelector((states:any) => states)
    // console.log("useSelector data", data)
    useEffect(() => {
        let abc:any = []
        localStorage.setItem("statesToBeMerged", JSON.stringify(abc))
        console.log("useEffect", localStorage.getItem('statesToBeMerged'))
    }, [])
    
    // const abc:any  = localStorage.getItem("statesToBeMerged")
    // console.log(abc, "abc", abc)

    const dynamicIconProps =
        activeControl === ActiveControl.MERGE ?
            {
                className: 'cvat-merge-control cvat-active-canvas-control',
                onClick: (async(): Promise<void> => {
                   
                    canvasInstance.merge({ enabled: false });
                    mergeObjects(false);
                    console.log("if")
                    // const payload:any = {
                    //     track_ids: abc
                    // }
                    // console.log("Payload", payload)
                   
                    //     console.log("abc.len if  part" )
                    //     const apiResponse = await serverProxy.jobs
                    //     .trackIdMerging(payload)
                    //     .then((result: any) => {
                    //         // dispatch(saveAnnotationsAsync(data?.annotation?.job?.instance))
                    //         // let delId:any = [];
                    //         // localStorage.setItem("statesToBeMerged", JSON.stringify(delId))
                    //         // console.log("success", result)
                    //         // dispatch
                    //         // window.location.reload();
                    //         return result;
                    //     })
                    //     .catch((error: any) => {
                    //         console.log("error", error)
                    //         return error;
                    //     }) 
                                
                })
                
            } :
            {
                className: 'cvat-merge-control',
                onClick: (): void => {
                    canvasInstance.cancel();
                    canvasInstance.merge({ enabled: true });
                    mergeObjects(true);
                    console.log("else")
                },
            };

    return disabled ? (
        <Icon className='cvat-merge-control cvat-disabled-canvas-control' component={MergeIcon} />
    ) : (
        <CVATTooltip title={`Merge shapes/tracks ${switchMergeShortcut}`} placement='right'>
            <Icon {...dynamicIconProps} component={MergeIcon} />
        </CVATTooltip>
    );
}

export default React.memo(MergeControl);
