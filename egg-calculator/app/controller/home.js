'use strict';

const Controller = require('egg').Controller;
const { add, subtract, multiply ,divide } = require('loadsh')
// 

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    let {type,         // true, 数字开头， false：运算符开头
      numberArr, operatorArr } = ctx.request.body
    
    numberArr = numberArr.map(item => {
      return Number(item)
    })

    if(!type && (!numberArr.length || operatorArr[0] === '*' || operatorArr[0] ==='/' || operatorArr[0] === '%')) {
      ctx.body = '错误'
      return
    }

    if(!type) {
      numberArr = [0, ...numberArr]
    }

    while(operatorArr.length) {
      const i = operatorArr.findIndex(item =>( item === '*'|| item ==='/' || item === '%'))
      const index = i > 0 && i || 0
      calculate(numberArr, operatorArr, operatorArr[index], index)
    }
    ctx.body = numberArr[0];
  }
};


function calculate (numberArr, operatorArr, type, index = 0){
  let value;
  try {
    switch (type) {
      case '+':
        value = add(numberArr[index], numberArr[index+1])
        break;
      case '-':
        value = subtract(numberArr[index], numberArr[index+1])
        break;
      case '*':
        value = multiply(numberArr[index], numberArr[index+1])
        break;
        case '/':
          if(numberArr[index+1]) {
            value= divide(numberArr[index], numberArr[index+1])
          } else {
            value = '错误'
          }
          break;
        case '%':
          if(numberArr[index+1]) {
            value= numberArr[index] % numberArr[index+1]
          } else {
            value = '错误'
          }
          break;
        default:
          value = '未知错误'
          break;
    }
    numberArr.splice(index, 2, value)
    operatorArr.splice(index, 1)
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = HomeController;
