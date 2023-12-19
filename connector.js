// Function to Get Wheel Values
async function getWheelValues() {
    try {
        const response = await fetch('<YourAzureFunctionUrl>/api/GetWheelValues', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log('Wheel Values:', data);

        // Handle the received data as needed for your frontend
    } catch (error) {
        console.error('Error fetching wheel values:', error);
    }
}

// Function to Check Spin Availability
async function checkSpinAvailability() {
    try {
        const response = await fetch('<YourAzureFunctionUrl>/api/CheckSpinAvailability', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log('Spin Availability:', data);

        // Handle the received data as needed for your frontend
    } catch (error) {
        console.error('Error checking spin availability:', error);
    }
}

// Function to Handle Spin Requests
async function handleSpinRequest() {
    try {
        const response = await fetch('<YourAzureFunctionUrl>/api/HandleSpinRequest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        console.log('Spin Result:', data);

        // Handle the received data as needed for your frontend
    } catch (error) {
        console.error('Error handling spin request:', error);
    }
}

