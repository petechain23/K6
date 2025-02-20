// const arrStatus = ['confirmed', 'ready_for_delivery', 'shipped', 'delivery', 'paid']
// for (let i = 0; i < arrStatus.length; i++) {
//     console.log (`status is: ${arrStatus[i]}`)
// }

/*
let order_Id = 'order_01HV6526JPFB5B3F8QNW616Q5H'
const arrStatus = ['confirmed', 'ready_for_delivery', 'shipped', 'delivery', 'paid']
// let arrStatus = arrayStatus.length;
for (let i = 0; i <= (arrStatus.length) - 1; i++) {
  console.log(`status is: ${arrStatus[i]}`)

  //Update Order Status
  const payloadUpdateOrderStatus = JSON.stringify({
    order_ids: [
      //   "order_01HV6526JPFB5B3F8QNW616Q5H"
      `${order_Id}`
    ],
    status: `${arrStatus[i]}`
  });
  console.log(payloadUpdateOrderStatus)
}
*/

const placeholder1 = new Date().getDate().toString() + '-' + new Date().getHours().toString() + '-' +  new Date().getMinutes().toString() + '-' +  new Date().getSeconds().toString();
console.log(placeholder1) //20-16-26-36
const placeholder2 = new Date().toISOString()
console.log(placeholder2) //2025-02-20T09:22:28.067Z