/* OSEG Seguros — Site de homologação | sem rastreamento ou armazenamento de dados */
(()=>{'use strict';
const $=(s)=>document.querySelector(s);
const $$=(s)=>[...document.querySelectorAll(s)];
// Abre a página principal no início; preserva links diretos para seções com #âncora.
if ('scrollRestoration' in history) history.scrollRestoration='manual';
function resetInitialScroll(){
  if (!window.location.hash){
    const root=document.documentElement;
    const previous=root.style.scrollBehavior;
    root.style.scrollBehavior='auto';
    window.scrollTo(0,0);
    root.style.scrollBehavior=previous;
  }
}
window.addEventListener('pageshow',resetInitialScroll);
window.addEventListener('load',resetInitialScroll);
const WHATSAPP='5511965121140'; // Link de cotação publicado no site oficial da OSEG (validar com a equipe).
const menu=$('#mainNav'),toggle=$('#menuToggle'),overlay=$('#quoteOverlay'),form=$('#quoteForm');
const close=$('#closeQuote'),bar=$('#progressBar'),prev=$('#prevStep'),next=$('#nextStep'),send=$('#sendQuote');
let step=1,returnFocus=null;
$('#year').textContent=new Date().getFullYear();
toggle.addEventListener('click',()=>{const open=menu.classList.toggle('active');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');});
$$('#mainNav a').forEach(link=>link.addEventListener('click',()=>{menu.classList.remove('active');toggle.setAttribute('aria-expanded','false');}));
const insuranceOptions=()=>$$('input[name="insurance"]');
function changeStep(num){step=num;$$('.form-step').forEach(item=>{item.hidden=Number(item.dataset.step)!==num;});bar.style.width=(num*100/3)+'%';prev.hidden=num===1;next.hidden=num===3;send.hidden=num!==3;}
function openQuote(type){returnFocus=document.activeElement;form.reset();const found=insuranceOptions().find(input=>input.value===type);if(found)found.checked=true;changeStep(1);overlay.hidden=false;document.body.classList.add('modal-open');close.focus();}
function closeQuote(){overlay.hidden=true;document.body.classList.remove('modal-open');if(returnFocus&&typeof returnFocus.focus==='function')returnFocus.focus();}
$$('.open-quote').forEach(btn=>btn.addEventListener('click',()=>openQuote(btn.dataset.insurance)));
close.addEventListener('click',closeQuote);
overlay.addEventListener('click',event=>{if(event.target===overlay)closeQuote();});
document.addEventListener('keydown',event=>{if(overlay.hidden)return;if(event.key==='Escape')closeQuote();if(event.key==='Tab'){const focusables=$$('a[href],button:not([hidden]),input:not([type="hidden"])').filter(el=>overlay.contains(el)&&!el.closest('[hidden]')&&!el.disabled);const first=focusables[0],last=focusables[focusables.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}});
prev.addEventListener('click',()=>changeStep(Math.max(1,step-1)));
next.addEventListener('click',()=>{if(step===1){if(!form.elements.insurance.value){alert('Selecione um tipo de seguro.');return;}changeStep(2);form.elements.name.focus();return;}
if(step===2){for(const field of [form.elements.name,form.elements.phone,form.elements.consent]){if(!field.reportValidity())return;}const phone=form.elements.phone.value.replace(/\D/g,'');if(phone.length<10||phone.length>11){form.elements.phone.setCustomValidity('Informe um telefone com DDD (10 ou 11 dígitos).');form.elements.phone.reportValidity();return;}form.elements.phone.setCustomValidity('');
const data={insurance:form.elements.insurance.value,name:form.elements.name.value.trim(),phone:form.elements.phone.value.trim(),city:form.elements.city.value.trim()||'Não informada'};
const summary=$('#quoteSummary');summary.replaceChildren();Object.entries({Seguro:data.insurance,Nome:data.name,WhatsApp:data.phone,Cidade:data.city}).forEach(([label,value])=>{const line=document.createElement('div');const bold=document.createElement('strong');bold.textContent=label+': ';line.append(bold,document.createTextNode(value));summary.append(line);});
const message=['Olá, OSEG! Gostaria de solicitar uma cotação.','', 'Seguro: '+data.insurance,'Nome: '+data.name,'Telefone: '+data.phone,'Cidade: '+data.city].join('\n');send.href='https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(message);changeStep(3);send.focus();}});
form.elements.phone.addEventListener('input',()=>form.elements.phone.setCustomValidity(''));
})();
