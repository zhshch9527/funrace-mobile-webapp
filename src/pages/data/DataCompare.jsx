import React from 'react';
import {Grid,SegmentedControl} from 'antd-mobile';
import {formShape } from 'rc-form';
import F2 from '@antv/f2/lib/index-all';
import BaseRender from "../../components/base/BaseRender";
import {isNotEmpty} from "../../utils/common";

const TypeObj = {
    0:{code:'day',title:'当日对比'},
    1:{code:'month',title:'当月对比'},
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

    searchData = (selectedSegmentIndex=0)=>{
        let title = TypeObjHelper.getTitleByIndex(selectedSegmentIndex)
        let code = TypeObjHelper.getCodeByIndex(selectedSegmentIndex)
        //日期
        // let {date} = this.props ;
        // call({
        //  url:'',
        //  data:{code,date},
        // },{
        //     success:(data)=>{
        //
        //     }
        // })
        let dataObj = {count:94,count2:35,money:66800.00,money2:5588.00} ;
        this.setState({dataObj}) ;
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

            return (
                <BaseRender componentDidMount={drawChart} componentDidUpdate={drawChart}>
                    <canvas id={id} width={document.body.clientWidth} height="260"></canvas>
                    <div style={{textAlign:'center',fontWeight:'bold'}}>{title}</div>
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
            let {dataObj,selectedSegmentIndex} = this.state ;
            let code = TypeObjHelper.getCodeByIndex(selectedSegmentIndex)

            let gridData = [{number:dataObj.count,text:'数量',color:'blue'},{number:dataObj.count2,text:'去年同期数量',color:'red'},
                {number:dataObj.money,text:'金额',color:'blue'},{number:dataObj.money2,text:'去年同期金额',color:'red'},]

            let countChartOptions = {
                data:[{name:'数量',count:dataObj.count},{name:'去年同期数量',count:dataObj.count2}],
                type:code,
            }
            let moneyChartOptions = {
                data:[{name:'数量',count:dataObj.money},{name:'去年同期数量',count:dataObj.money2}],
                type:code,
            }
            let {date} = this.props ;
            return (
                <div>
                    <div style={{textAlign:'center',fontWeight:'bold',margin:5}}>{date.format(selectedSegmentIndex === 0 ? 'yyyy-MM-dd' : 'yyyy-MM')}</div>
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
