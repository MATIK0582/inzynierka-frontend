import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Groups from '../../features/Groups/Groups';
import './GroupPage.scss';

const GroupPage: React.FC = () => {
    return (
        <div className="group-page">
            <Navbar />
            <main className="main-content">
                <Groups />
            </main>
        </div>
    );
};

export default GroupPage;
