// const arrStatus = ['confirmed', 'ready_for_delivery', 'shipped', 'delivery', 'paid']
// for (let i = 0; i < arrStatus.length; i++) {
//     console.log (`status is: ${arrStatus[i]}`)
// }


// const arrStatus = ['confirmed', 'ready_for_delivery', 'shipped', 'delivery', 'paid']
// // let arrStatus = arrStatus.length;
// for (let i = 0; i <= (arrStatus.length) -1; i++) {
//   console.log(`status is: ${arrStatus[i]}`)
// }

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

    // {
    //     "order_ids": ["order_01HV6526JPFB5B3F8QNW616Q5H"],
    //     "status": "delivered"
    // }
    
    // {
    //     "order_ids":["order_01HV6526JPFB5B3F8QNW616Q5H"],
    //     "status":"paid"
    // }

    {"order_ids":[" order_01HV6526JPFB5B3F8QNW616Q5H"],"status":" confirmed"}