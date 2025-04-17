// Function to create a job card for the homepage
function createHomeJobCard(job) {
    const serviceIcons = Array.isArray(job.services) ? job.services.map(service => 
        `<span class="mr-2" title="${service}">${window.SERVICE_ICONS[service] || service}</span>`
    ).join('') : '';

    return `
        <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-xl font-semibold text-gray-900">${job.owner_name || 'No Name'}</h3>
                    <p class="text-gray-600">${job.location || 'No Location'}</p>
                </div>
                <span class="bg-brand-light text-brand-primary text-sm font-medium px-3 py-1 rounded">
                    ${job.type || 'No Type'}
                </span>
            </div>
            <div class="mb-4">
                <p class="text-gray-700"><strong>Salary:</strong> NPR ${job.salary || 'Not specified'}</p>
                <p class="text-gray-700"><strong>Experience Required:</strong> ${job.required_experience || 'Not specified'}</p>
            </div>
            <div class="mb-4">
                <p class="text-gray-700 mb-2"><strong>Services Required:</strong></p>
                <div class="flex flex-wrap">${serviceIcons || 'No services specified'}</div>
            </div>
            <div class="mt-4 flex justify-between items-center">
                <span class="text-gray-500 text-sm">Posted ${window.formatDate(job.created_at)}</span>
                <a href="find-jobs.html" class="text-brand-primary hover:text-brand-secondary font-semibold">View Details →</a>
            </div>
        </div>
    `;
}

// Function to create a maid card for the homepage
function createHomeMaidCard(maid) {
    const serviceIcons = Array.isArray(maid.services) ? maid.services.map(service => 
        `<span class="mr-2" title="${service}">${window.SERVICE_ICONS[service] || service}</span>`
    ).join('') : '';

    return `
        <div class="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
            <div class="flex justify-between items-start mb-4">
                <div>
                    <h3 class="text-xl font-semibold text-gray-900">${maid.full_name || 'No Name'}</h3>
                    <p class="text-gray-600">${maid.location || 'No Location'}</p>
                </div>
                <span class="bg-brand-light text-brand-primary text-sm font-medium px-3 py-1 rounded">
                    ${maid.type || 'No Type'}
                </span>
            </div>
            <div class="mb-4">
                <p class="text-gray-700"><strong>Experience:</strong> ${maid.experience || 'Not specified'}</p>
                <p class="text-gray-700"><strong>Expected Salary:</strong> NPR ${maid.expected_salary || 'Not specified'}</p>
            </div>
            <div class="mb-4">
                <p class="text-gray-700 mb-2"><strong>Services Offered:</strong></p>
                <div class="flex flex-wrap">${serviceIcons || 'No services specified'}</div>
            </div>
            <div class="mt-4 flex justify-between items-center">
                <span class="text-gray-500 text-sm">Registered ${window.formatDate(maid.created_at)}</span>
                <a href="find-maids.html" class="text-brand-primary hover:text-brand-secondary font-semibold">View Details →</a>
            </div>
        </div>
    `;
}

// Function to show error message
function showError(containerId, message, error = null) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
        <div class="col-span-3 text-center py-12">
            <div class="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-lg p-6">
                <p class="text-red-600 text-lg mb-2">${message}</p>
                ${error ? `<p class="text-sm text-red-500 mt-2">Try opening this page using a local server instead of directly from the file system.</p>` : ''}
                <button onclick="window.location.reload()" class="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors">
                    Try Again
                </button>
            </div>
        </div>`;
}

// Function to load latest jobs
async function loadLatestJobs() {
    try {
        console.log('Loading latest jobs...');
        const jobs = await window.getLatestJobs(3);
        console.log('Received latest jobs:', jobs);
        
        const jobsContainer = document.getElementById('latestJobs');
        const noJobsMessage = document.getElementById('noJobs');
        
        if (!jobs || jobs.length === 0) {
            jobsContainer.innerHTML = '';
            noJobsMessage.classList.remove('hidden');
            return;
        }

        noJobsMessage.classList.add('hidden');
        jobsContainer.innerHTML = jobs.map(job => createHomeJobCard(job)).join('');
    } catch (error) {
        console.error('Error loading latest jobs:', error);
        showError('latestJobs', 'Unable to load jobs at the moment.', error);
    }
}

// Function to load latest maids
async function loadLatestMaids() {
    try {
        console.log('Loading latest maids...');
        const maids = await window.getLatestMaids(3);
        console.log('Received latest maids:', maids);
        
        const maidsContainer = document.getElementById('latestMaids');
        const noMaidsMessage = document.getElementById('noMaids');
        
        if (!maids || maids.length === 0) {
            maidsContainer.innerHTML = '';
            noMaidsMessage.classList.remove('hidden');
            return;
        }

        noMaidsMessage.classList.add('hidden');
        maidsContainer.innerHTML = maids.map(maid => createHomeMaidCard(maid)).join('');
    } catch (error) {
        console.error('Error loading latest maids:', error);
        showError('latestMaids', 'Unable to load maids at the moment.', error);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing...');
    // Check if running from file system
    if (window.location.protocol === 'file:') {
        console.warn('Running from file system - network requests may be blocked');
    }
    loadLatestJobs();
    loadLatestMaids();
}); 