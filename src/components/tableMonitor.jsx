import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios'
// import TableHistory from './tableHistory'

const TableMonitor = (props) => {
    const [tables, setTables] = useState([])
    // const [tableRate, setTableRate] = useState(null)
    const [billingIndex, setBillingIndex] = useState(null)
    const paidTables = useRef([]);
    const [historyTables, setHistoryTables] = useState([])
    

    useEffect(()=>{ //REFRESH FOR CHANGES FROM THE DB
        // console.log('USE EFFECT')
        getTables()    

        const intervalId = setInterval(()=>{
            getTables()
        }, 500)
        return () => {
            clearInterval(intervalId)
        }
    }, [])

    const onBilling = async (tableId, index)=> {
        console.log('BILLING ', tableId, index)
        try {
            const table = await axios.get(`https://menubackend.netlify.app/.netlify/functions/app/${tableId}`)
            const tableItems = table.data.order
            setBillingIndex(index)
            const billedON = await axios.put(`https://menubackend.netlify.app/.netlify/functions/app/paidTurnON/${tableId}`, {paid: true})
    
        } catch (err) {
            console.log(err)
        }

    }

    const onTableAdd = async ()=>{
        console.log('ON TABLE ADD')
        try {
        const response = await axios.post(`https://menubackend.netlify.app/.netlify/functions/app/newTable`)
        console.log(response.data.id)
        const tablesCopy = [...tables]
        const newTable = [
            ...tablesCopy, 
            {   id: response.data.id, 
                name: response.data.id,
                order: [], 
                rate: null,
                attReq: false,
                paid: false
            }]
        console.log(response.data)
        setTables([...newTable])
        } catch (error) {
            console.log(error)
        }

    }

    const getTables = async()=>{
        try {
            // const response = await axios.get('http://192.168.100.43:3002/')
            const response = await axios.get(`https://nogitserverlesstest.netlify.app/.netlify/functions/app/`);
            const data = response.data;
            // console.log(data)
            // for (let i = 0; i < data.length; i++) {
            //     let table = data[i]
            //     let tableId = data[i]._id
            //     let paid = data[i].paid
            //     let tableItems = table.order.map((item)=>item.itemRate)
            //     let currentRate = tableItems.reduce((start, index)=>start + index, 0 )
            //     const dbTableRate = await axios.put(`http://192.168.100.43:3002/calculateRate/${tableId}`, {tableRate: currentRate})
            //     if(paid && !paidTables.current.includes(tableId) ){
            //         alert(`Table ${tableId} has paid the bill!! `)
            //         paidTables.current.push(tableId)
            //     }
                
            // }
            const  promises = data.map(async(table)=>{
                let tableId = table._id;
                let paid = table.paid;
                let tableItems = table.order.map((item)=>item.itemRate)
                let currentRate = tableItems.reduce((start, index) => start + index, 0);
                // await axios.put(`http://192.168.100.43:3002/calculateRate/${tableId}`, { tableRate: currentRate });
                    if (paid && !paidTables.current.includes(tableId)) {
                        alert(`Table ${tableId} has paid the bill!! `);
                        paidTables.current.push(tableId);
                    }

            })
            await Promise.all(promises);
            setTables([...data]);

        } catch (error) {
            console.log(error)
        }
        
    }

   
    const onTableDelete = async (e, index)=>{
        try {
            console.log('TABLE DELETE', e, index)
            const tablesCopy = [...tables]
            tablesCopy.splice(index, 1)
            const deleteOnDb = await axios.delete(`/tableDelete/${index}`)
            console.log(deleteOnDb.data)
            setTables([...tablesCopy])

    
        } catch (e) {
            console.log(e)
        }
    }

    const onAttend = async (e, index, id )=>{
        console.log(id)
        try {
            const update = await axios.put(`https://menubackend.netlify.app/.netlify/functions/app/attReqOff/${id}`)
            console.log(update)
        } catch (err) {
            console.log(err)
        }
    }
 
    const onItemDelete = async(table, item)=>{
        console.log('ON ITEM DELETE', table, item)
        try {
            const deletion = await axios.delete(`https://menubackend.netlify.app/.netlify/functions/app/deleteItems/${table}?item=${item}`)
            console.log(deletion)
        } catch (err) {
            console.log(err)
        }
    }

    const onClose = async(dayTables)=>{
        console.log('ON CLOSE', dayTables)
        try {
            const dayTotal = dayTables.reduce((total, nextItem)=> total + nextItem.rate, 0)
            const newDayTables = dayTables.map(table => ({
                tableId: table._id,
                tableRate: table.rate
            }));            
            const dayPost = await axios.post('https://menubackend.netlify.app/.netlify/functions/app/history', {dayTables: newDayTables, dayTotal: dayTotal})
            const tablesDeletePromises = dayTables.map((table)=> axios.delete(`https://menubackend.netlify.app/.netlify/functions/app/tableDelete/${table._id}`))
            Promise.all(tablesDeletePromises)
                .then(() => console.log('All tables deleted'))
                .catch((error) => console.error('Error deleting tables:', error));
        } catch (err) {
            console.log(err)
        }
    }    
    // console.log(tables)

    return(
        <div className='masterContent'>

            <div className='tableMonitor'>
                  <form>
                    <h2>Table Control </h2>
                    <button type='button' onClick={(e)=>onTableAdd(e)}>+ Add Table</button>
                    <button type='button' onClick={()=>onClose(tables)}>Close Tables</button>

                </form>

                <h1>Table Monitor</h1>
                    <h2>Serving {tables.length} Tables</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Table #</th>
                            <th>
                                Items Selected
                                <br />
                                Name,Rate    
                            </th>
                            <th>Fee </th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>

                        {tables.map((item, index) => (
                            <tr key={index}>
                                <td style={{...(item.attReq ? {background: 'yellow'} : {}), ...(item.paid ?{background: 'green'} : {})}}>
                                    {item._id}
                                </td>

                                <td style={{maxHeight: '200px', overflow: 'auto'}}>
                                {item.order.length === 0 ? (<p>Waiting for an order...</p>) : (
                                        <table>
                                            {item.order.map((orderItem, orderIndex) => (
                                                <tr key={orderIndex}>
                                                    <td>{orderItem.name}</td>
                                                    <td>
                                                        ${orderItem.itemRate}
                                                        <button
                                                        disabled={item.paid} 
                                                        onClick={() => onItemDelete(item._id, orderItem._id)}
                                                        style={{
                                                            height: '10px', 
                                                            width: '10px', 
                                                            borderRadius: '50%', 
                                                            background: item.paid ? 'green' : 'red', 
                                                            cursor: 'pointer'}}
                                                        title='Delete' 
                                                        ></button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </table>
                                    )}
                                </td>

                                <td>${item.rate}</td>
                                <td>
                                    <button type='button' onClick={() => onBilling(item._id, index)} disabled={item.paid}>Bill</button>
                                    <button type='button' onClick={(e) => onTableDelete(e, item._id)} disabled={item.paid}>Delete</button>
                                    <button type='button' onClick={(e) => onAttend(e, index, item._id) } disabled={item.paid}>Attend</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default TableMonitor