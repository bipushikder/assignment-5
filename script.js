

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