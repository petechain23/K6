import { sleep, check, group } from 'k6'
import http from 'k6/http'

// const baseUrl = 'https://hei-oms-apac-qa-id-backend.azurewebsites.net';
const authUrl = 'admin/auth'
const createUrl = 'admin/orders/create'

//ID-QA
const emailAdress = 'mulianaagus641@gmail.com';
const customerId = 'cus_01HDFXDP6Y55G3SCNRBCPDCBVS';
const depotId = 'depot_01H6X2SJQBKCBW1HKAEFSB42WD';
// const outletId = 'outlet_01HDFWZ7GB2KSMRPWWKZ2ZRVCJ';
const region_id = 'reg_01H5P3E6X97YGENVSW4Z7A5446';
const option_id = 'so_01H5P53FY82T6HVEPB37Z8PFPZ';
// const variant_id = 'variant_01H5PS9EVF5915DRCDD8NDKJAT';
// const sku_1867 = 'variant_01H6DTJPTN4HQYKAGN9KRVZ4YY';
// const sku_10163 = 'variant_01H5PMESX1AR52H7BJ4CTHHE80';

export function createOrder(baseUrl, oID, vID, qTY) {
    //create order payload
    const payloadCreateOrder = JSON.stringify({
        email: `${emailAdress}`,
        items: [
            {
                quantity: qTY,//
                variant_id: `${vID}`//
            }
        ],
        metadata: {
            source_system: 'OMS',
        },
        order_type: 'standard', //returned or standard
        region_id: `${region_id}`,
        shipping_methods: [
            {
                option_id: `${option_id}`
            }
        ],
        shipping_address: {
            address_1: 'SAWANGAN',
            first_name: 'AGUS MULIANA',
            last_name: '-',
            city: 'Jarkata',
            postal_code: '12345',
            country_code: 'id'
        },
        billing_address: {
            address_1: 'SAWANGAN',
            first_name: 'AGUS MULIANA',
            last_name: '-',
            city: 'Jarkata',
            postal_code: '12345',
            country_code: 'id'
        },
        customer_id: `${customerId}`,
        depot_id: `${depotId}`,
        outlet_id: `${oID}`//
    });

    const params = {
        headers: {
            "Content-Type": "application/json",
        }
    };
    
    let response;
    group(
        'page_2 - orders',
        function () {
            const response = http.post(`${baseUrl}/${createUrl}`, payloadCreateOrder, params);
            const body = JSON.parse(response.body)
            console.log('display_id: ', body.order.display_id);
            // console.log('show log response body', response.body);
            check(response, {
                'verify status equals 200': (response) => response.status.toString() === '200',
                'verify create successfully': (r2) => r2.body.includes('order'),
            });
        },
    )
}