import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import './table.css'  



const Table = ()=>{
    const {id }  = useParams()
    const navigate = useNavigate()

    const [currentMenu, setCurrentMenu] = useState([])
    const [isFetchingMenu, setIsFetchingMenu] = useState(false)
    const [orderedItems, setOrderedItems] = useState([])
    const [totalRate, setTotalRate] = useState(null)
    const [onPayClick, setonPayClick] = useState(false)
    const [alertShown, setAlertShown] = useState(false);


    useEffect(()=>{
        const fetchTables= async()=>{
            try {
                const response = await axios.get(`http://192.168.100.44:3003/${id}`)
                const rate = response.data.rate
                setTotalRate(rate)
                const paidStatus = response.data.paid
                if(paidStatus &&  !alertShown){
                    setonPayClick(true)
                    alert(`Your table has been billed a total of $${rate}`)
                    setAlertShown(true);
                    alert('Thank you for your purchase, pls come back soon :)')
                    navigate('/')
        
                    return
                    
                }
                const items = response.data.order
                setOrderedItems([...items])
                // console.log(items)
                if(!response.data){
                    navigate('/')
                }
            } catch (err) {
                alert('Invalid Table ID, please verify your ID')
                navigate('/')
            }
        }
        const fetchMenu = async()=>{
            if(isFetchingMenu) return
            setIsFetchingMenu(true)
            try {
                const response = await axios.get(`http://192.168.100.44:3003/menuItems`)
                const menuItemsfromDb = response.data.menuItems
                // console.log(menuItemsfromDb)
                setCurrentMenu(menuItemsfromDb)
            } catch (err) {
                console.log(err)
            } finally{
                setIsFetchingMenu(false)
            }
        }
        fetchTables()
        const intervalId  = setInterval(()=>{
            fetchTables()
            fetchMenu()
        }, 1000)

        return () => clearInterval(intervalId)

    }, [id, navigate, alertShown])

    const onCallAttention = async(id)=>{
        console.log('ON ATTENTION REQ')
        try {
            const update = await axios.put(`http://192.168.100.44:3003/${id}`)
            console.log(update)
            alert('Attention is on the way, pls hold!')
        } catch (err) {
            console.log(err)
        }
    }

    const onOrder = async(id, name, rate)=>{
        console.log('ON ORDER', id, name, rate)
        try {
            const itemAddition = await axios.put(`http://192.168.100.44:3003/addItems/${id}`, {name, rate})
            console.log(itemAddition)
        } catch (err) {
            console.log(err)
        }
       

    }

    const onPay = async(id, )=>{
        console.log('onPay', id)
        if(orderedItems.length === 0){
            alert('Please order something')
            return
        }
        try {
            console.log(orderedItems)
            // eslint-disable-next-line no-unused-vars
            const billedON = await axios.put(`http://192.168.100.44:3003/paidTurnON/${id}`, {paid: true})
            const tableRate = orderedItems.reduce((total, nextItem)=> total + nextItem.itemRate, 0)
            // eslint-disable-next-line no-unused-vars
            const dbTableRate = await axios.put(`http://192.168.100.44:3003/calculateRate/${id}`, {tableRate: tableRate})
            console.log(tableRate)
            setTotalRate(tableRate)
            setonPayClick(true)

        } catch (err) {
            console.log(err)
        }
    }

    const onNewTable = ()=>{
        navigate('/')

    }

    return(
        <div className='row table'>
                <div className='column table'>
                <h1>Table# {id} </h1>
                    <h2>Today's Menu:</h2>
                    <table>
                        <thead>
                           <tr> 
                            <th>ID</th>
                            <th>Name</th>
                            <th>Rate</th>
                            <th>Actions</th>
                           </tr>
                        </thead>
                        <tbody>
                            {currentMenu.map((item, index)=>{
                                return(
                                <tr key={index}>
                                        <td>{item._id}</td>
                                        <td>{item.name}</td>
                                        <td>${item.rate}</td>
                                        <td>
                                            <button onClick={()=>onOrder(id, item.name, item.rate)}type='button' disabled={onPayClick}>Order +</button>

                                        </td>
                                </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className='column table'>
                    <h3>Total Ammount to pay: ${totalRate}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Item Ordered</th>
                                <th>Rate $: </th>

                            </tr>
                        </thead>
                        <tbody>
                            {orderedItems.map((item,index)=>{
                                return (
                                    <tr key={index}>
                                        <td>{item.name}</td>
                                        <td>${item.itemRate}</td>
                                    </tr>
                                )
                            })}
                            <tr>
                             
                                <td colSpan={1}>
                                    <button type='button' onClick={()=>onPay(id)} disabled={onPayClick} >Pay</button>
                                    <button type='button' onClick={()=>onCallAttention(id)} disabled={onPayClick} >Call Attention</button>
                                </td>
                                <td>
                                    <span>Total: $ {totalRate}</span>    
                                </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={1}>
                                    <button onClick={()=>onNewTable()}>New Table!</button>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

        </div>
    )
}

export default Table