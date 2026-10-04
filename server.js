import express from "express";
import cors from "cors";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const app=express(), PORT=Number(process.env.PORT||3000);
app.use(helmet());
app.use(cors({origin:process.env.CORS_ORIGIN||"http://localhost:5500"}));
app.use(express.json({limit:"100kb"}));
const user={id:"demo-user",name:"Матвей Б.",phone:"+70000000000"};
const account={id:"acc-demo-001",currency:"RUB",balance:125430.50};
const tx=[{id:"tx-1",type:"credit",name:"Зарплата",amount:2500,createdAt:new Date().toISOString()},
{id:"tx-2",type:"debit",name:"Магазин",amount:890,createdAt:new Date().toISOString()}];
function auth(req,res,next){
 const h=req.headers.authorization||"", t=h.startsWith("Bearer ")?h.slice(7):null;
 if(!t)return res.status(401).json({error:"unauthorized"});
 try{req.auth=jwt.verify(t,process.env.JWT_SECRET||"dev-secret");next()}
 catch{return res.status(401).json({error:"invalid_token"})}
}
app.get("/api/health",(q,s)=>s.json({ok:true,mode:"sandbox"}));
app.post("/api/auth/demo-login",(q,s)=>{
 const token=jwt.sign({sub:user.id},process.env.JWT_SECRET||"dev-secret",{expiresIn:"15m"});
 s.json({accessToken:token,user});
});
app.get("/api/me",auth,(q,s)=>s.json(user));
app.get("/api/accounts",auth,(q,s)=>s.json([account]));
app.get("/api/transactions",auth,(q,s)=>s.json(tx));
app.post("/api/transfers",auth,(q,s)=>{
 const amount=Number(q.body.amount), recipient=String(q.body.recipient||"");
 if(!recipient||!Number.isFinite(amount)||amount<=0)return s.status(400).json({error:"invalid_transfer"});
 if(amount>account.balance)return s.status(400).json({error:"insufficient_funds"});
 account.balance-=amount;
 const item={id:"tx-"+Date.now(),type:"debit",name:"Перевод",recipient,amount,createdAt:new Date().toISOString()};
 tx.unshift(item); s.status(201).json({ok:true,transaction:item,account});
});
app.post("/api/topups",auth,(q,s)=>{
 const amount=Number(q.body.amount);
 if(!Number.isFinite(amount)||amount<=0)return s.status(400).json({error:"invalid_amount"});
 account.balance+=amount;
 const item={id:"tx-"+Date.now(),type:"credit",name:"Пополнение sandbox",amount,createdAt:new Date().toISOString()};
 tx.unshift(item); s.status(201).json({ok:true,transaction:item,account});
});
app.listen(PORT,()=>console.log("TOR Bank API: http://localhost:"+PORT));
