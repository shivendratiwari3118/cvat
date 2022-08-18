import React, { useState } from 'react';
import axios from 'axios';
import { Button, Divider, Modal, Typography, Radio } from 'antd';
import {connect, useDispatch, useSelector } from 'react-redux';
import InputNumber from 'antd/lib/input-number';
import { Checkbox } from 'antd';
import { Col, Row } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import type { RadioChangeEvent } from 'antd';
import { fetchAnnotationsAsync, saveAnnotationsAsync } from 'actions/annotation-actions';
import { CombinedState } from 'reducers/interfaces';
import {
  activateObject as activateObjectAction,
  changeFrameAsync,
  updateAnnotationsAsync,
} from 'actions/annotation-actions';
import { ThunkDispatch } from 'utils/redux';
import serverProxy from 'cvat-core/src/server-proxy';
import { getOrganizationsAsync } from 'actions/organization-actions';
import { RouteComponentProps } from 'react-router';

interface Props {
  attrID: number;
  attrName: string;
  trackId: number;
  popOverHide: (a: boolean) => void;
  jobInstance: any;
  AnnotationId: number | undefined
  attrValue: any;
  getAnnotationsApi:(a:any, b:any) => void
  setReloadRequire(a:boolean):void;
  currentFrame: number;
  changeAttribute(attrID: number, value: string): void;
}
interface payLoadProps {
  start_frame: any;
  end_frame: any;
  job_id: any;
  AnnotationId: number| undefined;
  attribute_id: number,
 // old_annotation_id: number| undefined
  attribute_name: string;
  attribute_val: any;
  attribute_previous_val:any
}

const AttributeBulkUpdate = (props: Props & RouteComponentProps) => {

  const dispatch = useDispatch();
  const {attrID,currentFrame,changeAttribute, AnnotationId, attrValue, attrName, trackId, jobInstance,setReloadRequire, getAnnotationsApi, history:push } = props;
  const { Title } = Typography;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [value, setValue] = useState(1);
  const [chkValue, setChkValue] = useState(false);
  const [start, setStart] = useState<any>(null);
  const [end, setEnd] = useState<any>(null);
  const [jobId, setJobId] = useState(0);
  const [err,setErr] = useState(false);
  const [flag, setFlag] = useState(false)

  React.useEffect(() => {
    let path = window.location.pathname;
    let pathArr = path.split("/");
    setJobId(Number(pathArr[pathArr.length - 1]));
  }, []);

  const onRadioChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
    if(e.target.value === 4){
      setStart(null);
      setEnd(null);
    }
  };

  React.useEffect(() => {
    //Don't know how to find the currentFrame number , so default it to 1
    
    if (value == 1) {
      setStart(currentFrame);
      setEnd(jobInstance.stopFrame);
    } else if (value == 2) {
      setStart(1);
      setEnd(currentFrame);
    } else if (value == 3) {
      setStart(jobInstance.startFrame);
      setEnd(jobInstance.stopFrame);
    }
  }, [value]);

  const onChange = (e: CheckboxChangeEvent) => {
    setChkValue(e.target.checked);
  };

  const showModal = async () => {   
    setIsModalVisible(true);
    props.popOverHide(false);
  };
 
 

  const payLoadPostAPI = async (payload: payLoadProps) => {
    return serverProxy.jobs
    .saveBulkupdate(payload)
      .then((result: any) => {
        return result;
      })
      .catch((error: any) => {
        return error;
      })
  }

  const bulkUpdateAttributes = async () => {
    if(start !== null && end !== null){
      try {
        await dispatch(saveAnnotationsAsync(jobInstance))
        const payLoad: payLoadProps = {
          start_frame: start,
          end_frame: Number(end) + 1,
          job_id: jobId,
          AnnotationId,
          attribute_id: attrID,
          attribute_name: attrName,
          attribute_previous_val: attrValue.toString().toLocaleLowerCase(),
          attribute_val: chkValue.toString().toLocaleLowerCase()
        };
  
        const apiResponse = await payLoadPostAPI(payLoad);
        console.log('getOrganizations succccccc',apiResponse);
        if(apiResponse.message ==true){
          setFlag(true)
          // isSuccessFun()
          setReloadRequire(true)
          let i = 1;
          console.log('bulk succccccc', currentFrame, i++);
          console.log('bulk currentFrame', currentFrame > end);
          // if(currentFrame !> end ){
          //  window.location.reload();
          changeAttribute(attrID, 'true');
          // dispatch(saveAnnotationsAsync(jobInstance));
          // dispatch(changeFrameAsync(currentFrame));
          console.log('bulk succccccc');
          // }
         // dispatch(getOrganizationsAsync());
          //  window.location.reload();
          // const taskId = 125
        //  const session = 'job'
         
        //  push(`/tasks/${taskId}/jobs/${jobId}`);
        //  getAnnotationsApi(session,jobId)
          // serverProxy.annotations
          // .getAnnotations(session,jobId)
          //   .then((result: any) => {
          //     console.log('getOrganizations succccccc',result);
          //     return result;
          //   })
          //   .catch((error: any) => {
          //     return error;
          //   })
        
        }

        setIsModalVisible(false);
      } catch (err) {
        console.log(err);
      }
    }else{
      setErr(true);
      setTimeout(()=>{
        setErr(false);
      },3000);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Button type="text" onClick={showModal}>Bulk Update</Button>
      {isModalVisible &&
        <>
          <Modal width={700} title="Bulk Update Object Labels" visible={isModalVisible} onOk={bulkUpdateAttributes} onCancel={handleCancel}>
            <Title level={5} style={{ display: 'block', textAlign: 'center' }}> Track Id: {trackId}</Title>
            <Divider />
            <Radio.Group onChange={onRadioChange} value={value} style={{ borderLeft: '1px solid grey', borderTop: '1px solid grey', padding: '10px' }}>
              
              <Row>
                <Col span={24}> <Radio value={1}><Title level={5}>Current Frame to End Frame</Title></Radio></Col>
              </Row>
              <Row>
                <Col span={24}> <Radio value={2}> <Title level={5}>Start Frame to Current Frame</Title></Radio></Col>
              </Row>
              <Row>
                <Col span={24}> <Radio value={3}><Title level={5}>Start Frame to End Frame</Title></Radio></Col>
              </Row>
              <Row>
                <Col span={24}> 
                  <Row>
                    <Col span={1}><Radio value={4} /></Col>
                    <Col span={8}> <Title style={{marginLeft:'5px'}} level={5}>Enter Start Frame</Title></Col>
                    <Col span={3}><InputNumber disabled={value !==4}  min={1} onChange={(value:number) => setStart(value)} /></Col>
                    <Col span={8}><Title style={{marginLeft:'39px'}}  level={5}>to End Frame</Title></Col>
                    <Col span={3}><InputNumber disabled={value !==4}   min={start} onChange={(value: number) => setEnd(value)} /></Col>
                  </Row>
                </Col>  
              </Row>
            </Radio.Group>
            {err ? <Title level={5} style={{color:'red'}}>Please select start & end frame,before proceeding!</Title> : ''}
            <Divider />
            <div style={{ display: 'flex', marginTop: '20px', alignItems: 'flex-start' }}>
              <table style={{ border: '1px solid grey' }}>
                <tr style={{ border: '1px solid grey' }}>
                  <th style={{ border: '1px solid grey', padding: '10px' }}><Title level={5}>Attributes</Title></th>
                  <th style={{ border: '1px solid grey', padding: '10px' }}><Title level={5}>Value</Title></th>
                </tr>
                <tr style={{ border: '1px solid grey' }}>
                  <td style={{ border: '1px solid grey', padding: '10px' }}><Title style={{ marginRight: '20px' }} level={5} >{attrName}</Title></td>
                  <td style={{ border: '1px solid grey', padding: '10px' }}> <Checkbox onChange={onChange} /></td>
                </tr>
              </table>              
            </div>

          </Modal>
        </>
      }
    </>
  )
};
export default AttributeBulkUpdate;