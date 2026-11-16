
document.querySelectorAll('[data-rating]').forEach((card) => {
  const which = card.dataset.rating;
  const group=card.querySelector('.choices');
  for(let n=0;n<=10;n++){
    const b=document.createElement('button');b.type='button';b.textContent=n;
    b.setAttribute('aria-label',`${which==='before'?'До':'После'}: ${n} из 10`);
    b.setAttribute('aria-pressed','false');
    b.addEventListener('click',()=>{
      card.dataset.value=String(n);
      group.querySelectorAll('button').forEach(q=>{q.classList.toggle('selected',q===b);q.setAttribute('aria-pressed',String(q===b));});
      card.querySelector('.rating-value').textContent=`${n}/10`;
      refreshRating();
    });group.appendChild(b);
  }
});
function refreshRating(){
  const before=document.querySelector('[data-rating="before"]')?.dataset.value;
  const after=document.querySelector('[data-rating="after"]')?.dataset.value;
  const out=document.querySelector('.rating-outcome');if(!out)return;
  if(before===undefined||after===undefined){out.textContent='Выберите две оценки, чтобы увидеть изменение.';return;}
  const delta=+before-(+after);
  if(delta>0)out.innerHTML=`Напряжение снизилось на <strong>${delta} ${delta===1?'балл':delta<5?'балла':'баллов'}</strong> (${before} → ${after}).`;
  else if(delta<0)out.textContent=`Напряжение выросло на ${-delta} (${before} → ${after}). Не все навыки подходят в любой момент — можно остановиться или выбрать другой.`;
  else out.textContent=`Оценка не изменилась (${before} → ${after}). Обратите внимание и на небольшие изменения в теле или ощущениях.`;
}
document.getElementById('resetRating')?.addEventListener('click',()=>{
  document.querySelectorAll('[data-rating]').forEach(card=>{delete card.dataset.value;card.querySelector('.rating-value').textContent='—';card.querySelectorAll('button').forEach(b=>{b.classList.remove('selected');b.setAttribute('aria-pressed','false');});});
  const out=document.querySelector('.rating-outcome'); if(out)out.textContent='Выберите две оценки, чтобы увидеть изменение.';
  const note=document.getElementById('reflection');if(note)note.value='';
});
document.getElementById('copySummary')?.addEventListener('click',async()=>{
  const key=document.querySelector('main').dataset.skill||'ТРУД';
  const before=document.querySelector('[data-rating="before"]')?.dataset.value??'не указано';
  const after=document.querySelector('[data-rating="after"]')?.dataset.value??'не указано';
  const note=document.getElementById('reflection')?.value?.trim()||'нет заметки';
  const content=`Навык ТРУД — ${key}
Напряжение до: ${before}/10
После: ${after}/10
Мои наблюдения: ${note}`;
  try {await navigator.clipboard.writeText(content);document.getElementById('copySummary').textContent='Скопировано ✓'}
  catch(e){const t=document.createElement('textarea');t.value=content;document.body.appendChild(t);t.select();try{document.execCommand('copy');document.getElementById('copySummary').textContent='Скопировано ✓'}catch(e){document.getElementById('copySummary').textContent='Скопируйте заметку вручную'}t.remove();}
});