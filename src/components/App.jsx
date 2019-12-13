import React from 'react';
import {hashHistory} from 'react-router';
import {Button, Icon, NavBar} from 'antd-mobile';
import {isLogin, removeToken} from "../utils/authority";
import Login from './Login' ;

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '绚丽之梦',
            open: false,
        };
    }

    logout = () => {
        removeToken();
        hashHistory.push("/login");
    }


    render() {
        return (
            <div className="container">
                <div>
                    {isLogin() ? (
                        <NavBar mode="light" icon={<Icon type="left"/>}
                                onLeftClick={() => hashHistory.goBack()}
                                rightContent={<Button size="small" inline onClick={this.logout}>登出</Button>}>
                            {this.state.title}
                        </NavBar>
                    ) : (
                        <NavBar mode="light">
                            {this.state.title}
                        </NavBar>
                    )
                    }
                </div>

                <div style={{position: 'relative', height: '100%'}}>
                    {isLogin() ? this.props.children : <Login/>}
                </div>

                {/*<div style={{textAlign:'center'}}>*/}
                    {/*<div style={{marginTop:20}}>*/}
                        {/*©2017-2019北京智慧境界科技发展有限公司*/}
                    {/*</div>*/}
                {/*</div>*/}
            </div>
        );
    }
}
