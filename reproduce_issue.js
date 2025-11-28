const API_URL = 'http://localhost:5000/api';

async function request(url, method, body, token, isMultipart = false) {
    const headers = {};
    if (token) {
        headers['x-auth-token'] = token;
    }
    if (!isMultipart) {
        headers['Content-Type'] = 'application/json';
    }
    const options = {
        method,
        headers
    };

    if (body) {
        options.body = body;
    }

    const res = await fetch(url, options);
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.message || res.statusText);
    }
    return data;
}

async function run() {
    try {
        const userEmail = `user_${Date.now()}@example.com`;
        const userPass = 'password123';
        console.log('Registering user...');
        await request(`${API_URL}/auth/register`, 'POST', JSON.stringify({
            name: 'Test User',
            email: userEmail,
            password: userPass,
            role: 'user'
        }));

        const userLogin = await request(`${API_URL}/auth/login`, 'POST', JSON.stringify({
            email: userEmail,
            password: userPass
        }));
        const userToken = userLogin.token;
        const workerEmail = `worker_${Date.now()}@example.com`;
        const workerPass = 'password123';
        console.log('Registering worker...');
        await request(`${API_URL}/auth/register`, 'POST', JSON.stringify({
            name: 'Test Worker',
            email: workerEmail,
            password: workerPass,
            role: 'worker'
        }));

        const workerLogin = await request(`${API_URL}/auth/login`, 'POST', JSON.stringify({
            email: workerEmail,
            password: workerPass
        }));
        const workerToken = workerLogin.token;
        console.log('Creating unassigned complaint...');
        const boundary = '--------------------------9844656468654654';
        const content = [
            `--${boundary}`,
            'Content-Disposition: form-data; name="title"',
            '',
            'Unassigned Issue',
            `--${boundary}`,
            'Content-Disposition: form-data; name="description"',
            '',
            'This is pending',
            `--${boundary}`,
            'Content-Disposition: form-data; name="category"',
            '',
            'Other',
            `--${boundary}`,
            'Content-Disposition: form-data; name="latitude"',
            '',
            '10',
            `--${boundary}`,
            'Content-Disposition: form-data; name="longitude"',
            '',
            '10',
            `--${boundary}--`
        ].join('\r\n');

        const complaintRes = await fetch(`${API_URL}/complaints`, {
            method: 'POST',
            headers: {
                'x-auth-token': userToken,
                'Content-Type': `multipart/form-data; boundary=${boundary}`
            },
            body: content
        });

        const complaint = await complaintRes.json();
        if (!complaintRes.ok) throw new Error(complaint.message || 'Failed to create complaint');

        console.log(`Created complaint ${complaint._id} with status: ${complaint.status}`);
        console.log('Worker fetching complaints...');
        const workerComplaints = await request(`${API_URL}/complaints`, 'GET', null, workerToken);

        console.log(`Worker found ${workerComplaints.length} complaints.`);
        const found = workerComplaints.find(c => c._id === complaint._id);

        if (found) {
            console.log('SUCCESS: Worker can see the unassigned complaint.');
            console.log('Worker picking up the task...');
            const updateRes = await request(`${API_URL}/complaints/status/${complaint._id}`, 'PUT', JSON.stringify({
                status: 'in-progress'
            }), workerToken);

            if (updateRes.assignedTo === workerLogin.user.id) {
                console.log('SUCCESS: Task assigned to worker.');
            } else {
                console.log('FAILURE: Task NOT assigned to worker.');
            }
        } else {
            console.log('FAILURE: Worker CANNOT see the unassigned complaint.');
        }

    } catch (err) {
        console.error('Error:', err.message);
    }
}
run();
