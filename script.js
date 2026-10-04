const state={balance:125430.50,transactions:[{name:"Зарплата",date:"Сегодня, 10:42",amount:2500,icon:"↑"},{name:"Магазин",date:"Сегодня, 09:18",amount:-890,icon:"🛒"},{name:"Такси",date:"Вчера, 21:04",amount:-350,icon:"🚕"},{name:"Кофе",date:"Вчера, 15:30",amount:-240,icon:"☕"},{name:"Перевод",date:"28 сентября",amount:1500,icon:"↗"}]};
const balanceEl=document.getElementById("balance"),txEl=document.getElementById("transactions"),modal=document.getElementById("modal"),modalTitle=document.getElementById("modalTitle"),modalBody=document.getElementById("modalBody");
function money(n){return Math.abs(n).toLocaleString("ru-RU",{minimumFractionDigits:2,maximumFractionDigits:2})+" ₽"}
function render(){balanceEl.textContent=state.balance.toLocaleString("ru-RU",{minimumFractionDigits:2,maximumFractionDigits:2})+" ₽";txEl.innerHTML=state.transactions.map(t=>`<div class="tx"><div class="tx-icon">${t.icon}</div><div class="tx-main"><div class="tx-name">${t.name}</div><div class="tx-date">${t.date}</div></div><div class="tx-amount ${t.amount>0?"plus":""}">${t.amount>0?"+":"−"}${money(t.amount)}</div></div>`).join("")}
function openModal(t,h){modalTitle.textContent=t;modalBody.innerHTML=h;modal.classList.remove("hidden")}
function closeModal(){modal.classList.add("hidden")}
document.getElementById("closeModal").onclick=closeModal;modal.onclick=e=>{if(e.target===modal)closeModal()};
function operation(type){
 if(type==="transfer")openModal("Перевод",`<div class="form"><input id="recipient" placeholder="Телефон или номер карты"><input id="amount" type="number" min="1" placeholder="Сумма, ₽"><button class="primary" id="doTransfer">Перевести</button></div>`);
 else if(type==="topup")openModal("Пополнение",`<div class="form"><input id="topAmount" type="number" min="1" placeholder="Сумма, ₽"><button class="primary" id="doTopup">Пополнить</button><div class="notice">Sandbox: реальные деньги не списываются.</div></div>`);
 else if(type==="pay")openModal("Оплата",`<div class="form"><input id="payName" placeholder="Получатель"><input id="payAmount" type="number" min="1" placeholder="Сумма, ₽"><button class="primary" id="doPay">Оплатить</button></div>`);
 else if(type==="details")openModal("Реквизиты",`<div class="notice">TOR Bank Demo<br><br>Счёт: 40817 0000 0000 4821<br>БИК: DEMO0000000<br><br><b>Демонстрационные реквизиты.</b></div>`);
 else if(type==="profile")openModal("Профиль",`<div class="notice"><b>Матвей Б.</b><br><br>Безопасность: включена<br>Устройство: iPhone<br>Статус: sandbox</div>`);
 else if(type==="cards")openModal("Карты",`<div class="bank-card"><div class="card-head"><strong>TOR</strong><span>DEBIT</span></div><div class="chip"></div><div class="card-num">•••• •••• •••• 4821</div><div class="card-foot"><span>MATVEY B.</span><span>TOR PAY</span></div></div>`);
 else if(type==="history")openModal("История",txEl.outerHTML);
}
document.querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>operation(b.dataset.action));
document.getElementById("profileBtn").onclick=()=>operation("profile");
document.getElementById("hideBalance").onclick=()=>{balanceEl.dataset.hidden=balanceEl.dataset.hidden==="1"?"0":"1";balanceEl.textContent=balanceEl.dataset.hidden==="1"?"••••••••":"125 430,50 ₽"};
document.querySelectorAll("[data-nav]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-nav]").forEach(x=>x.classList.remove("active"));b.classList.add("active");if(b.dataset.nav==="profile")operation("profile");if(b.dataset.nav==="cards")operation("cards");if(b.dataset.nav==="payments")operation("transfer")});
document.addEventListener("click",e=>{
 if(e.target.id==="doTransfer"){let a=Number(document.getElementById("amount").value);if(!a||a<=0)return alert("Введите сумму");if(a>state.balance)return alert("Недостаточно средств");state.balance-=a;state.transactions.unshift({name:"Перевод",date:"Только что",amount:-a,icon:"↗"});render();closeModal()}
 if(e.target.id==="doTopup"){let a=Number(document.getElementById("topAmount").value);if(!a||a<=0)return alert("Введите сумму");state.balance+=a;state.transactions.unshift({name:"Пополнение sandbox",date:"Только что",amount:a,icon:"＋"});render();closeModal()}
 if(e.target.id==="doPay"){let n=document.getElementById("payName").value.trim()||"Оплата",a=Number(document.getElementById("payAmount").value);if(!a||a<=0)return alert("Введите сумму");if(a>state.balance)return alert("Недостаточно средств");state.balance-=a;state.transactions.unshift({name:n,date:"Только что",amount:-a,icon:"⌁"});render();closeModal()}
});
render();