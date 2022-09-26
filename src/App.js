import React, { useState, useEffect } from 'react';
import './App.css';
import MaterialTable from 'material-table'
import Select from "react-select";
const axios = require('axios');

const API_URL = `https://localhost:44303/api/Permission`;

export const App = () => {

  const [permissions, setPermissions] = useState([]);  

  const permissionTypeList = [
    { value: 1, label: "Admin" },
    { value: 2, label: "User" }
  ];

  const columns = [
  { title: "ID", field: "id", editable: false, hidden: true },
  { title: "Nombre Empleado", field: "nombreEmpleado" },
  { title: "Apellido Empleado", field: "apellidoEmpleado" },
  {
    title: "Tipo Permiso",
    field: "tipoPermisoId",
    editComponent: ({ value, onChange }) => (
      <Select
        options={permissionTypeList}
        name="PermissionSelect"
        onChange={(selectedOption) => onChange(selectedOption.value)}
        value={value ? value.value : value}
        placeholder="Seleccione tipo permiso"
      />
    )
  },
  { title: "Fecha Permiso", field: "fechaPermiso", type: "date", dateSetting: { locale: "en-GB" } }
]

  useEffect(() => {    
    const getPermissions = async () => {
      axios.get(`${API_URL}`).then((res) => {        
        setPermissions(res.data.map((value) => {
          return { id: value.id, nombreEmpleado: value.nombreEmpleado, apellidoEmpleado: value.apellidoEmpleado, tipoPermisoId: value.tipoPermisoId === 1 ? 'Admin' : 'User', fechaPermiso: value.fechaPermiso }
        }));    
      }).catch((err) => {   
        setPermissions([]);     
        console.log(err);      
      });      
    };
    getPermissions();     
  }, [])

const insertPermission = (permission) => {
  axios.post(`${API_URL}`, {
    nombreEmpleado: permission.nombreEmpleado,
    apellidoEmpleado: permission.apellidoEmpleado,
    tipoPermisoId: permission.tipoPermisoId,
    fechaPermiso: permission.fechaPermiso
  }).then((res) => {
    setPermissions([permission, ...permissions]);   
  }).catch((err) => {
    console.log(err);
  });
}

const updatePermission = (permission) => {
    axios.put(`${API_URL}`, {
      id: permission.id,
      nombreEmpleado: permission.nombreEmpleado,
      apellidoEmpleado: permission.apellidoEmpleado,
      tipoPermisoId: permission.tipoPermisoId === 'Admin' ? 1 : 2,
      fechaPermiso: permission.fechaPermiso
    }).then((res) => {
      const permissionClone = [...permissions];
      const updated = permissionClone.map(object => {
        if (object.id === permission.id) {
          return {...permission};
        }
        return object;
      });
      setPermissions(updated);                  
    }).catch((err) => {
      console.log(err);
    });
}


  return (
    <div className="App">
      <h1 align="center">Test FrontEnd</h1>
      <h4 align='center'>Permissions Users</h4>
      <MaterialTable
         title="Permissions"
         options={{ search: false, actionsColumnIndex: -1, paging: false, addRowPosition: "first" }}
         data={permissions}
         columns={columns}           
         editable={{
          onRowAdd: (newRow) => new Promise((resolve, reject) => {              
            setTimeout(() => {
              insertPermission(newRow);
              resolve()
            }, 1000)            
          }),
          onRowUpdate:(updatedRow,oldRow)=>new Promise((resolve,reject)=>{            
            const index=oldRow.tableData.id;
            const updatedRows=[...permissions]                                         
            updatedRows[index]=updatedRow
            setTimeout(() => {
              updatePermission(updatedRow);
              resolve()
            }, 1000)            
          })
        }}
      />
    </div>
  )
}
export default App;