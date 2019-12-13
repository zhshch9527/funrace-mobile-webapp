import React from 'react';
import { hashHistory } from 'react-router';
import { InputItem ,List,Button,Toast,Switch ,WhiteSpace} from 'antd-mobile';
import { createForm, formShape } from 'rc-form';
import favicon from '../../public/favicon.png' ;
import {call} from "../utils/service";
import {isRemeberPassword, setToken} from "../utils/authority";
const {Item} = List ;

class Form extends React.Component {
    static propTypes = {
        form: formShape,
    };

    onSubmit = () => {
        this.props.form.validateFields({ force: true }, (error,value) => {
            if (!error) {
                call({
                    url:"/webapp/login",
                    data:value,
                    method:'POST',
                },{
                    success:(data = {})=>{
                        let {token} = data ;
                        if(!token){
                            Toast.fail("获取token失败")
                        }else{
                            setToken(token,value.remeberPassword) ;
                            hashHistory.push("/")
                        }
                    },
                    error:(errorMessage)=>{
                        Toast.fail(errorMessage) ;
                    }
                })
            } else {
                const { getFieldsError} = this.props.form;
                let errors = getFieldsError() ;
                let errorsArr = Object.values(errors).flat();
                Toast.fail(errorsArr.join(","))
            }
        });
    }

    render() {
        const { getFieldProps} = this.props.form;
        return (
            <form style={{margin:20,backgroundColor:'white'}}>
               <List renderHeader={()=>{
                   return (
                       <div style={{textAlign:'center'}}>
                           <img src={favicon} />
                       </div>
                   )
               }}>
                 <InputItem className={"login"}
                     {...getFieldProps('account',{
                         rules: [
                             { required: true, message: '账号不可为空' },
                         ],
                     })}
                     placeholder="请输入账号"
                     clear
                 >账号</InputItem>
                   <InputItem className={"login"}
                       {...getFieldProps('password',{
                           rules: [
                               { required: true, message: '密码不可为空' },
                           ],
                       })}
                       type="password"
                       placeholder="****"
                       clear
                   >密码</InputItem>
                   <Item
                       extra={
                           <div>
                               记住密码
                            <Switch {...getFieldProps('remeberPassword', { initialValue: isRemeberPassword() || true, valuePropName: 'checked' })} />
                           </div>
                       }
                   >&nbsp;</Item>
                   <Item>
                       <div style={{textAlign:'center',height:80,marginTop:40}}>
                            <Button type="primary" size={"large"}  onClick={this.onSubmit}>登录</Button>
                       </div>
                   </Item>
               </List>
            </form>
        );
    }
}

export default createForm()(Form);
