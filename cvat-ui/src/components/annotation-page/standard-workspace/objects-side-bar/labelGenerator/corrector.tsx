import React, { useEffect, useState, useRef } from 'react'
import { Modal, Col, Row, Divider, Input, Popover, Button } from 'antd';
import { Spin } from 'antd';
import { DotChartOutlined } from "@ant-design/icons";
import { Image } from 'antd';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {  Typography, Radio } from 'antd';
import {  useDispatch } from 'react-redux';
import { saveAnnotationsAsync, zoomCanvas } from 'actions/annotation-actions';
import { useSelector } from "react-redux";
import serverProxy from "cvat-core/src/server-proxy";
import './context_menu.css';
import NotSavedAnnotationModal from '../object-item-not-saved-annotations';
import CorrectorCanvas from './corrector_canvas';
import { DraggableEvent, DraggableData } from 'react-draggable';


const style: React.CSSProperties = { padding: '8px 0', height: '200px', width: '200px' };
const menu_div_style: React.CSSProperties = { display: 'inline-grid' };

interface Props {
    AnnotationId: number |  undefined
    attributes: any[];
    jobInstance:any;
    serverID: number | undefined;
    popOverHide: (a: boolean) => void;

}


const { Title } = Typography;


const Corrector = (props:Props) => {
    //const [visible, setVisible] = useState(false);
    const [visibleImage, setVisibleImage] = useState(false)
    const {attributes, AnnotationId, jobInstance, serverID} = props
    const dispatch = useDispatch();
    const [cssclass, setCssclass] = useState("");
    const [assignSRdata, setAssignSRdata] = useState([]);
    const currentJob = useSelector((state) => state);
    const [croppedimages, setCropedImages] = useState([])
    const [rightClick, setRightClick] = useState(false)
    const [visible, setVisible] = useState(false);
    const [frameId, setFrameId] = useState<any>([])
    const [flag, setFlag] = useState(false)
    const [id, setId] = useState()
    const [jobId, setJobId] = useState(0);
    const [flagValue, setFlagValue] = useState(false)
    const [loading, setLoading] = useState(true)


    // const canvasRef = useRef()

    const abc = localStorage.getItem("serverId")
        console.log("localStorage abc", abc)

    React.useEffect(() => {
      let path = window.location.pathname;
      let pathArr = path.split("/");
      setJobId(Number(pathArr[pathArr.length - 1]));
    }, []);

    const hide = () => {
      setVisible(false);
    };
  
    const handleVisibleChange = (newVisible: boolean) => {
      setVisible(newVisible);
    };

    const callSave = (e:any) => {
        e.preventDefault();
        console.log(serverID, "dot ", AnnotationId)
        if(serverID == undefined){
            setFlagValue(true)
        }
        else{
        setVisible(true);
        // need to see
        // 64 is job id, 12 is task_id is annotation id 
        serverProxy.jobs.labelCorrectorImages(jobId, serverID).then((res) => {
            console.log("response", res)
            setLoading(false)
            setCropedImages(res);
        });
        getAssignSRdata();
    }

    };

    // document.addEventListener('keydown', (event) => {
    //     if (event.key == 'w') {
    //         callSave();
    //     }
    // })
    
    const handleRightClick = (event: { preventDefault: () => void; type: string; }, id) => {
        event.preventDefault();         
        if(event.type == 'contextmenu'){
           //setFrameId([...frameId, id])
           setId(id)
           console.log("contextmenu")
            setRightClick(true);
            //setFlag(false)
        }
        else {
            setRightClick(false)
        }    
    }

    const handleRightClickPop = () =>{
        dispatch(zoomCanvas(true));
        setRightClick(false)
    }  

    const getAssignSRdata = () => {
        const { annotation: {
            job: {
                requestedId, ...ononrest
            }, ...onrest
        }, ...rest } = currentJob;

        serverProxy.jobs.getCorrectorData(requestedId).then((res) => {
            console.log(res)
            console.log("res")
            setAssignSRdata(res);
        });
    }

    // useEffect(() => {
    //     getAssignSRdata();
    // }, [])
    const srLabelPostApi = async (payload) => {
        return serverProxy.jobs
        .saveLabelCorrectorAttributeData(payload)
          .then((result: any) => {
            return result;
          })
          .catch((error: any) => {
            return error;
          })
      }

      const srInvisiblePostAPI = async (payload) => {
        return serverProxy.jobs
        .saveSrInvisibleLabelCorrectorAttributeData(payload)
          .then((result: any) => {
            return result;
          })
          .catch((error: any) => {
            return error;
          })
      }
      //saveSrInvisibleLabelCorrectorAttributeData
    
    const handleButtonClick = async(value:any, id:any) => {
        const attributesFilterData = attributes.filter((item:any) => assignSRdata.includes(item.name))
        const finalFilterData = attributesFilterData.filter(item => item.name == value)
        if(value == 'SR_PARTLY'){       
            setFlag(true)   
            setFrameId([...frameId, id])  
            setRightClick(false) 
            try {   
                const payload = {
                    track_id: AnnotationId,
                    AnnotationId: AnnotationId,
                    frame:id,
                    attribute_name: finalFilterData[0].name,
                    attribute_val :'true',
                    attribute_id : finalFilterData[0].id,
                    attributre_previous_value: finalFilterData[0].values[0].toLocaleLowerCase()
                }           
          
                const apiResponse = await srLabelPostApi(payload);
              } catch (err) {
                console.log(err);
              }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
        }
        else if(value == 'SR_INVISIBLE'){
            setRightClick(false) 
            try {   
                const payload = {
                    track_id: AnnotationId,
                    AnnotationId: AnnotationId,
                    frame:id,
                    attribute_name: finalFilterData[0].name,
                    attribute_val :'Invisible_Start',
                    attribute_id : finalFilterData[0].id,
                    attributre_previous_value: finalFilterData[0].values
                }           
          
                const apiResponse = await srInvisiblePostAPI(payload);
              } catch (err) {
                console.log(err);
            }  
        }
    }
    const AssignNode = ({data,frame}) => {
        return data.map((item: any) => {
            return (               
                <div>
                    <Button onClick={() =>handleButtonClick(item, frame)} style={{marginBottom:'10px'}} type='text' id={frame}>{item}</Button>
                </div>
                
            )
        })
    }

    const [imageId, setImageId] = useState()

    const handleImageClick = (id) =>{
        // const attributesFilterData = attributes.filter((item:any) => assignSRdata.includes(item.name))
        // const finalFilterData = attributesFilterData.filter(item => item.name == id)
        // console.log(attributes,"handleImageClick",attributesFilterData, finalFilterData)
        // if()
        setVisibleImage(true)
    }

    const CropedImagesNode = (data: any) => {   
        return data.data.map((item:any) => {
            console.log("item", item)
            return (
                <Col  span={6} key={item.frame} >
                   
                    <Popover
                        content={<AssignNode data={assignSRdata} frame={item.frame}/>}
                        placement="rightTop"
                        title=""                       
                        trigger="click"
                        visible={rightClick && id == item.frame}
                        >
                            <div                                
                               
                                // style={{marginLeft:"10px"}}
                                onClick={handleRightClickPop}
                                onContextMenu={(event) =>handleRightClick(event, item.frame)}
                            >
                                <TransformWrapper panning={{disabled:true}}>
                                <TransformComponent >
                                
                                {/* <img
                                    width="200"
                                    // height="200px"
                                    src={item.img_base64}                                       
                                >                                   
                                </img> */}
                               {/* <div style={{marginTop: "-152px"}}> */}
                                    <CorrectorCanvas classStyle={flag && frameId.includes(item.frame) ? 'container_menu' : '' } image={item.img_base64} resolution={item.resolution} coordinates={item.new_coordinates}/>
                               {/* </div>  */}
                                </TransformComponent>
                                </TransformWrapper>                                
                            </div>
                            <span>Frame No. {item.frame}</span>                            
                    </Popover>                   
                </Col>
            )
        })

    }
  
   

    const bulkUpdateAttributes = async () => {
        await  dispatch(saveAnnotationsAsync(jobInstance));
       window.location.reload();
       setFlagValue(false);
    };

    const handleCancel = () => {
        setFlagValue(false);
    };

    const popOverHide = (a: boolean) =>{
        setFlagValue(a)
    }
    const handleOk = () => {
        setVisible(false)
        window.location.reload();
    }

    return (
        <>
            <DotChartOutlined style={{marginTop: '10px'}} onClick={callSave} />
           
            <Modal
                title="Label Corrector"
                centered
                visible={visible}
                onOk={handleOk}
                onCancel={() => setVisible(false)}
                width={1000}
            >
                {loading ? <Spin size="large" /> :
                <>
                <Row gutter={[16, 24]}>

                    <Col className="gutter-row" span={6}>
                        <div style={menu_div_style}>
                            Frame No <Input size="small" />
                        </div>
                    </Col>
                    <Col className="gutter-row" span={6}>
                        <div style={menu_div_style}>
                            Step Filter <Input size="small" />
                        </div>
                    </Col>
                </Row>
                <Divider orientation="left">Corrector</Divider>
               
                <Row  style={{display:'flex', marginLeft:'8px'}}>
                    <CropedImagesNode data={croppedimages} />
                </Row>
                </>
                }
            </Modal>
          
            {/* } */}
        </>
    )
}

export default Corrector;