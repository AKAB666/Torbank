const state = {
  balance: 125430.50,
  transactions: [
    {name:"Зарплата", date:"Сегодня, 10:42", amount:2500, icon:"↑"},
    {name:"Магазин", date:"Сегодня, 09:18", amount:-890, icon:"🛒"},
    {name:"Такси", date:"Вчера, 21:04", amount:-350, icon:"🚕"},
    {name:"Кофе", date:"Вчера, 15:30", amount:-240, icon:"☕"},
    {name:"Перевод", date:"28 сентября", amount:1500, icon:"↗"}
  ]
};

const balanceEl = document.getElementById("balance");
const txEl = document.getElementById("transactions");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");

function money(n){
  return n.toLocaleString("ru-RU",{minimumFractionDigits:2,maximumFractionDigits:2})+" ₽";
}
function render(){
  balanceEl.textContent = money(state.balance);
  txEl.innerHTML = state.transactions.map(t => `
    <div class="tx">
      <div class="tx-icon">${t.icon}</div>
      <div class="tx-main"><div class="tx-name">${t.name}</div><div class="tx-date">${t.date}</div></div>
      <div class="tx-amount ${t.amount>0?"plus":""}">${t.amount>0?"+":""}${money(t.amount)}</div>
    </div>`).join("");
}
function openModal(title, html){
  modalTitle.textContent = title;
  modalBody.innerHTML = html;
  modal.classList.remove("hidden");
}
function closeModal(){modal.classList.add("hidden")}
document.getElementById("closeModal").onclick=closeModal;
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});

function operation(type){
  if(type==="transfer"){
    openModal("Перевод", `<div class="form">
      <input id="recipient" placeholder="Телефон получателя">
      <input id="amount" type="number" min="1" placeholder="Сумма, ₽">
      <button class="primary" id="doTransfer">Перевести</button>
    </div>`);
    document.getElementById("doTransfer").onclick=()=>{
      const amount=Number(document.getElementById("amount").value);
      if(!amount || amount<=0) return alert("Введите сумму");
      if(amount>state.balance) return alert("Недостаточно средств");
      state.balance-=amount;
      state.transactions.unshift({name:"Перевод",date:"Только что",amount:-amount,icon:"↗"});
      render(); closeModal();
    };
  } else if(type==="topup"){
    openModal("Пополнение", `<div class="form">
      <input id="topAmount" type="number" min="1" placeholder="Сумма, ₽">
      <button class="primary" id="doTopup">Пополнить</button>
      <div class="notice">Демо-режим: пополнение не связано с реальным банком и реальными деньгами.</div>
    </div>`);
    document.getElementById("doTopup").onclick=()=>{
      const amount=Number(document.getElementById("topAmount").value);
      if(!amount || amount<=0) return alert("Введите сумму");
      state.balance+=amount;
      state.transactions.unshift({name:"Пополнение",date:"Только что",amount,icon:"＋"});
      render(); closeModal();
    };
  } else if(type==="pay"){
    openModal("Оплата", `<div class="form">
      <input id="payName" placeholder="Название получателя">
      <input id="payAmount" type="number" min="1" placeholder="Сумма, ₽">
      <button class="primary" id="doPay">Оплатить</button>
    </div>`);
    document.getElementById("doPay").onclick=()=>{
      const name=document.getElementById("payName").value.trim()||"Оплата";
      const amount=Number(document.getElementById("payAmount").value);
      if(!amount || amount<=0) return alert("Введите сумму");
      if(amount>state.balance) return alert("Недостаточно средств");
      state.balance-=amount;
      state.transactions.unshift({name,date:"Только что",amount:-amount,icon:"⌁"});
      render(); closeModal();
    };
  } else if(type==="details"){
    openModal("Реквизиты", `<div class="notice">
      Демо-счёт<br><br>
      Получатель: TOR Bank Demo<br>
      Счёт: 40817 0000 0000 4821<br>
      БИК: DEMO0000000<br><br>
      <b>Это демонстрационные реквизиты.</b>
    </div>`);
  } else if(type==="profile"){
    openModal("Профиль", `<div class="notice">
      <b>Матвей Б.</b><br><br>
      Безопасность: включена<br>
      Устройство: iPhone<br>
      Уведомления: включены
    </div>`);
  } else if(type==="cards"){
    openModal("Карты", `<div class="bank-card">
      <div class="card-row"><strong>TOR CARD</strong><span>VIRTUAL</span></div>
      <div class="card-number">•••• •••• •••• 4821</div>
      <div class="card-row bottom"><span>MATVEY B.</span><span>VISA</span></div>
    </div>`);
  } else if(type==="history"){
    openModal("История", txEl.outerHTML);
  }
}
document.querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>operation(b.dataset.action));
document.getElementById("profileBtn").onclick=()=>operation("profile");
document.querySelectorAll("[data-nav]").forEach(b=>b.onclick=()=>{
  document.querySelectorAll("[data-nav]").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  const n=b.dataset.nav;
  if(n==="profile") operation("profile");
  if(n==="cards") operation("cards");
  if(n==="payments") operation("transfer");
});
render();
