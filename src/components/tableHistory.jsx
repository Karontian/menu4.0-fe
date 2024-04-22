import { useEffect, useState } from "react";
import axios from 'axios'
// import TableHistory from './tableHistory';

const TableHistory = ()=>{

    useEffect(()=>{ 
        getHistory()
    })

    const [historyTables, setHistoryTables] = useState([])
    const getHistory = async()=>{
        // console.log('GETTING HISTORY')
        try {
            const dayClose = await axios.get('http://192.168.100.44:3003/history')
            setHistoryTables(dayClose.data)
        } catch (err) {
            console.log(err)
        }
    }

    const onDeleteHistory = async()=>{
        console.log('ON DELETE HISTORY')
        const passcode = 666
        const sec = prompt('Your deleting sensitive information, pls enter admin password')
        if(Number(sec) === 666){
            try {
                const deletion = await axios.delete(`http://192.168.100.44:3003/admin/deleteHistory`)
                console.log(deletion)
            } catch (err) {
                console.log(err)
            }
        } else {
            alert('Access Denied')
        }
    }
    // console.log(historyTables)
    return (
        <>
            <h1>Table History</h1>
            <table>
                <thead>
                    <tr>
                        <td>Date</td>
                        <td>Table</td>
                        <td>Table Rate</td>
                        <td>Day Total Revenue</td>


                    </tr>
                </thead>
                <tbody>
                    {historyTables.map((item, index)=>{
                        return(
                            <tr key={item._id}>
                                <td>
                                {new Date(item.date).toLocaleString("en-US", {timeZone: "America/Denver", year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'})}
                                </td>
                                <td >
                                    {item.tables.map((item, index)=>
                                      <div key={index}>
                                        {item.tableId}
                                      </div>
                                )}
                                </td>
                                <td>
                                    {item.tables.map((item, index)=>
                                      <div key={index}>
                                        ${item.tableRate}
                                      </div>
                                )}
                                </td>
                                <td>${item.dayTotal}</td>     
                                                 
                            </tr>
                           

                        )
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <td>
                            <button type="button" onClick={()=>onDeleteHistory()}> Delete History </button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </>
    )
}
export default TableHistory