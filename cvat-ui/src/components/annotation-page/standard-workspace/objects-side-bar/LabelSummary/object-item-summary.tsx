import React, { useEffect, useState } from 'react';
import { Table, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Select } from 'antd';
import { Col, Row,Space } from 'antd';
import { Input} from 'antd';
import { LeftCircleFilled, RightCircleFilled } from '@ant-design/icons';
import { Typography } from 'antd';
import serverProxy from 'cvat-core/src/server-proxy';
import { changeFrameAsync } from 'actions/annotation-actions';
import { useDispatch } from 'react-redux';

import './object-label-summary.css';

interface DataType {
        key: string;
        track: string;
        Category: string;
        frameCount: string;
        validationStatus: string;
        SignClass: string
    };

const { Title } = Typography;
const { Option } = Select;
const { Search } = Input;

const ObjectLabelSummary = () => {
    const [data, setData] = useState([])  
      const [selectedRowData, setSelectedRowData] = useState<any>()
      const [search, setSearch] = useState(false)
      const [searchData, setSearchData] = useState([])
      const [searchValue, setSearchValue] = useState("")
      const [dropDownValue, setDropDownValue] = useState('trackId')
      const [selectedRow, setSelectedRow] = useState<any>([])
      const dispatch = useDispatch();


    const handleChange = (value: string) => {
        setDropDownValue(value)
      };

    const handleSearchChange = (event:any) => {
        setSearchValue(event.target.value)
    }
    
    const onSearch = (value: string) =>{
        if(searchValue == ''){
            setSearch(false)
        }
        else {
            setSearch(true)
            if(dropDownValue == 'trackId'){
                const filterSearchData = data?.filter((item:any) => item.track_id == value);
                setSearchData(filterSearchData)
            }
            else if(dropDownValue == 'category'){
                const filterSearchData = data?.filter((item:any) => item);
                setSearchData(filterSearchData)
            }
            else if(dropDownValue == 'signClass'){
                const filterSearchData = data?.filter((item:any) => item.sign_class == value);
                setSearchData(filterSearchData)
            }
            
        }
    } 

    const handleLeftArrowClick = (frame:any) => {        
        dispatch(changeFrameAsync(frame.start_frame));
    }
    const handleRightArrowClick = (frame:any) => {
        dispatch(changeFrameAsync(frame?.end_frame));
    }

    const columns: ColumnsType<DataType> = [   
        {
          title: 'Track Id',
          width:15,
          dataIndex: 'item_id',
          render: text => {
          return(<a>{text}</a>)
        }
        },
        {
          title: 'Category',
          width:20,
          className: 'column-money',
          dataIndex: 'label',
        },
        {
          title: 'Frame Count',
          dataIndex: 'count',
          width: 30
        },
        {
          title: 'Navigation',
          dataIndex: 'start_frame',
          width:20,
          render: () => 
            <a>
                <Tooltip title={selectedRowData?.start_frame} ><LeftCircleFilled style={{marginRight: '10px'}} onClick={() => handleLeftArrowClick(selectedRowData)} /></Tooltip> 
                <Tooltip title={selectedRowData?.end_frame} ><RightCircleFilled onClick={() => handleRightArrowClick(selectedRowData)} /></Tooltip>
            </a>,
           
        },
        {
          title: 'Sign Class',
          dataIndex: 'action',
          width:60,
          render: (_, record:any) => {
            return(
            <>
              <img src={record?.sign_class_img} width='40px' alt='sign class image' />
              <strong style={{marginLeft:'5px'}}>{record.sign_class}</strong>
            </>
          )}
        //   render: (img:any) => 
        },
      ];

    useEffect(() => {
        let path = window.location.pathname;
        let pathArr = path.split("/");
        serverProxy.jobs.getTrackedFrameSummary(Number(pathArr[pathArr.length - 1])).then((res) => {
            setData(res);
        });

    },[])
    
    let sum = 0;
    data.forEach(num => {
        sum += num.count;
    });
    console.log("data", data)
   
    return (
        <>
            <Row>
                <Col span={24}>
                <Title level={5}>Total Frame Count : {sum && sum}</Title>
                </Col>
            </Row>
            <Row>
                <Col span={10}>
                    <Select defaultValue="trackId" style={{ width: 120 }} onChange={handleChange}>
                        <Option value="trackId">Track Id</Option>
                        <Option value="category">Object Category</Option>           
                        <Option value="signClass">Sign Class</Option>
                    </Select>
                </Col>
                <Col span={4} />
                <Col span={10}>
                <Search placeholder="search" onChange={handleSearchChange} onSearch={onSearch} enterButton />
                </Col>                
            </Row>
           
            <Table
                rowClassName={(record:any) => record?.track_id == selectedRow?.track_id ? "selected-row-item" : ""}
                columns={columns}
                dataSource={search ? searchData : data}
                bordered
                pagination={false}
                scroll={{ x: 600, y: 300 }}
                onRow={(record:any) => {
                    return {
                      onClick: (event:any) => {
                        setSelectedRow(record)
                      }, 
                      onMouseEnter: (event:any) => {
                        setSelectedRowData(record)
                        },
                    };
                  }}               
            />
    </>

    )
}

export default ObjectLabelSummary;