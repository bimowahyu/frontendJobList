import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

import './users.css';

const getApiBaseUrl = () => {
    const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
    const baseUrl = process.env.REACT_APP_API_BASE_URL.replace(/^https?:\/\//, '');
    return `${protocol}://${baseUrl}`;
};

export const Users = () => {
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState({ name: '', username: '', role: '' });
    const [newUser, setNewUser] = useState({ name: '', username: '', password: '', confpassword: '', role: '' });
    const [selectedUuid, setSelectedUuid] = useState('');

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const response = await axios.get(`${getApiBaseUrl()}/users`, { withCredentials: true });
            setUsers(response.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const deleteUsers = async (uuid) => {
        try {
            await axios.delete(`${getApiBaseUrl()}/deleteUsers/${uuid}`, { withCredentials: true });
            setUsers(users.filter(user => user.uuid !== uuid));
        } catch (error) {
            console.error('Data gagal dihapus', error);
        }
    };

    const modalEdit = (item) => {
        setEditUser({
            name: item.name,
            username: item.username,
            role: item.role
        });
        setSelectedUuid(item.uuid);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setEditUser({ name: '', username: '', role: '' });
    };

    const handleAddClose = () => {
        setShowAddModal(false);
        setNewUser({ name: '', username: '', password: '', confpassword: '', role: '' });
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        if (newUser.password !== newUser.confpassword) {
            alert("Password dan Konfirmasi Password tidak sesuai");
            return;
        }
        try {
            await axios.post(`${getApiBaseUrl()}/createUsers`, newUser, { withCredentials: true });
            handleAddClose();
            getUsers();
        } catch (error) {
            console.error('Gagal menambah pengguna baru', error);
        }
    };

    const updateUsers = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${getApiBaseUrl()}/updateUsers/${selectedUuid}`, editUser, { withCredentials: true });
            handleClose();
            getUsers();
        } catch (error) {
            console.error('Gagal mengupdate data', error);
        }
    };

    return (
        <div className="data-container">
        <div className="data-kunjungan-container">
            <h2>Data Pengguna</h2>
            <Button variant="success" onClick={() => setShowAddModal(true)}>
                <FontAwesomeIcon icon={faPlus} /> Tambah Pengguna
            </Button>
            <Table striped bordered hover className="data-table mt-3">
                <thead>
                    <tr>
                        <th>No</th>
                        <th>Nama</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user.uuid}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>
                                <Button variant="info" size="sm" onClick={() => modalEdit(user)}>
                                    <FontAwesomeIcon icon={faEdit} /> Edit
                                </Button>{' '}
                                <Button variant="danger" size="sm" onClick={() => deleteUsers(user.uuid)}>
                                    <FontAwesomeIcon icon={faTrash} /> Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* Modal for Add User */}
            {/* <Modal 
                show={showAddModal} 
                onHide={handleAddClose} 
                centered 
                backdrop="static"
                keyboard={false}
            > */}
             <Modal 
        show={showAddModal} 
        onHide={handleAddClose} 
        centered
        backdrop="static"
        keyboard={false}
        style={{ zIndex: 1050 }} 
      >
                <Modal.Header closeButton>
                    <Modal.Title>Tambah Pengguna Baru</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddUser}>
                        <Form.Group controlId="formNewName">
                            <Form.Label>Nama</Form.Label>
                            <Form.Control
                                type="text"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formNewUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={newUser.username}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formNewPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formNewConfPassword">
                            <Form.Label>Konfirmasi Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={newUser.confpassword}
                                onChange={(e) => setNewUser({ ...newUser, confpassword: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formNewRole">
                            <Form.Label>Role</Form.Label>
                            <Form.Control
                                as="select"
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                required
                            >
                                <option value="">Pilih Role</option>
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </Form.Control>
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Tambah Pengguna
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Modal for Edit User */}
            {/* <Modal 
                show={showModal} 
                onHide={handleClose} 
                centered 
                backdrop="static"
                keyboard={false}
            > */}
             <Modal 
        show={showModal} 
        onHide={handleClose} 
        centered
        backdrop="static"
        keyboard={false}
        style={{ zIndex: 1050 }} 
      >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Data Pengguna</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={updateUsers}>
                        <Form.Group controlId="formName">
                            <Form.Label>Nama</Form.Label>
                            <Form.Control
                                type="text"
                                value={editUser.name}
                                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={editUser.username}
                                onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formRole">
                            <Form.Label>Role</Form.Label>
                            <Form.Control
                                type="text"
                                value={editUser.role}
                                onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Simpan Perubahan
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
        </div>
    );
};
