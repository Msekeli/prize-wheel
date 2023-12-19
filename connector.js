// Assuming you have the getWheelValues function that fetches data from your API

// Function to update the chart with new data
function updateChartWithData(newData) {
    // Assuming myChart is the reference to your existing chart
    myChart.data.datasets[0].data = newData;
    myChart.update();
}

async function getWheelValues() {
    try {
        const response = await fetch('http://localhost:7071/api/GetWheelValues', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (response.ok) {
            const generatedValues = data.values; // Replace 'values' with the actual property name
            updateChartWithData(generatedValues);
        } else {
            console.error('Error fetching wheel values:', data);
            // Handle the error as needed for your frontend
        }
    } catch (error) {
        console.error('Error fetching wheel values:', error);
        // Handle the error as needed for your frontend
    }
}

// Call the getWheelValues function to fetch and update the chart
getWheelValues();
