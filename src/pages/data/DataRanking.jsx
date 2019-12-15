import React from 'react';
import {Grid,SegmentedControl} from 'antd-mobile';
import {formShape } from 'rc-form';
import F2 from '@antv/f2/lib/index-all';
import BaseRender from "../../components/base/BaseRender";
import {isNotEmpty, number_format} from "../../utils/common";
import {call} from "../../utils/service";

const TypeObj = {
    0:{code:'shop',title:'店仓',url:'/api/leaderSale/findSalesByShop'},
    1:{code:'employee',title:'店员',url:'/api/leaderSale/findSalesByEmployee'},
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

class DataRanking extends React.Component {
    static propTypes = {
        form: formShape,
    };

    state = {
        selectedSegmentIndex:0,
        data: [],
    }

    componentDidMount(){
        this.searchData() ;
    }

    searchData = (selectedSegmentIndex = 0)=>{
        let {date,isSelectMonth} = this.props ;
        let url=TypeObjHelper.getUrlByIndex(selectedSegmentIndex);
        //去后台查询
        call({
            url,
            data:{'bizDate':date.format('yyyy-MM-dd'), isSelectMonth},
        },{
            success:(data)=>{
                let dataList=[];
                if (data.length>0) {
                    data.map(items => {
                        dataList.push({
                            name:items.name,
                            count:items.salesCount,
                            money:items.salesAmount,
                        })
                    })
                }
                this.setState({data:dataList}) ;
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
                chart.tooltip(false);
                chart.interval().position('name*count').color("name") ;
                chart.render();

                // 绘制柱状图文本
                const offset = -5;
                const canvas = chart.get('canvas');
                const group = canvas.addGroup();
                const shapes = {};
                data.forEach(function(obj) {
                    const point = chart.getPosition(obj);
                    const text = group.addShape('text', {
                        attrs: {
                            x: point.x,
                            y: point.y + offset,
                            text: obj.count,
                            textAlign: 'center',
                            textBaseline: 'bottom',
                            fill: '#808080'
                        }
                    });

                    shapes[obj.name] = text; // 缓存该 shape, 便于后续查找
                });

                let lastTextShape; // 上一个被选中的 text
                // 配置柱状图点击交互
                chart.interaction('interval-select', {
                    selectAxisStyle: {
                        fill: '#000',
                        fontWeight: 'bold'
                    },
                    mode: 'range',
                    onEnd: function onEnd(ev) {
                        const data = ev.data,
                            selected = ev.selected;

                        lastTextShape && lastTextShape.attr({
                            fill: '#808080',
                            fontWeight: 'normal'
                        });
                        if (selected) {
                            const textShape = shapes[data.name];
                            textShape.attr({
                                fill: '#000',
                                fontWeight: 'bold'
                            });
                            lastTextShape = textShape;
                        }
                        canvas.draw();
                    }
                });
            }

            let canvasWidth = data.length <= 10 ? document.body.clientWidth : data.length * 50 ;
            return (
                <BaseRender componentDidMount={drawChart} componentDidUpdate={drawChart}  divProps={{style:{backgroundColor:'white',}}}>
                    <div style={{overflowX:'scroll'}}>
                        <canvas id={id} style={{width:canvasWidth,height:300}} ></canvas>
                        <div style={{width:canvasWidth}}>&nbsp;</div>
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
            let code = TypeObjHelper.getCodeByIndex(selectedSegmentIndex)
            let title = TypeObjHelper.getTitleByIndex(selectedSegmentIndex)

            let headerGridData = [{value:title},{value:'数量'},{value:'金额'},] ;
            let gridData = data.flatMap(d=>{
                let {name,count,money} = d ;
                return [{value:name},{value:count},{value:number_format(money)}] ;
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
            let {date,isSelectMonth} = this.props ;
            return (
                <div>
                    <div style={{textAlign:'left',fontWeight:'bold',margin:5}}>{date.format( isSelectMonth ? 'yyyy-MM' : 'yyyy-MM-dd')}</div>
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
                    <div style={{...gridDivScrollProps,marginTop:-1}}>
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

export default DataRanking;
