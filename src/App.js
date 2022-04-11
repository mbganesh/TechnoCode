import React, { useState, useEffect, } from 'react';
import axios from 'axios'
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from "@mui/x-data-grid";
import { AppBar, Avatar, Button, Card, Dialog, IconButton,  TextField, Toolbar, Tooltip, Typography } from '@mui/material'

function App() {

  const [btnName , setBtnName] = useState('Create User')

  const columns = [
    {
      field: 'avatar', headerName: 'Profile Picture', width: 200, renderCell: (params) => {
        return (
          <div>
            <Avatar src={params.row.avatar} style={{ width: '50px', height: '50px' }} />

          </div>
        )
      }
    },
    { field: "id", headerName: "ID", width: 70 },
    { field: "first_name", headerName: "First name", width: 130 },
    { field: "last_name", headerName: "Last name", width: 130 },
    { field: "email", headerName: "Email", width: 300 },

  ];


  const [createUser, setCreateUser] = useState({ name: '', job: '' })

  const [createUserL, setCreateUserL] = useState({
    avatar: "https://source.unsplash.com/random",
    email: '',
    first_name: '',
    id: '',
    last_name: ''
  })


  //  //////////////// First Modal

  function generateRandom(maxLimit = 100) {
    let rand = Math.random() * maxLimit;
    console.log(rand); // say 99.81321410836433

    rand = Math.floor(rand); // 99

    return rand;
  }



  const [openL, setOpenL] = useState(false);
  const handleOpenL = () => {
    setBtnName('Create User')
    setCreateUserL({
      avatar: "https://source.unsplash.com/random",
      email: '',
      first_name: '',
      id: generateRandom(),
      last_name: ''
    })
    setOpenL(true)
    setOpen(false)
  };
  const handleCloseL = () => setOpenL(false);

  // ***************** Second Modal 

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setCreateUser({ name: '', job: '' })
    setOpen(true)
    setOpenL(false)
  };
  const handleClose = () => setOpen(false);

  // ************** Local ******************* //

  const handleFirstName = (e) => {
    let txt = e.target.value
    setCreateUserL({ ...createUserL, first_name: txt })
  }

  const handleLastName = (e) => {
    let txt = e.target.value
    setCreateUserL({ ...createUserL, last_name: txt })
  }


  const handleEmail = (e) => {
    let txt = e.target.value
    setCreateUserL({ ...createUserL, email: txt })
  }


  function validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  const handleCreateUserLocal = () => {


    if(btnName === 'Create User'){
      if (validateEmail(createUserL.email) && createUserL.first_name !== '' && createUserL.last_name !== '') {
        setUserData([...userData, createUserL])
        handleCloseL()
      } else if (!validateEmail(createUserL.email)) {
        alert('Please enter valid email id')
        return;
      } else {
        alert('Please enter all the details')
        return;
      }
    }else {
      handleEdit()
    }


   

  }


  const [userData, setUserData] = useState([])

  const handleName = (e) => {
    let txt = e.target.value
    setCreateUser({ ...createUser, name: txt })
  }

  const handleJob = (e) => {
    let txt = e.target.value
    setCreateUser({ ...createUser, job: txt })
  }

  const handleCreateUser = () => {

    if (createUser.name === '') {
      alert('Please Enter User Name')
    } else if (createUser.job === '') {
      alert('Please Enter User Job')
    } else if (createUser.name === '' && createUser.job === '') {
      alert('Fields cannot be empty')
    } else {
      axios.post('https://reqres.in/api/users', createUser).then(res => {
        console.log(res.data);

        let addOneUserDetail = `ID : ${res.data.id} \n Name : ${res.data.name} \n Job : ${res.data.job}\n CreatedAt : ${res.data.createdAt}`
        alert(addOneUserDetail)
        handleClose()
      })
    }
  }


  const handleDelete = (id) => {
    const newData = userData.filter(data => data.id !== id)
    setUserData(newData)

  }

  const handleEditPre = (id) => {

    setBtnName('Edit User')

    const found = userData.filter(data => data.id === id)

    setOpenL(!openL)

    setCreateUserL({
      email: found[0].email,
      first_name: found[0].first_name,
      last_name: found[0].last_name
    })


  }

  const handleEdit = (id) => {
    const found = userData.filter(data => data.id === id)
    console.log('found');
    // setUserData(newData)
  }


  useEffect(() => {
    axios.get('https://reqres.in/api/users?page=2').then(res => {
      console.log(res.data.data);

      setUserData(res.data.data)
    })
  }, [])

  return (

    <div>

      <AppBar position='sticky'>
        <Toolbar style={{ backgroundColor: '#064635' }}>
          <Typography style={{ flex: 1 }} variant='h6'>User Details</Typography>
          <Button variant='contained' startIcon={<AddIcon />} style={{ backgroundColor: '#F0BB62' }} onClick={handleOpen} > Add User[API] </Button>

          <Button variant='contained' startIcon={<AddIcon />} style={{ marginLeft: '10px', backgroundColor: '#F0BB62' }} onClick={handleOpenL} > Add User[Local] </Button>


        </Toolbar>
      </AppBar>

      {/* container */}
      <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>

        {/* SubContainer */}
        <div style={{ marginTop: '25px', width: '70%', justifyContent: 'center', display: 'flex', flexWrap: 'wrap' }}>
          {
            userData.map(data => (
              <Card sx={{ width: "350px", backgroundColor: '#B8E4F0', padding: '10px', margin: '10px', boxShadow: 'none', '&:hover': { boxShadow: `9px 7px 14px 0px rgba(114,103,203,1)`, transition: '0.8s', transform: `scale(1.05)` }, }}>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Avatar alt={data.first_name + data.last_name} src={data.avatar} style={{ width: '75px', height: '75px' }} />

                  <div>
                    <Tooltip title='Edit' arrow>
                      <IconButton style={{ color: '#D49B54' }} onClick={() => handleEditPre(data.id)} > <EditIcon /> </IconButton>
                    </Tooltip>
                    <Tooltip title='Delete' arrow>
                      <IconButton style={{ color: '#FF1818' }} onClick={() => handleDelete(data.id)}> <DeleteIcon /> </IconButton>
                    </Tooltip>

                  </div>

                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }}>
                  <Typography style={{ whiteSpace: 'nowrap' }} > <span style={{ fontWeight: 'bold' }}>First Name : </span> {data.first_name} </Typography>
                  <Typography style={{ whiteSpace: 'nowrap' }} > <span style={{ fontWeight: 'bold' }}>Last Name : </span> {data.last_name} </Typography>
                  <Typography style={{ whiteSpace: 'nowrap' }} > <span style={{ fontWeight: 'bold' }}>Email ID : </span> {data.email} </Typography>
                </div>

              </Card>
            ))
          }
        </div>

        {/* SubContainer2 */}
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={userData}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </div>

      </div>


      <Dialog
        open={open}
        onClose={handleClose}
      >

        <div style={{ display: 'flex', flexDirection: 'column', width: 500 }}>

          <div style={{ backgroundColor: '#243D25', padding: '10px' }}>
            <Typography variant='h6' style={{ textAlign: 'center', color: 'white' }}>Add User</Typography>
          </div>

          <div style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant='subtitle1' > Name</Typography>
            <TextField value={createUser.name} onChange={(e) => handleName(e)} variant='outlined' placeholder='Enter User Name' />
          </div>


          <div style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant='subtitle1' > Job</Typography>
            <TextField value={createUser.job} onChange={(e) => handleJob(e)} variant='outlined' placeholder='Enter User Job' />
          </div>


          <Button style={{ borderRadius: 0, backgroundColor: '#243D25', padding: '10px' }} variant='contained' onClick={() => handleCreateUser()} > Create User </Button>


        </div>
      </Dialog>


      <Dialog
        open={openL}
        onClose={handleCloseL}
      >

        <div style={{ display: 'flex', flexDirection: 'column', width: 500 }}>

          <div style={{ backgroundColor: '#243D25', padding: '10px' }}>
            <Typography variant='h6' style={{ textAlign: 'center', color: 'white' }}> {btnName} </Typography>
          </div>

          <div style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant='subtitle1' > First Name</Typography>
            <TextField value={createUserL.first_name} onChange={(e) => handleFirstName(e)} variant='outlined' placeholder='Enter First Name' />
          </div>

          <div style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant='subtitle1' > Last Name</Typography>
            <TextField value={createUserL.last_name} onChange={(e) => handleLastName(e)} variant='outlined' placeholder='Enter Last Name' />
          </div>

          <div style={{ padding: '10px', display: 'flex', flexDirection: 'column' }}>
            <Typography variant='subtitle1' > Email ID</Typography>
            <TextField value={createUserL.email} onChange={(e) => handleEmail(e)} variant='outlined' placeholder='Enter Email ID' />
          </div>


          <Button style={{ backgroundColor: '#243D25', borderRadius: 0, padding: '10px' }} variant='contained' onClick={() => handleCreateUserLocal()} > {btnName} </Button>


        </div>
      </Dialog>

    </div>


  );
}

export default App;
