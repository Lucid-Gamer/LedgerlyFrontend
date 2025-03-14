import React, { useEffect, useState } from 'react';
import ResidentService from '../../../service/ResidentService';
import { Table, Container, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../../css/DisplayResidents.css"
import { useNavigate } from 'react-router-dom';

const DisplayResidents = () => {
    const [residents, setResidents] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [apartments, setApartments] = useState([]);

    const token = localStorage.getItem("token");

    const navigate = useNavigate()

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await ResidentService.getAllResidents();
                setResidents(response.respObject.aptmntOccpntList);
                setBuildings(response.respObject.bldngList);
                setApartments(response.respObject.aptmntMstList);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (token) {
            fetchData();
        }
    }, []);

    const handleView = (aptmntId) => {
        navigate(`/view-resident/${aptmntId}`);
    }



    return (
        <div className="display-residents-main-container">
            <Container className="display-residents-table-container">
                <h2 className="text-center text-white my-4">Residents List</h2>
                
                <div className="display-residents-table-wrapper">
                    <Table striped bordered hover responsive="lg" className="custom-display-residents-table">
                        <thead>
                            <tr>
                                <th>Apartment No</th>
                                <th>Apartment Description</th>
                                <th>Occupant Name</th>
                                <th>Occupant Type</th>
                                <th>Building Name</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {residents.map((resident) => {
                                const apartment = apartments.find(ap => ap.aptmntId === resident.aptmnt.aptmntId);
                                const building = buildings.find(b => b.bldngId === (apartment ? apartment.bldngId : null));

                                return (
                                    <tr key={resident.occupantId}>
                                        <td>{apartment ? apartment.aptmntNo : 'Unknown'}</td>
                                        <td>{apartment ? apartment.aptmntDesc : 'No Description'}</td>
                                        <td>{resident.occupantName}</td>
                                        <td>{resident.occupantType}</td>
                                        <td>{building ? building.buildingName : 'Unknown'}</td>
                                        <td>
                                            <Button
                                                variant='outline-primary'
                                                onClick={() => (handleView(apartment ? apartment.aptmntId : ''))}
                                            >
                                                View More
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </div>
            </Container>
        </div>
    );
};

export default DisplayResidents;
