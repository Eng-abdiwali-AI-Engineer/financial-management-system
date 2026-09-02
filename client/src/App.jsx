import React,{useEffect,useState} from 'react';
import {Routes,Route,Navigate,useLocation,useNavigate} from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Banking from './pages/Banking';
import Reports from './pages/Reports';
import Taxes from './pages/Taxes';
import Invoices from './pages/Invoices';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import Layout from './components/Layout';

function Protected({user,children}){return user?children:<Navigate to="/login" replace/>}
 function AdminOnly({user,children}){return user?.role==='Administrator'?children:<Navigate to="/dashboard" replace/>}
export default function App({user,setUser}){return <Routes><Route path="/login" element={user?<Navigate to="/dashboard" replace/>:<Login onLogin={setUser}/>}/><Route path="/" element={<Navigate to={user?'/dashboard':'/login'} replace/>}/><Route path="*" element={<Protected user={user}><Layout user={user} setUser={setUser}><Routes><Route path="/dashboard" element={<Dashboard/>}/><Route path="/invoices" element={<Invoices/>}/><Route path="/sales" element={<Transactions type="sale" title="Sales"/>}/><Route path="/purchases" element={<Transactions type="purchase" title="Purchases"/>}/><Route path="/expenses" element={<Transactions type="expense" title="Expenses"/>}/><Route path="/banking" element={<Banking/>}/><Route path="/reports" element={<Reports/>}/><Route path="/taxes" element={<Taxes/>}/><Route path="/settings" element={<Settings user={user} setUser={setUser}/>}/><Route path="/admin" element={<AdminOnly user={user}><Admin user={user}/></AdminOnly>}/><Route path="*" element={<Navigate to="/dashboard" replace/>}/></Routes></Layout></Protected>}/></Routes>}
