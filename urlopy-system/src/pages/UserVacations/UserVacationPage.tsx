import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import UserVacations from '../../features/UserVacations/UserVacations';
import './UserVacationPage.scss';

const UserVacationsPage: React.FC = () => {
    return (
        <div className="home-page">
            <Navbar />
            <main className="main-content">
                <UserVacations />
            </main>
        </div>
    );
};

export default UserVacationsPage;
