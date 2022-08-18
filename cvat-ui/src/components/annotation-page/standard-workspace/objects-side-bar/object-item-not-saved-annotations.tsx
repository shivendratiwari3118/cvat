import React, { useState } from 'react';
import axios from 'axios';
import { Button, Divider, Modal, Typography, Radio } from 'antd';
import {  useDispatch } from 'react-redux';
import { changeFrameAsync, saveAnnotationsAsync, updateAnnotationsAsync } from 'actions/annotation-actions';


interface Props {
    popOverHide: (a: boolean) => void;
    jobInstance: any;
    flag: boolean;
    changeAttribute(attrID: number, value: string): void;
    currentFrame: number;
}


const NotSavedAnnotationModal = (props: Props) => {
    console.log("NotSavedAnnotationModal", props)
    const dispatch = useDispatch();
    const { Title } = Typography;
    const [isModalVisible, setIsModalVisible] = useState(false);

    const showModal = async () => {
        setIsModalVisible(true);
        props.popOverHide(false);
    };

    const bulkUpdateAttributes = async () => {
         await  dispatch(saveAnnotationsAsync(props.jobInstance));
        // await dispatch(updateAnnotationsAsync(props.jobInstance))
        //window.location.reload();
        dispatch(changeFrameAsync(props.currentFrame))
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    return (
        <>
            {!props.flag &&            
            <Button type="text" onClick={showModal}>Bulk Update</Button>
            }           
            {isModalVisible &&
                <>
                    <Modal width={650} title="Please save the annoation" visible={isModalVisible} onOk={bulkUpdateAttributes} onCancel={handleCancel}>
                        <Title level={5} style={{ display: 'block', textAlign: 'center'}}> Do you want to save the Annotation?</Title>
                    </Modal>
                </>
            }
        </>

    )
};

export default NotSavedAnnotationModal;