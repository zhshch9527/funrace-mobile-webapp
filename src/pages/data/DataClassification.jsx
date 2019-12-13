import React from 'react';
import {Grid,SegmentedControl,WhiteSpace} from 'antd-mobile';
import {formShape } from 'rc-form';
import F2 from '@antv/f2/lib/index-all';
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
                console.info(id)
                console.info(data)
                console.info(title)
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
                <BaseRender componentDidMount={drawChart} componentDidUpdate={drawChart} divProps={{style:{backgroundColor:'white'}}}>
                    <canvas id={id} width={document.body.clientWidth} height="260"></canvas>
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

            let gridData = [{value:title},{value:'数量'},{value:'金额'},] ;
            let values = data.flatMap(d=>{
                let {name,count,money} = d ;
                return [{value:name},{value:count},{value:money}] ;
            })
            gridData = [...gridData,...values] ;


            let countChartOptions = {
                data:data.map(d=>({name:d.name,count:d.count})),
                type:code,
            }
            let moneyChartOptions = {
                data:data.map(d=>({name:d.name,count:d.money})),
                type:code,
            }
            return (
                <div>
                    <div style={{marginTop:10}}>
                        <Grid data={gridData} itemStyle={{height:50}}
                              columnNum={3}
                              renderItem={(dataItem, itemIndex) => {
                                  if(itemIndex === 0 || itemIndex === 1 || itemIndex === 2){
                                      return (
                                          <div style={{fontWeight:'bold',padding:10}}>{dataItem.value}</div>
                                      )
                                  }else{
                                      return (
                                          <div style={{padding:10}}>{dataItem.value}</div>
                                      )
                                  }
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
