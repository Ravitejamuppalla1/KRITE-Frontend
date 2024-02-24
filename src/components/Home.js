import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { asyncGetTasks, asyncCreateTask, asyncEditTask, asyncDeleteTask } from '../actions/tasksActions';
import InputAdornment from '@material-ui/core/InputAdornment';
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Grid,
    Button,
    Modal,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton
} from '@material-ui/core';
import Swal from 'sweetalert2';

const Home = (props) => {
    const [tasksdata, setTasksData] = useState()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isedit, setIsEdit] = useState(false)
    const [editid, setEditId] = useState('')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [showdates, setshowdates] = useState(false)
    const [formErrors, setformErrors] = useState({})
    const errors = {}


    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(asyncGetTasks());
    }, []);

    const tasksDataFromRedux = useSelector((state) => state.tasks);

    useEffect(() => {
        setTasksData(tasksDataFromRedux);
    }, [tasksDataFromRedux]);

    const handlelogout = () => {
        localStorage.removeItem('token')
        Swal.fire('Successfully logged out');
        props.history.push('/login');
    };

    const handleModalOpen = () => {
        if (!isedit) {
            setTitle('')
            setDescription('')
            setDueDate('')

        }
        setIsModalOpen(true);
    }

    const handleModalClose = () => {
        setformErrors({})
        setIsEdit(false)
        setIsModalOpen(false);
    }

    const handleTitleChange = (e) => {
        setTitle(e.target.value)
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value)
    }

    const handleDueDateImageClick = () => {
        setshowdates(true);
    };

    const handleDueDateChange = (date) => {
        setDueDate(date);
        setshowdates(false);
    };

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };


    const runValidations = () => {
        if (title.length === 0) {
            errors.title = 'Title cannot be blank'
        }
        if (description.length === 0) {
            errors.description = 'Description cannot be blank'
        }
        if (dueDate.length === 0) {
            errors.dueDate = 'Due Date cannot be blank'
        }

    }


    const handleAddTask = (e) => {

        e.preventDefault()
        runValidations()
        if (Object.keys(errors).length === 0) {
            setformErrors({})
            let taskdetails = {
                title,
                description,
                dueDate: dueDate ? dueDate.toISOString().substring(0, 10) : '', // Format date to 'YYYY-MM-DD'

            }
            const reset = () => {
                setTitle('')
                setDescription('')
                setDueDate('')
            }

            if (isedit) {
                dispatch(asyncEditTask(editid, taskdetails, reset, setIsEdit))
                setEditId('')
                handleModalClose()
            }
            else {
                dispatch(asyncCreateTask(taskdetails, reset))
                handleModalClose();
            }
        }
        else {
            setformErrors(errors)
        }

    };

    const handleEdit = (data) => {
        setIsEdit(true)
        setEditId(data._id)
        handleModalOpen()
        setTitle(data.title)
        setDescription(data.description)
        setDueDate(new Date(data.dueDate));


    }

    const handleDeleteTask = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {

                dispatch(asyncDeleteTask(id))
            }
        })
    }

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Grid container spacing={10} alignItems="center">
                        <Grid item>
                            <Typography variant="h6" style={{ cursor: 'pointer' }}>
                                Home
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography
                                variant="h6"
                                onClick={handlelogout}
                                style={{ cursor: 'pointer' }}
                            >
                                Logout
                            </Typography>
                        </Grid>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Container>
                <Grid
                    container
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginTop: '110px',
                    }}
                >
                    <Grid item>
                        <Typography variant="h5" style={{ color: '#3944BC' }}>
                            Lists of Tasks
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="contained"
                            color="primary"
                            style={{ backgroundColor: '#3944BC', marginLeft: '950px' }}
                            onClick={handleModalOpen}
                        >
                            Add Task
                        </Button>
                    </Grid>
                </Grid>

                <TableContainer component={Paper} style={{ marginTop: '50px' }}>
                    <Table>
                        <TableHead style={{ backgroundColor: '#f8f8ff' }}>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Due Date</TableCell>
                                <TableCell>Edit</TableCell>
                                <TableCell>Delete</TableCell>

                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tasksdata?.data.map((task) => (
                                <TableRow key={task.taskId}>
                                    <TableCell>{task.title}</TableCell>
                                    <TableCell>{task.description}</TableCell>
                                    <TableCell>{task.dueDate}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => { handleEdit(task) }} >
                                            <EditIcon style={{ color: '#3944BC', fontSize: '18px' }} />
                                        </IconButton>
                                    </TableCell>

                                    <TableCell>
                                        <IconButton onClick={() => { handleDeleteTask(task._id) }}>
                                            <DeleteIcon style={{ color: '#3944BC', fontSize: '18px' }} />
                                        </IconButton>
                                    </TableCell>

                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Modal open={isModalOpen} onClose={handleModalClose}>
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            backgroundColor: '#fff',
                            padding: 20,
                            borderRadius: 8,
                        }}
                    >
                        <img
                            src={require('../images/XFrame.png')}
                            alt="Close Image"
                            style={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                cursor: 'pointer',
                            }}
                            onClick={handleModalClose}
                        />
                        <Typography variant="h6" style={{ marginLeft: '140px' }}>{isedit ? 'Edit Task' : 'Add Task'}</Typography>
                        <form>
                            <TextField
                                label="Title"
                                fullWidth
                                margin="normal"
                                name="title"
                                value={title}
                                onChange={handleTitleChange}
                            />
                            {formErrors.title && <span style={{ color: "red" }}>{formErrors.title}</span>}

                            <TextField
                                label="Description"
                                fullWidth
                                margin="normal"
                                name="description"
                                value={description}
                                onChange={handleDescriptionChange}
                            />
                            {formErrors.description && <span style={{ color: "red" }}>{formErrors.description}</span>}

                            <TextField
                                label="Due Date"
                                fullWidth
                                margin="normal"
                                name="due date"
                                value={dueDate ? formatDate(dueDate) : ''}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <img
                                                src={require('../images/Frame.png')}
                                                alt="Calendar Image"
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    cursor: 'pointer',
                                                }}
                                                onClick={handleDueDateImageClick}
                                            />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {formErrors.dueDate && <span style={{ color: "red" }}>{formErrors.dueDate}</span>}

                            <Modal
                                open={showdates}
                                aria-labelledby="modal-modal-title"
                                aria-describedby="modal-modal-description"
                                style={{
                                    position: 'absolute',
                                    top: 'calc(100% - 300px)',
                                    left: '730px',


                                }}

                            >
                                <div>
                                    <ReactDatePicker
                                        selected={dueDate}
                                        onChange={handleDueDateChange}
                                        minDate={new Date()}
                                        inline
                                    />
                                </div>
                            </Modal>

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddTask}
                                style={{ marginLeft: '140px', marginTop: '20px' }}
                            >
                                {isedit ? 'Edit Task' : 'Add Task'}
                            </Button>
                        </form>
                    </div>
                </Modal>
            </Container>
        </div>
    );
};

export default Home;
