import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './clientHome.css'

const ClientHome = () =>{

    const navigate = useNavigate()
    const [id, setId] = useState('')
    const [tableRequested, setTableRequested] = useState(false)
    // const [toTable, setToTable] = useState(false)

    const onRequest= async(e)=>{
        e.preventDefault()
        console.log('TABLE REQUESTED')
        try {
            const response = await axios.post(`https://menubackend.netlify.app/.netlify/functions/app/newTable`)
            setId(response.data.id)
            setTableRequested(true)
            console.log(response.data)
        } catch (err) {
            console.log(err)
        }
    }

    const onGoToTable = (e)=>{
        e.preventDefault()
        console.log('GO TO TABLE')
        navigate(`/tables/${id}`)
    }

    return (
        <div className="row client-home">
            <div className="column client-home">
                {tableRequested === true ?
                
                    <h1 style={{color: 'grey'}}>Thanks your table is ready</h1> :
                    <h1>Please request a table</h1>    
                }
                    <form >
                    
                    <button onClick={(e)=>onRequest(e)} disabled={tableRequested}>Request!!</button>
                </form>
            </div>
            {tableRequested === true ?
               (
                <>
                <div className='column client-home'>
                    <h1>Your Table ID is: {id}</h1>
                    <form >
                        <button onClick={(e)=>onGoToTable(e)}>Go to my Table</button>
                    </form>

                </div>
                </>
               ):(
                <></>
               )
            }
        </div>
    )
}

export default ClientHome