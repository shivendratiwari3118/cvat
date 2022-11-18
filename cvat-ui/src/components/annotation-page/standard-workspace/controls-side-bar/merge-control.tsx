// Copyright (C) 2020-2021 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React,{useEffect} from 'react';
import Icon from '@ant-design/icons';
import { MergeIcon } from 'icons';
import { Canvas } from 'cvat-canvas-wrapper';
import { ActiveControl } from 'reducers/interfaces';
import CVATTooltip from 'components/common/cvat-tooltip';
import { useSelector, useDispatch } from 'react-redux'
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
    useEffect(() => {
        let abc:any = []
        localStorage.setItem("statesToBeMerged", JSON.stringify(abc))
    }, [])    
    
    const dynamicIconProps =
        activeControl === ActiveControl.MERGE ?
            {
                className: 'cvat-merge-control cvat-active-canvas-control',
                onClick: (async(): Promise<void> => {
                   
                    canvasInstance.merge({ enabled: false });
                    mergeObjects(false);
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
