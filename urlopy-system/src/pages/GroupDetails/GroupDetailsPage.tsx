import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import GroupDetails from '../../features/GroupDetails/GroupDetails';
import { useParams } from 'react-router-dom';
import './GroupDetailsPage.scss';

const GroupDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    console.log('ID grupy:', id); // Log ID

    return (
        <div className="group-details-page">
            <Navbar />
            <main className="main-content">
                {id ? (
                    <GroupDetails groupId={id} />
                ) : (
                    <p>Nie znaleziono ID grupy.</p>
                )}
            </main>
        </div>
    );
};

export default GroupDetailsPage;
