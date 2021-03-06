import React from 'react';
import {List,Button,Toast,DatePicker,Grid,SegmentedControl,WhiteSpace,Menu,ActivityIndicator,NavBar} from 'antd-mobile';
import { createForm, formShape } from 'rc-form';
import {isEmpty, isNotEmpty} from "../../utils/common";
import F2 from '@antv/f2/lib/index-all';
import BaseRender from "../../components/base/BaseRender";
import DataRanking from './DataRanking' ;
import DataClassification from './DataClassification' ;
import DataCompare from './DataCompare' ;
import {call} from "../../utils/service";
const {Item} = List ;


class Data extends React.Component {
    static propTypes = {
        form: formShape,
    };

    state = {
        date: new Date(),
        selectedSegmentIndex:0,
        totalData:[],
    }
    componentDidMount(){
        this.searchTotalData(this.state.date) ;
    }

    searchTotalData=(date)=>{
        //查询总的信息
        // call({
        //     url:'',
        //     data:{},
        // },{
        //     success:(data)=>{
        //
        //     }
        // })
        const totalData = [{number:192,text:'当日数量',color:'blue'},{number:129007.00,text:'当日金额',color:'red'},
            {number:3152,text:'当月数量',color:'blue'},{number:2210302.00,text:'当月金额',color:'red'}]

        this.setState({totalData}) ;
    }

    dateOnchange = (date)=>{
        this.setState({date}) ;
        this.searchTotalData(date) ;
    }

    //分类
    initClassification=()=>{
        let {date} = this.state ;
        return (
            <div>
                <DataClassification date={date}/>
            </div>
        )
    }

    initRanking=()=>{
        let {date} = this.state ;
        return (
            <DataRanking date={date}/>
        )
    }

    //对比
    initCompare=()=>{
        let {date} = this.state ;
        return (
            <div>
               <DataCompare date={date}/>
            </div>
        )
    }

    initSegmentedControlContent=()=>{
        let {selectedSegmentIndex} = this.state ;
        let relationObj = {
            0:this.initClassification,
            1:this.initRanking,
            2:this.initCompare
        }
        return relationObj[selectedSegmentIndex]() ;
    }

    onSegmentedControlChange=(e)=>{
        let {selectedSegmentIndex} = e.nativeEvent ;
        this.setState({selectedSegmentIndex}) ;
    }

    render() {
        let {date,totalData,selectedSegmentIndex} = this.state ;
        return (
            <div>
                <List>
                    <DatePicker
                        mode="date"
                        value={date}
                        maxDate={new Date()}
                        onChange={this.dateOnchange}
                    >
                        <Item arrow="horizontal" >日期</Item>
                    </DatePicker>
                </List>

                <Grid data={totalData} itemStyle={{height:50,marginLeft:1,marginTop:1}}
                      columnNum={2}
                      renderItem={dataItem => (
                          <div>
                              <div style={{ backgroundColor:'#FFCC66' ,fontSize: 14 , fontWeight:'bold',padding:10}}>
                                  <div style={{color:dataItem.color}}>{dataItem.number}</div>
                                  <div>{dataItem.text}</div>
                              </div>
                          </div>
                      )}
                />

                <WhiteSpace/>
                <SegmentedControl  style={{ height: 40 }} onChange={this.onSegmentedControlChange} selectedIndex={selectedSegmentIndex}
                    values={['分类', '排名', '去年同期']}
                />
                {this.initSegmentedControlContent()}
            </div>


        );
    }
}

export default Data;
