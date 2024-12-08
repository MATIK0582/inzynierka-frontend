import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import CalendarView from '../../features/Calendar/Calendar';
import './HomePage.scss';

const HomePage: React.FC = () => {
    return (
        <div className="home-page">
            <Navbar />
            <main className="main-content">
                <CalendarView />
            </main>
        </div>
    );
};

export default HomePage;
