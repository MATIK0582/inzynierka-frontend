import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Profile from '../../features/Profile/Profile';
import './ProfilePage.scss';

const ProfilePage: React.FC = () => {
    return (
        <div className="home-page">
            <Navbar />
            <main className="main-content">
                <Profile />
            </main>
        </div>
    );
};

export default ProfilePage;
