import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {createClient} from '@supabase/supabase-js';

const supabase=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY);
const secret=process.env.JWT_SECRET||'dev-secret-change-me';
const json=async req=>{if(req.body)return typeof req.body==='string'?JSON.parse(req.body):req.body;return new Promise(resolve=>{let raw='';req.on('data',chunk=>raw+=chunk);req.on('end',()=>resolve(raw?JSON.parse(raw):{}))})};
const send=(res,status,data)=>res.status(status).json(data);
const auth=req=>{try{const value=req.headers.authorization||'';return jwt.verify(value.startsWith('Bearer ')?value.slice(7):'',secret)}catch{return null}};
const safe=user=>({id:user.id,name:user.name,email:user.email,role:user.role,company:user.company});
const table=async(name,query={})=>{let request=supabase.from(name).select(query.select||'*');if(query.eq)for(const [key,value] of Object.entries(query.eq))request=request.eq(key,value);if(query.order)request=request.order(query.order,{ascending:query.ascending??false});return request};
const fail=(res,error)=>send(res,500,{message:error.message||'Server error'});

export default async function handler(req,res){
  try{
    const path=req.url.split('?')[0].replace(/^\/api/,'')||'/';
    const body=await json(req);
    if(req.method==='GET'&&path==='/health')return send(res,200,{ok:true,service:'Smart Financial Management API'});
    if(req.method==='POST'&&path==='/auth/login'){
      const {email,password}=body;const {data:user}=await table('users',{eq:{email}});const found=user?.[0];
      if(!found||!bcrypt.compareSync(password,found.password))return send(res,401,{message:'Invalid email or password'});
      return send(res,200,{token:jwt.sign({id:found.id,email:found.email,role:found.role},secret,{expiresIn:'7d'}),user:safe(found)});
    }
    if(req.method==='POST'&&path==='/auth/signup'){
      const {name,email,password,company}=body;if(!name||!email||!password)return send(res,400,{message:'Name, email and password are required'});if(password.length<8)return send(res,400,{message:'Password must be at least 8 characters'});
      const {data:user,error}=await supabase.from('users').insert({name,email,password:bcrypt.hashSync(password,10),role:'User',company:company||'My Business'}).select().single();if(error)return send(res,error.code==='23505'?409:500,{message:error.code==='23505'?'An account with that email already exists':error.message});return send(res,201,{token:jwt.sign({id:user.id,email:user.email,role:user.role},secret,{expiresIn:'7d'}),user:safe(user)});
    }
    const current=auth(req);if(!current)return send(res,401,{message:'Unauthorized'});
    if(req.method==='GET'&&path==='/auth/profile'){const {data:user}=await table('users',{eq:{id:current.id}});return send(res,200,{user:safe(user[0])})}
    if(req.method==='PUT'&&path==='/auth/profile'){const {name,company}=body;const {data:user,error}=await supabase.from('users').update({name,company}).eq('id',current.id).select().single();if(error)throw error;return send(res,200,{user:safe(user)})}
    if(req.method==='PUT'&&path==='/auth/password'){const {currentPassword,newPassword}=body;const {data:user}=await table('users',{eq:{id:current.id}});if(!currentPassword||!newPassword)return send(res,400,{message:'Both passwords are required'});if(!bcrypt.compareSync(currentPassword,user[0].password))return send(res,401,{message:'Current password is incorrect'});await supabase.from('users').update({password:bcrypt.hashSync(newPassword,10)}).eq('id',current.id);return send(res,200,{ok:true})}
    if(path==='/transactions'&&(req.method==='GET'||req.method==='POST'||req.method==='PUT'||req.method==='DELETE')){
      if(req.method==='GET'){const {data}=await table('transactions',{eq:{user_id:current.id},order:'date'});return send(res,200,{transactions:data||[]})}
      if(req.method==='POST'){const {type,description,amount,category,date,reference}=body;const {data,error}=await supabase.from('transactions').insert({type,description,amount,category,date,reference:reference||'',user_id:current.id}).select('id').single();if(error)throw error;return send(res,201,{id:data.id})}
      const id=path.split('/')[2];if(req.method==='DELETE'){await supabase.from('transactions').delete().eq('id',id).eq('user_id',current.id);return send(res,200,{ok:true})}const {description,amount,category,date,reference}=body;const {error}=await supabase.from('transactions').update({description,amount,category,date,reference:reference||''}).eq('id',id).eq('user_id',current.id);if(error)throw error;return send(res,200,{ok:true});
    }
    if(req.method==='GET'&&path==='/dashboard'){const {data}=await table('transactions',{eq:{user_id:current.id}});const rows=data||[], revenue=rows.filter(x=>x.type==='sale').reduce((sum,x)=>sum+Number(x.amount),0),expenses=rows.filter(x=>x.type!=='sale').reduce((sum,x)=>sum+Number(x.amount),0);return send(res,200,{stats:{revenue,expenses,profit:revenue-expenses,margin:revenue?((revenue-expenses)/revenue)*100:0},income:[],expense:[],trend:[]})}
    if(req.method==='GET'&&path==='/banking'){const accounts=await table('accounts'),activity=await table('activity',{order:'date'});return send(res,200,{accounts:(await accounts).data||[],activity:(await activity).data||[]})}
    return send(res,404,{message:'Not found'});
  }catch(error){return fail(res,error)}
}