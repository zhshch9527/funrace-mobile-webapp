import React from 'react';
import {Grid,SegmentedControl} from 'antd-mobile';
import {formShape } from 'rc-form';
import F2 from '@antv/f2';
import BaseRender from "../../components/base/BaseRender";
import {isNotEmpty, number_format} from "../../utils/common";
import {call} from "../../utils/service";

const TypeObj = {
    0:{code:'day',title:'当日对比',url:'/api/leaderSale/findLastYearSalesStatic'},
    1:{code:'month',title:'当月对比',url:'/api/leaderSale/findLastYearSalesStatic'},
}

const TypeObjHelper = {
    getTitles:()=>{
        return Object.values(TypeObj).map(o=>o.title) ;
    },
    getCodeByIndex:(index)=>{
        return TypeObj[index].code ;
    },
    getTitleByIndex:(index)=>{
        return TypeObj[index].title ;
    },
    getUrlByIndex:(index)=>{
        return TypeObj[index].url ;
    }
}

class DataCompare extends React.Component {
    static propTypes = {
        form: formShape,
    };

    state = {
        selectedSegmentIndex:0,
        dataObj:{},
    }

    componentDidMount(){
        this.searchData() ;
    }

    searchData = ()=>{
        let {date,isSelectMonth} = this.props ;
        call({
            url:'/api/leaderSale/findLastYearSalesStatic',
            data:{'bizDate':date.format('yyyy-MM-dd'),isSelectMonth},
        },{
            success:(data)=>{
                let dataObj = {
                    count:data.count,
                    count2:data.count2,
                    amount:data.amount,
                    amount2:data.amount2} ;
                this.setState({dataObj}) ;
            }
        })


    }

    initRender=()=>{
        const initChart = ({data,title,key,id='myChart-'+key})=>{
            const drawChart=()=>{
                const chart = new F2.Chart({
                    id,
                    pixelRatio: window.devicePixelRatio
                });

                chart.source(data);
                chart.legend(false);
                chart.interval().position('name*count').color("name") ;
                chart.render();
            }

            let canvasWidth = data.length <= 10 ? document.body.clientWidth : data.length * 50 ;

            return (
                <BaseRender componentDidMount={drawChart} componentDidUpdate={drawChart}  divProps={{style:{backgroundColor:'white'}}}>
                    <div style={{overflowX:'auto'}}>
                        <canvas id={id} key={id} style={{width:canvasWidth,height:300}} ></canvas>
                    </div>
                    <div style={{textAlign:'center',fontWeight:'bold',padding:10}}>{title}</div>
                </BaseRender>
            )
        }

        const initCountChart = (options={})=>{
            let {data,type} = options ;
            return initChart({key:type+'-count',data,title:'数量统计'})
        }

        const initMoneyChart = (options={})=>{
            let {data,type} = options ;
            return initChart({key:type+'-amount',data,title:'金额统计'})
        }

        const initSegmentedControlContent=()=>{
            let {date,isSelectMonth} = this.props ;
            let date1=date.format(isSelectMonth ? 'yyyy-MM' : 'yyyy-MM-dd');
            let date2=(date1.substr(0,4)-1)+date1.substring(4);
            let {dataObj,selectedSegmentIndex} = this.state ;
            let code = TypeObjHelper.getCodeByIndex(selectedSegmentIndex)

            let gridData = [
                {number:dataObj.count,text:date1+'数量',color:'blue'},
                {number:number_format(dataObj.amount),text:date1+'金额',color:'red'},
                {number:dataObj.count2,text:date2+'数量',color:'blue'},
                {number:number_format(dataObj.amount2),text:date2+'金额',color:'red'},
                {number:'对比:'+(dataObj.count-dataObj.count2),text:'',color:'green'},
                {number:'对比:'+number_format(dataObj.amount-dataObj.amount2),text:'',color:'green'},]

            let countChartOptions = {
                data:[{name:date1+'数量',count:dataObj.count},{name:date2+'数量',count:dataObj.count2}],
                type:code,
            }
            let amountChartOptions = {
                data:[{name:date1+'金额',count:dataObj.amount},{name:date2+'金额',count:dataObj.amount2}],
                type:code,
            }

            return (
                <div>
                    <div style={{textAlign:'left',fontWeight:'bold',margin:5}}>{date1+'与'+date2+'同期对比'}</div>
                    <Grid data={gridData} itemStyle={{height:50,marginLeft:1,marginTop:1}}
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
                    <div style={{marginTop:20}}>
                        {initCountChart(countChartOptions)}
                    </div>
                    <div style={{marginTop:20,marginBottom:20}}>
                        {initMoneyChart(amountChartOptions)}
                    </div>
                </div>
            )
        }

        const onSegmentedControlChange=(e)=>{
            let {selectedSegmentIndex} = e.nativeEvent ;
            this.setState({selectedSegmentIndex}) ;
            this.searchData(selectedSegmentIndex) ;
        }

        let {selectedSegmentIndex} = this.state ;
        return (
            <div >
                <div>
                    {/*<SegmentedControl  style={{ height: 30,width:'70%' }} onChange={onSegmentedControlChange} selectedIndex={selectedSegmentIndex}*/}
                                       {/*values={TypeObjHelper.getTitles()}/>*/}
                    {initSegmentedControlContent()}
                </div>
            </div>
        )
    }

    render() {
        let {dataObj} = this.state ;
        return isNotEmpty(dataObj) &&
            (
                <div style={{marginTop:10}}>
                    {this.initRender()}
                </div>
            )
    }
}

export default DataCompare;
