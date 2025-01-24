import React from 'react';
import { Layout } from 'antd';
import './Header.css'; 
import logo from '../../assets/img/previred-logo-login.png';

const { Header } = Layout;

const CustomHeader = () => {
  return (
    <Header className="custom-header">
      <div className="custom-header__logo">
        <img src={logo} alt="PREVIRED" />
      </div>
    </Header>
  );
};

export default CustomHeader;