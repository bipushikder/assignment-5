

const API_BASE = "https://phi-lab-server.vercel.app/api/v1/lab";

let allIssues = [];

// 1. Login 


document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();

     const user = document.getElementById('username').value;

    const pass = document.getElementById('password').value;

    if(user === 'admin' && pass === 'admin123') {

        document.getElementById('login-page').classList.add('hidden');

        document.getElementById('main-page').classList.remove('hidden');
        
        loadAllIssues();
    } else {
        alert("Invalid Username or Password!");
    }
});


//  Fetch-all-Issues


async function loadAllIssues() {
    toggleLoader(true);
    try {
        const res = await fetch(`${API_BASE}/issues`);
         const result = await res.json();
        
    
        allIssues = Array.isArray(result) ? result : (result.data || []);
        
        updateStats(allIssues);
        renderCards(allIssues);
    } catch (err) {
        console.error("Fetch Error:", err);
    } finally {
        toggleLoader(false);
    }
}



//  Render Cards 



function renderCards(data) {
    const container = document.getElementById('issues-container');
    container.innerHTML = "";


    if (!data || data.length === 0) {
        container.innerHTML = `<div class="col-span-full text-center py-20 text-gray-400">No issues found.</div>`;
        return;
    }


    data.forEach(issue => {
        
        const status = issue.status?.toLowerCase();
        const borderClass = status === 'open' ? 'border-t-green-500' : 'border-t-purple-600';
        
        const card = document.createElement('div');
        card.className = `card bg-white border-t-4 ${borderClass} shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group`;
        card.onclick = () => openModal(issue._id || issue.id);
        
        card.innerHTML = `
            <div class="p-6 flex flex-col h-full gap-4">

                <div class="flex justify-between items-center">

                    <span class="px-2 py-1 bg-gray-100 text-[10px] font-bold text-gray-500 rounded uppercase tracking-tighter">${issue.label || 'Task'}</span>

                    <span class="text-[10px] text-gray-400 font-medium">${new Date(issue.createdAt).toLocaleDateString()}</span>

                </div>

                <h3 class="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors line-clamp-1">${issue.title}</h3>

                <p class="text-sm text-gray-500 line-clamp-2 leading-relaxed flex-grow">${issue.description}</p>

                <div class="flex items-center gap-3 pt-4 border-t border-gray-50">

                    <div class="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-100">

                        ${issue.author ? issue.author[0].toUpperCase() : 'U'}

                    </div>

                    <div class="flex flex-col">

                        <span class="text-xs font-bold text-gray-700">${issue.author || 'Unknown'}</span>
                        <span class="text-[10px] text-gray-400 uppercase">${issue.priority || 'Normal'}</span>

                    </div>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}



// Filtering 


function filterIssues(type, btn) {
    

    document.querySelectorAll('.tab').forEach(t => {
        t.classList.remove('tab-active', 'bg-blue-600', 'text-white');
    });
    btn.classList.add('tab-active', 'bg-blue-600', 'text-white');

    
    let filtered;
    if(type === 'all') {
        filtered = allIssues;
    } else {
        filtered = allIssues.filter(i => i.status?.toLowerCase() === type);
    }


    renderCards(filtered);
    document.getElementById('current-count').innerText = filtered.length;
}

function updateStats(data) {
    const open = data.filter(i => i.status?.toLowerCase() === 'open').length;
    const closed = data.filter(i => i.status?.toLowerCase() === 'closed').length;
    

    document.getElementById('current-count').innerText = data.length;
    document.getElementById('open-count').innerText = open;
    document.getElementById('closed-count').innerText = closed;
}


// Search Logic

async function handleSearch() {
    const query = document.getElementById('search-input').value;
    if(!query) return loadAllIssues();


    toggleLoader(true);
    try {
        const res = await fetch(`${API_BASE}/issues/search?q=${query}`);

        const result = await res.json();

        const searchResults = Array.isArray(result) ? result : (result.data || []);

        renderCards(searchResults);
        updateStats(searchResults);

    } catch (err) {
        console.error("Search failed", err);
        
    } finally {

        toggleLoader(false);
    }
}

