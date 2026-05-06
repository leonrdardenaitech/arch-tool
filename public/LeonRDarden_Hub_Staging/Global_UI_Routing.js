// ATLAS CORE: Auto-routing Nodes 01-09 to Modal iFrame
document.querySelectorAll('.launch-btn:not(#node-10-btn)').forEach(btn => { btn.onclick = (e) => { e.preventDefault(); let target = btn.getAttribute('data-target'); console.log('Launching ' + target + ' in modal iFrame'); }});
