import React, {useEffect, useState} from 'react'
import './menuAdmin.css'
import TableMonitor from './tableMonitor'
import axios from 'axios'
import TableHistory from './tableHistory'
const MenuAdmin = () =>{
//*************************************************************** */
               //MENU ITEMS AND ADD ITEMS FUNCTIONS
/*************************************************************** */
axios.defaults.baseURL = 'https://menubackend.netlify.app/.netlify/functions/app'


    const [menuItems, setMenuItems] = useState([])
    // const [isEditing, setIsEditing] = useState(false)
    const [editingIndex, setEditingIndex] = useState(null)
    const [newName, setNewName] = useState('')
    const [newRate, setNewRate] = useState('')
    const [newEditedName, setNewEditedName] = useState('')
    const [newEditedRate, setNewEditedRate] = useState('')

    const onChange = (e) =>{
        const {name, value} = e.target;
        name === "newItemRate" ? setNewRate(value) : setNewName(value)
    }

    const onChangeEdition = (e) =>{
        const {name, value} = e.target
        name === 'editedRate' ? setNewEditedRate(value) : setNewEditedName(value)
        console.log(name, value)
    }

//TABLE  CONTROL // //TABLE  CONTROL // //TABLE  CONTROL //
//************************* */  //************************* */  
//MENU CONTROL// //MENU CONTROL// //MENU CONTROL// //MENU CONTROL// 

///***MENU CONTROL *////***MENU CONTROL *////***MENU CONTROL *////***MENU CONTROL */
    useEffect(() => {
        getMenu();
        const intervalId = setInterval(getMenu, 1000);
        return () => {
            clearInterval(intervalId);
        };
    }, []);

    let isGettingMenu = false;

    const getMenu = async () => { //GET THE MENU
            if (isGettingMenu) return;
            isGettingMenu = true;
            try {
                console.log('REQUESTING MENU');
                const newMenu = await axios.get(`https://menubackend.netlify.app/.netlify/functions/app/menuItems`);
                // const newMenu = await axios.get(`https://nogitserverlesstest.netlify.app/.netlify/functions/app/`);

                const menu = newMenu.data;
                setMenuItems(menu.menuItems);
            } catch (e) {
                // console.log(e);
            } finally {
                isGettingMenu = false;
            }
    };
    
    const onItemAdd = async(e, name, rate)=>{ //ITEM ADD TO DB
        try {
            console.log(e, name, rate)
            if(name === '' || rate === ''){
                alert('Both fields need to be filled')
                return;
            }
            if(isNaN(parseInt(rate))){
                alert('Rate needs to be a value in $')
            }
            const addition = await axios.post(`https://menubackend.netlify.app/.netlify/functions/app/menuItemAdd`, {name, rate})
            setNewName('')
            setNewRate('')
        } catch (e) {
            console.log(e)
        }
    }
    
    const onMenuReset = async()=>{//DELETE ALL ITEMS
        console.log('MENU RESET')
        try {
            const reset = await axios.delete(`https://menubackend.netlify.app/.netlify/functions/app/menuReset`)
            console.log(reset)
        } catch (e) {
            console.log(e)
        }
    }

    const onItemDelete = async(item)=>{/// DELETE ITEM PER ID
        console.log('ITEM DELETE', item)
        try {

            const deletion = await axios.delete(`https://menubackend.netlify.app/.netlify/functions/app/${item}`)
            console.log(deletion)

        } catch (e) {
            console.log(e)
        }
    }

    const onItemEdition = async(id)=>{//EDIT ITEM
        console.log('ON EDITION', id)
        const itemToEdit = menuItems.find(item => item._id === id);
        setNewEditedName(itemToEdit.name);
        setNewEditedRate(itemToEdit.rate);
    
        setEditingIndex(id)
    }

    const onEditSave = async(id)=>{//EDITION SAVE
        if(newEditedName === '' || newEditedRate === ''){
            alert('Both fields required')
            return;
        }
        if(!/^\d+(\.\d+)?$/.test(newEditedRate)){
            alert('Rate needs to be a value in $')
            return
        }
            console.log('ON EDITION SAVE')
        try {
            const updatedItem = await axios.put(`https://menubackend.netlify.app/.netlify/functions/app/${id}`, {
                name: newEditedName,
                rate: newEditedRate
        
            })
            console.log(updatedItem);
            setEditingIndex(null);
            setNewEditedName('');
            setNewEditedRate('');

        } catch (e) {
            console.log(e)
        }
    }

    const onCancel  = async()=>{//CANCEL BUTTON
        console.log('ON CANCEL')
        setEditingIndex(null);

    }

    // console.log('NETLIFY TESTS',menuItems)
    
    return (
        <div className='row'>
            <div className='column mainMenu'>
                <h1>Menu Admin</h1>
                <table>
                    <thead>
                        <tr>
                            {/* <th>Id</th> */}
                            <th>Name</th>
                            <th>Rate $</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                  {menuItems.map((item, index)=>(
                    editingIndex === item._id ? (
                        <tr key={item._id}>
                            {/* <td>{item._id}</td> */}
                            <td>
                                <label htmlFor="editedName">New Name:</label>
                                <input type='text' name='editedName'onChange={(e)=>onChangeEdition(e)} value={newEditedName} required/>
                            </td>
                            <td>
                                <label htmlFor="editedRate">New Rate$:</label>
                                <input type='text' name='editedRate' onChange={(e)=>onChangeEdition(e)} value={newEditedRate} required/>
                            </td>
                            <td>
                                <button onClick={()=>onEditSave(item._id)}>Save</button>
                                <button onClick={()=>onCancel()}>Cancel</button>

                            </td>
                        </tr>
                    ):(
                        <tr key={item._id}>
                            {/* <td>{item._id}</td> */}
                            <td>{item.name}</td>
                            <td>${item.rate}</td>
                            <td>
                                <button onClick={()=>onItemDelete(item._id)}>Delete</button>
                                <button onClick={()=>onItemEdition(item._id)}>Edit</button>
                            </td>

                         </tr>

                        
                    )
                  ))}


                    </tbody>
                    <tfoot>
                        <tr>
                            <td>
                                <label htmlFor="newName">Name: </label>
                                <input type="text" name='newName' value={newName} onChange={(e)=>onChange(e)} />
                            </td>
                            <td>
                                 <label htmlFor="newItemRate">Rate $: </label>
                                <input type="text" name='newItemRate' value={newRate} onChange={(e)=>onChange(e)} />
                            </td>
                            <td>
                                <button onClick={(e)=>onItemAdd(e, newName, newRate)}>Add+</button>
                            </td>
                        </tr>
                        <tr>
                        <td>
                                    <button onClick={()=>onMenuReset()}>Reset Menu</button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div className='column ' >
                <h1>Table Admin</h1>
                <TableMonitor
                    currentMenu = {menuItems}
                />
            </div>
            <div className='column'>
              <TableHistory/>
             </div>
        </div>
    )

}

export default MenuAdmin