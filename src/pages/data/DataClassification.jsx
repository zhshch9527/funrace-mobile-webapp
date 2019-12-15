import React from 'react';
import {Grid,SegmentedControl} from 'antd-mobile';
import {formShape } from 'rc-form';
import F2 from '@antv/f2';
import BaseRender from "../../components/base/BaseRender";
import {isNotEmpty} from "../../utils/common";

const TypeObj = {
    0:{code:'band',title:'品牌'},
    1:{code:'category',title:'类别'},
    2:{code:'year',title:'年份'},
    3:{code:'season',title:'季节'}
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
    }
}

class DataClassification extends React.Component {
    static propTypes = {
        form: formShape,
    };

    state = {
        selectedSegmentIndex:0,
        data:[],
    }

    componentDidMount(){
        this.searchData() ;
    }

    searchData = (selectedSegmentIndex=0)=>{
        // let {date} = this.props ;
        // let code = TypeObjHelper.getCodeByIndex(selectedSegmentIndex)
        // //去后台查询
        // call({
        //     url:'',
        //     data:{code,date},
        // },{
        //     success:(data)=>{
        //
        //     }
        // })



        let title = TypeObjHelper.getTitleByIndex(selectedSegmentIndex)
        let data = [
            {name:title+1, count:10, money:230},
            {name:title+2, count:20, money:2430},
            {name:title+3, count:40, money:6730},
            {name:title+4, count:80, money:560},
            ] ;
        //做假数据
        this.setState({data}) ;
    }

    initRender=()=>{
        const initChart = ({data,title,key,id='myChart-'+key})=>{
            const drawChart=()=>{
                const chart = new F2.Chart({
                    id,
                    pixelRatio: window.devicePixelRatio
                });

                chart.source(data);
                chart.legend(false) ;
                chart.interval().position('name*count').color('name')
                chart.render() ;

            }

            let canvasWidth = data.length <= 10 ? document.body.clientWidth : data.length * 50 ;
            return (
                <BaseRender componentDidMount={drawChart} componentDidUpdate={drawChart} divProps={{style:{backgroundColor:'white'}}}>
                    <div style={{overflowX:'auto'}}>
                        <canvas id={id} style={{width:canvasWidth,height:300}} ></canvas>
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
            return initChart({key:type+'-money',data,title:'金额统计'})
        }

        const initSegmentedControlContent=()=>{
            let {data,selectedSegmentIndex} = this.state ;
            let title = TypeObjHelper.getTitleByIndex(selectedSegmentIndex)
            let code = TypeObjHelper.getCodeByIndex(selectedSegmentIndex)

            let headerGridData = [{value:title},{value:'数量'},{value:'金额'},] ;
            let gridData = data.flatMap(d=>{
                let {name,count,money} = d ;
                return [{value:name},{value:count},{value:money}] ;
            })


            let countChartOptions = {
                data:data.map(d=>({name:d.name,count:d.count})),
                type:code,
            }
            let moneyChartOptions = {
                data:data.map(d=>({name:d.name,count:d.money})),
                type:code,
            }

            let gridDivScrollProps = {} ;
            if(gridData.length > 18){
                gridDivScrollProps = {
                    height:300,
                    overflow:'auto',
                }
            }
            return (
                <div>
                    <div style={{marginTop:10}}>
                        <Grid data={headerGridData} itemStyle={{height:50,lineHeight:4}}
                              columnNum={3}
                              renderItem={(dataItem, itemIndex) => {
                                  return (
                                      <div style={{fontWeight:'bold'}}>{dataItem.value}</div>
                                  )
                              }}
                        />
                    </div>
                    <div style={{...gridDivScrollProps,marginTop:-1,}}>
                        <Grid data={gridData} itemStyle={{height:50,lineHeight:4}}
                              columnNum={3}
                              renderItem={(dataItem, itemIndex) => {
                                  return (
                                      <div >{dataItem.value}</div>
                                  )
                              }}
                        />
                    </div>
                    <div style={{marginTop:20}}>
                        {initCountChart(countChartOptions)}
                    </div>
                    <div style={{marginTop:20,marginBottom:20}}>
                        {initMoneyChart(moneyChartOptions)}
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
                    <SegmentedControl  style={{ height: 30,width:'70%' }} onChange={onSegmentedControlChange} selectedIndex={selectedSegmentIndex}
                                       values={TypeObjHelper.getTitles()}/>
                    {initSegmentedControlContent()}
                </div>
            </div>
        )
    }

    render() {
        let {data} = this.state ;
        return isNotEmpty(data) &&
            (
                <div style={{marginTop:10}}>
                    {this.initRender()}
                </div>
            )

    }
}

export default DataClassification;
