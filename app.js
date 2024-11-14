// Load CSV data on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadCSVData();
    let localData = JSON.parse(localStorage.getItem('websites')) || [];
    displayWebsites(localData);
});

// Function to load CSV data
async function loadCSVData() {
    const response = await fetch("website_data_10000.csv");
    const data = await response.text();
    const parsedData = parseCSV(data);

    // Save parsed data to LocalStorage
    localStorage.setItem('websites', JSON.stringify(parsedData));

    displayWebsites(parsedData);
}

// CSV parsing function
function parseCSV(data) {
    const rows = data.split("\n");
    const websites = rows.slice(1).map(row => {
        const [website_name, category, country, launch_year, monthly_visitors, user_name, login_time, comment, feedback, rating] = row.split(",");
        // Skip empty or malformed rows
        if (!website_name || !category || !country || !launch_year || !monthly_visitors || !user_name || !login_time || !comment || !feedback || !rating) {
            return null;
        }
        return { 
            website_name, 
            category, 
            country, 
            launch_year, 
            monthly_visitors, 
            user_name, 
            login_time, 
            comment, 
            feedback, 
            rating 
        };
    }).filter(website => website !== null);  // Remove null (empty) rows
    return websites;
}

// Function to display websites
function displayWebsites(websites) {
    const tableBody = document.querySelector('#websiteTable tbody');
    tableBody.innerHTML = '';  // Clear existing rows

    websites.forEach((website, index) => {
        const row = tableBody.insertRow();

        row.insertCell().textContent = website.website_name;
        row.insertCell().textContent = website.category;
        row.insertCell().textContent = website.country;
        row.insertCell().textContent = website.launch_year;
        row.insertCell().textContent = website.monthly_visitors;
        row.insertCell().textContent = website.user_name;
        row.insertCell().textContent = website.login_time;
        row.insertCell().textContent = website.comment;
        row.insertCell().textContent = website.feedback;
        row.insertCell().textContent = website.rating;

        const actionCell = row.insertCell();
        actionCell.innerHTML = `
            <button onclick="updateWebsite(${index})">Update</button>
            <button onclick="deleteWebsite(${index})" class="delete">Delete</button>
        `;
    });
}

// Function to search websites by name
function searchWebsite() {
    const searchTerm = document.getElementById('search').value.toLowerCase(); // Get search input
    let websites = JSON.parse(localStorage.getItem('websites')) || [];

    // Filter websites based on the name
    const filteredWebsites = websites.filter(website =>
        website.website_name.toLowerCase().includes(searchTerm)
    );

    // Display the filtered websites
    displayWebsites(filteredWebsites);
}

// Function to add a new website
function addWebsite() {
    const category = prompt("Enter the category:");
    if (!category) {
        alert("Category is required.");
        return;
    }

    const newWebsite = {
        website_name: prompt("Enter the website name:"),
        category: category,
        country: prompt("Enter the country:"),
        launch_year: prompt("Enter the launch year:"),
        monthly_visitors: prompt("Enter the monthly visitors:"),
        user_name: prompt("Enter the user name:"),
        login_time: new Date().toLocaleString(),
        comment: prompt("Enter a comment:"),
        feedback: prompt("Enter feedback:"),
        rating: prompt("Enter rating (1-5):")
    };

    if (
        isNaN(newWebsite.launch_year) ||
        isNaN(newWebsite.monthly_visitors) ||
        isNaN(newWebsite.rating) || 
        newWebsite.rating < 1 || newWebsite.rating > 5
    ) {
        alert("Please enter valid numbers for year, visitors, and rating.");
        return;
    }

    let websites = JSON.parse(localStorage.getItem('websites')) || [];
    websites.push(newWebsite);
    localStorage.setItem('websites', JSON.stringify(websites));
    displayWebsites(websites);
}

// Delete Website Function
function deleteWebsite(index) {
    let websites = JSON.parse(localStorage.getItem('websites')) || [];
    websites.splice(index, 1);
    localStorage.setItem('websites', JSON.stringify(websites));
    displayWebsites(websites);
}

// Update Website Function
function updateWebsite(index) {
    let websites = JSON.parse(localStorage.getItem('websites')) || [];
    const website = websites[index];

    const updatedWebsite = {
        website_name: prompt("Update website name:", website.website_name) || website.website_name,
        category: prompt("Update category:", website.category) || website.category,
        country: prompt("Update country:", website.country) || website.country,
        launch_year: prompt("Update launch year:", website.launch_year) || website.launch_year,
        monthly_visitors: prompt("Update monthly visitors:", website.monthly_visitors) || website.monthly_visitors,
        user_name: prompt("Update user name:", website.user_name) || website.user_name,
        login_time: new Date().toLocaleString(),
        comment: prompt("Update comment:", website.comment) || website.comment,
        feedback: prompt("Update feedback:", website.feedback) || website.feedback,
        rating: prompt("Update rating (1-5):", website.rating) || website.rating
    };

    websites[index] = updatedWebsite;
    localStorage.setItem('websites', JSON.stringify(websites));
    displayWebsites(websites);
}
