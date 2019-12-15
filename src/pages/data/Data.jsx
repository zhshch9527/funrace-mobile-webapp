import React from 'react';
import {List,Button,Toast,DatePicker,Grid,SegmentedControl,WhiteSpace,Menu,ActivityIndicator,NavBar} from 'antd-mobile';
import { createForm, formShape } from 'rc-form';
import DataRanking from './DataRanking' ;
import DataClassification from './DataClassification' ;
import DataCompare from './DataCompare' ;
import {call} from "../../utils/service";
import {getUuid, number_format} from "../../utils/common";
const {Item} = List ;


class Data extends React.Component {
    static propTypes = {
        form: formShape,
    };

    state = {
        date: new Date(),
        isSelectMonth:true,
        selectedSegmentIndex:0,
        totalData:[],
        id1:getUuid(),
        id2:getUuid(),
        id3:getUuid(),
    }
    componentDidMount(){
        let {date,isSelectMonth=false} = this.state ;
        this.searchTotalData({date,isSelectMonth}) ;
    }

    gridDayOrMonthClick=(isSelectMonth)=>{
        this.setState({isSelectMonth,id1:getUuid(),id2:getUuid(),id3:getUuid()})
        let {date} = this.state ;
        this.searchTotalData({date,isSelectMonth}) ;
    }

    searchTotalData=({date})=>{
        //查询总的信息
        call({
            url:'/api/leaderSale/findSalesStatic',
            data:{'bizDate':date.format('yyyy-MM-dd')},
        },{
            success:(data)=>{
                const totalData = [
                    {number:data.dayCount,text:'当日数量',color:'blue'},
                    {number:number_format(data.dayAmount),text:'当日金额',color:'red',divProps:{
                            onClick:()=>{
                                this.gridDayOrMonthClick(false) ;
                            }
                        }},
                    {number:data.monthCount,text:'当月数量',color:'blue'},
                    {number:number_format(data.monthAmount),text:'当月金额',color:'red',divProps:{
                            onClick:()=>{
                                this.gridDayOrMonthClick(true) ;
                            }
                        }}]

                this.setState({totalData}) ;
            }
        })

    }

    dateOnchange = (date)=>{
        this.setState({date}) ;
        let {isSelectMonth=false} = this.state;
        this.searchTotalData({date,isSelectMonth}) ;
    }

    //分类
    initClassification=()=>{
        let {date,isSelectMonth,id1} = this.state ;
        return (
            <div>
                <DataClassification date={date} isSelectMonth={isSelectMonth}  key={id1}/>
            </div>
        )
    }

    initRanking=()=>{
        let {date,isSelectMonth,id2} = this.state ;
        return (
            <DataRanking date={date} isSelectMonth={isSelectMonth} key={id2}/>
        )
    }

    //对比
    initCompare=()=>{
        let {date,isSelectMonth,id3} = this.state ;
        return (
            <div>
               <DataCompare date={date} isSelectMonth={isSelectMonth} key={id3} />
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
                      renderItem={dataItem => {
                          let {divProps={}} = dataItem ;
                          return (
                              <div>
                                  <div style={{ backgroundColor:'#FFCC66' ,fontSize: 14 , fontWeight:'bold',padding:10}} {...divProps}>
                                      <div style={{color:dataItem.color}}>{dataItem.number}</div>
                                      <div>{dataItem.text}</div>
                                  </div>
                              </div>
                          )
                      }}
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
