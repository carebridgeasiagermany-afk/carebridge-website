(() => {
 const select=document.querySelector('#fee-currency'), status=document.querySelector('#currency-status'), refresh=document.querySelector('#currency-refresh');
 if(!select)return;
 const currencies={INR:'Indian rupee',LKR:'Sri Lankan rupee',VND:'Vietnamese dong',CNY:'Chinese yuan',NPR:'Nepalese rupee',BDT:'Bangladeshi taka',PKR:'Pakistani rupee',BTN:'Bhutanese ngultrum',MVR:'Maldivian rufiyaa',SGD:'Singapore dollar',MYR:'Malaysian ringgit',IDR:'Indonesian rupiah',PHP:'Philippine peso',THB:'Thai baht',KHR:'Cambodian riel',LAK:'Lao kip',MMK:'Myanmar kyat',JPY:'Japanese yen',KRW:'South Korean won',HKD:'Hong Kong dollar',TWD:'New Taiwan dollar',MOP:'Macanese pataca',MNT:'Mongolian tugrik',AED:'UAE dirham',SAR:'Saudi riyal',QAR:'Qatari riyal',KWD:'Kuwaiti dinar',BHD:'Bahraini dinar',OMR:'Omani rial'};
 for(const [code,name] of Object.entries(currencies)){const option=document.createElement('option');option.value=code;option.textContent=code+' — '+name;select.append(option);}
 let chosen='EUR', data=null, request=0;
 try{const saved=localStorage.getItem('medcare-currency');if(saved==='EUR'||currencies[saved])chosen=saved;}catch{}
 select.value=chosen;
 const formatter=code=>new Intl.NumberFormat('en-US',{style:'currency',currency:code,currencyDisplay:'code'});
 function render(){const rate=chosen==='EUR'?1:data?.rates?.[chosen];document.querySelectorAll('[data-eur]').forEach(el=>{const value=Number(el.dataset.eur);el.textContent=formatter(rate?chosen:'EUR').format(value*(rate||1));});}
 function markPrices(root){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[];while(walker.nextNode()){const n=walker.currentNode;if(!n.parentElement.closest('[data-eur],.currency-tools,script,style')&&/€(?:30|10|15|60)\b/.test(n.nodeValue))nodes.push(n);}
  for(const node of nodes){const fragment=document.createDocumentFragment();let last=0;for(const m of node.nodeValue.matchAll(/€(30|10|15|60)\b/g)){fragment.append(document.createTextNode(node.nodeValue.slice(last,m.index)));const span=document.createElement('span');span.dataset.eur=m[1];fragment.append(span);last=m.index+m[0].length;}fragment.append(document.createTextNode(node.nodeValue.slice(last)));node.replaceWith(fragment);}
  render();
 }
 markPrices(document.querySelector('main'));
 // Journey panels are replaced when visitors choose a step.
 const journey=document.querySelector('#step-panel');if(journey)new MutationObserver(records=>{if(records.some(r=>[...r.addedNodes].some(n=>n.nodeType===1&&n.matches?.('div.panel-top'))))markPrices(journey);}).observe(journey,{childList:true});
 async function update(force=false){
  const id=++request;chosen=select.value;try{localStorage.setItem('medcare-currency',chosen);}catch{}
  if(chosen==='EUR'){render();status.textContent='Base fees in EUR: initial 30, follow-up 10, group 15 per person.';refresh.disabled=false;return;}
  status.textContent='Loading the latest available exchange rates…';refresh.disabled=true;
  try{
   if(force||!data||Date.now()-data.fetchedAt>3600000){
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),10000);
    try{const response=await fetch('https://open.er-api.com/v6/latest/EUR',{signal:controller.signal});if(!response.ok)throw Error('HTTP');const result=await response.json();if(result.result!=='success'||result.base_code!=='EUR'||!Number.isFinite(result.time_last_update_unix))throw Error('Invalid rates');data={...result,fetchedAt:Date.now()};}finally{clearTimeout(timer);}
   }
   if(id!==request)return;
   const rate=data.rates?.[chosen];if(!Number.isFinite(rate)||rate<=0)throw Error('Unavailable currency');
   render();const date=new Date(data.time_last_update_unix*1000).toISOString().slice(0,10);
   const stale=Date.now()-data.time_last_update_unix*1000>48*3600000;
   status.textContent=(stale?'Older published rate — ':'Daily reference rate — ')+date+' (UTC): 1 EUR = '+new Intl.NumberFormat('en-US',{maximumFractionDigits:4}).format(rate)+' '+chosen+'. Estimates, not a guaranteed payment rate.';
  }catch{if(id!==request)return;data=null;render();status.textContent='Exchange rates could not be loaded. Fees remain in EUR. Please try Refresh rates.';}
  finally{if(id===request)refresh.disabled=false;}
 }
 select.addEventListener('change',()=>update());refresh.addEventListener('click',()=>update(true));update();
})();
