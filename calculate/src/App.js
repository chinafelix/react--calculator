import React from 'react';
import axios from 'axios'

import './App.css';

const reg = /^\d+|\.$/

class App extends React.Component {
  state = {
    pageLeft: [
      [
        { id: 11, name: "c", isClear: true, code: -2 },
        { id: 12, name: "÷", isBtn: true, code: '/' },
        { id: 13, name: "x", code: '*' },
      ],
      [
        { id: 21, name: "7", code: 7 },
        { id: 22, name: "8", code: 8 },
        { id: 23, name: "9", code: 9 },
      ],
      [
        { id: 31, name: "4", code: 4 },
        { id: 32, name: "5", code: 5 },
        { id: 33, name: "6", code: 6 },
      ],
      [
        { id: 41, name: "1", code: 1 },
        { id: 42, name: "2", code: 2 },
        { id: 43, name: "3", code: 3 },
      ],
      [
        { id: 51, name: "%", code: '%' },
        { id: 52, name: "0", code: 0 },
        { id: 53, name: ".", code: '.' },
      ],
    ],
    pageRight: [
      { id: 61, name: require('./delete.png'), isPic: true, code: -1 },
      { id: 62, name: "-", code: '-' },
      { id: 63, name: "+", code: '+' },
      { id: 64, name: "=", isTwo: true, code: -100 },
    ],
    result: '',       // 显示结果
    numberArr: [],    // 数字数组
    operatorArr: [],  // 运算符数组
    init: true,       // 用于判断是否已经提交
    preInput: ''      // 判断前后两次输入是否是同类型
  }
  renderLeft = () => {
    return this.state.pageLeft.map((item, index) => {
      return (<div key={index}>{
        item.map(dot => {
          return <span key={dot.id} className={dot.isBtn && 'btn'} data-id={dot.code}>{dot.name}</span>
        })
      }</div>)
    })
  }

  renderRight = () => {
    return this.state.pageRight.map(item => {
      return (
        item.isPic && (<span key={item.id} data-id={item.code}><img src={item.name} data-id={item.code} /></span>) || 
        (<span key={item.id} className={`btn ${item.isTwo && 'isTwo' || ''}`} data-id={item.code}>{item.name}</span>)
      )
    })
  }

  deleteLast = (string) => {
    const last = string.charAt(string.length-1)
    // const reg = /^\d+|\.$/
    return reg.test(last)
  }

  request = (data) => {
    axios.post('http://127.0.0.1:7001',data).then(res =>{
      this.setState({
        result: res.data, 
        numberArr: [],    
        operatorArr: [], 
        init: true,       
        preInput: '',     
      })
    })
  }

  // 判断前后两次输入
  validatorInput = (pre, cur) => {
    // const reg = /^\d+|\.$/;
    const preReg = reg.test(pre);
    const curReg = reg.test(cur);
    return preReg === curReg
  }

  handleClick(e){
    // const reg = /^\d+|\.$/;
    const code = e.target.dataset.id
    const { result, numberArr, operatorArr, init, preInput } = this.state

    if(code === '-100') {     // 提交
      if(result) {
        const firstString = String(result).charAt(0)
        let type
        if(reg.test(firstString)) {
          type = true
        }else {
          type = false
        }
        const data = {
          type,         // true, 数字开头， false：运算符开头
          numberArr, operatorArr
        }
        this.request(data)
      }
    } else {
      let res = '', number = [], operator = [], input = ''
      switch (code) {
        case '-2':
          res = ''
          number = []
          operator = []
          break;
        case '-1':
          const r = this.deleteLast(result)
          if(r) {
            number = numberArr.slice(0, -1)
            operator = operatorArr
          }else {
            operator = operatorArr.slice(0, -1)
            number = numberArr
          }
          res = init && '' || result.slice(0, -1)
          input = res.charAt(res.length-1)
          break;
        default:
          res = init && code || result + code
          input = code
          const valid = this.validatorInput(preInput, input)
          if(reg.test(code)) {
            const last = numberArr.slice(-1)[0]
            if(valid || last === '-') {
              const str = numberArr.length && last + code || code
              number = [...numberArr.slice(0, -1), str]
            } else {
              number = [...numberArr, code]
            }
            operator = operatorArr
          } else {
            number = numberArr
            if(valid) {
              if((preInput === '+' || preInput === '-') || ((preInput === '*' || preInput === '/' || preInput === '%') && (code === '*' || code === '/'))) {
                operator = [...operatorArr.slice(0, -1), code]
                res = init && code || result.slice(0, -1) + code
              } else if((preInput === '*' || preInput === '/' || preInput === '%')) {
                if(code === '+') {
                  operator = operatorArr
                  res = result
                  input = preInput
                }
                if(code === '-') {
                  number = [...numberArr, code]
                  operator = operatorArr
                }
              } else {
                operator = [...operatorArr, code]
              }
            } else {
              operator = [...operatorArr, code]
            }
          }
          break;
      }
      this.setState({
        result: res,
        numberArr: number,
        operatorArr: operator,
        init: false,
        preInput: input
      })
    }
  }

  render(){
    const {result} = this.state
    return (<div className="container-wrapper">
      <div className="template">{result}</div>
      <div className="container" onClick={(e) => {this.handleClick(e)}}>
        {/* 左侧 */}
        <div className="flex-left">{ this.renderLeft() }</div>
        
        {/* 右侧 */}
        <div className="flex-right">{ this.renderRight() }</div>
      </div>
    </div>)
  }
}

export default App;
