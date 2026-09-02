import React,{useEffect,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import toast,{Toaster} from 'react-hot-toast';
import App from './App';
import './index.css';

export const API='http://localhost:5000/api';
export async function api(path,options={}){const token=localStorage.getItem('sfm_token');const headers={'Content-Type':'application/json',...(options.headers||{})};if(token)headers.Authorization=`Bearer ${token}`;const res=await fetch(`${API}${path}`,{...options,headers});const data=await res.json().catch(()=>({}));if(!res.ok)throw new Error(data.message||'Request failed');return data;}

function Root(){const [user,setUser]=useState(null);const [loading,setLoading]=useState(true);useEffect(()=>{const t=localStorage.getItem('sfm_token');if(!t){setLoading(false);return}api('/auth/profile').then(d=>setUser(d.user)).catch(()=>localStorage.removeItem('sfm_token')).finally(()=>setLoading(false))},[]);if(loading)return <div className="min-h-screen grid place-items-center bg-[#f6f9fe]"><div className="text-center"><div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600"/><p className="text-sm text-slate-500">Loading workspace…</p></div></div>;return <App user={user} setUser={setUser}/>}

createRoot(document.getElementById('root')).render(<BrowserRouter><Root/><Toaster position="top-right"/></BrowserRouter>);
