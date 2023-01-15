import { useEffect, useState } from "react"
import { data } from "../data/DB"
import { ApiKey } from "../../shipApiKey"

export const AwaitingShipment = () => {
    const keyAndSecretCode = ApiKey()

    const database = data
    const [orderCount, setOrderCount] = useState(0)
    const [pageCount, setPageCount] = useState(0)
    const [strings, setStrings] = useState(database.strings)


    const getMetaData = async () => {
        const response = await fetch(`https://ssapi.shipstation.com/orders?orderStatus=awaiting_shipment`, {
            headers: {
            'Host': 'ssapi.shipstation.com',
            'Authorization': `Basic ${keyAndSecretCode}`
            }
        })
        const responseJSON = await response.json()
        setOrderCount(responseJSON.total)
        setPageCount(responseJSON.pages)
        console.log(responseJSON)
    }

    useEffect(
        () => {
            getMetaData()
        },
        []
    )

    const getStringTotals = async () => {
        for (let i = 1; i <= pageCount; i++) {
            const response = await fetch(`https://ssapi.shipstation.com/orders?orderStatus=awaiting_shipment&page=${i}`, {
                headers: {
                'Host': 'ssapi.shipstation.com',
                'Authorization': `Basic ${keyAndSecretCode}`
                }
            })
            const responseJSON = await response.json()
            const orders = responseJSON.orders

            console.log("**************PAGE" + i)
            for (let j = 0; j < orders.length; j++) {
                let currentOrderNumber = (j + 1) + ((i * 100) - 100)
                console.log(`Order ${currentOrderNumber} of ${orderCount}: ${orders[j].orderNumber}`)

                let currentOrder = orders[j]
                for (const item of currentOrder.items) {
                    const customSkuObj = database.customSkus.find(object => {
                        return object.skus.find(sku => sku === item.sku)
                    })

                    if (customSkuObj) {
                        // get strings of custom sets and add to string count
                        console.log(`custom sku: ${item.sku}. Alloy: ${customSkuObj.alloyId} Quantity: ${item.quantity}. Gauges:`)
                        for (const option of item.options) {
                            console.log(option.value)
                            const string = strings.find(stringObj =>  stringObj.gauge === option.value)
                            if (string) {
                                const copy = [...strings]
                                const currentIndex = strings.indexOf(string)
                                copy[currentIndex].quantity += item.quantity
                                setStrings(copy)
                            }
                        }

                    } else {
                        const sjoySku = database.sjoySkus.find(sku => sku === item.sku)
                        if (sjoySku) {
                            // get strings of sjoysku and add to count
                        } else {
                            console.log(`${item.sku} not found in database`)
                        }
                    }
                }
            }
        }
        
        window.alert('Totals updated')
    }



    return <>
        <h4>Awaiting Shipment Component</h4>
        <button onClick={() => {
            if (pageCount > 0) {
                getStringTotals()
            } else {
                window.alert("No orders detected. Try refreshing the page.")
            }
        }}>Update order total</button>
        {
            orderCount
            ? <p>There are {orderCount} orders in Awaiting Shipment</p>
            : <p>Retrieving order count... Please wait.</p>
        }
        <table>
            <tbody>
                <tr>
                    <td>Alloy</td>
                    <td>Gauge</td>
                    <td>Qauntity</td>
                </tr>
                {       
                    strings.map(stringObj => {
                        const alloy = database.alloys.find(alloyObj => {
                            return stringObj.alloyId === alloyObj.id
                        })

                        return <tr key={`string--${stringObj.id}`}>
                            <td>{alloy.alloy}</td>
                            <td>{stringObj.gauge}</td>
                            <td>{stringObj.quantity}</td>
                        </tr>
                    })
                }
            </tbody>
        </table>
    </>
}