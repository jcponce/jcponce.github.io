function loadContent(page) {
    // Use AJAX or fetch to load the content of the selected page
    // For simplicity, let's assume you're using fetch
    fetch(page)
        .then(response => response.text())
        .then(content => {
            document.getElementById('content').innerHTML = content;
        })
        .catch(error => {
            console.error('Error loading page:', error);
        });
}


// Get references to the sidebar and content elements
const sidebar = document.getElementById('sidebar');
const content = document.getElementById('content');

// Add event listener for mousewheel scroll
document.addEventListener('wheel', (event) => {
    // Check if the mouse is over the sidebar
    const isMouseOverSidebar = event.clientX < sidebar.offsetWidth;

    // Check if the mouse is over the content
    const isMouseOverContent = event.clientX > sidebar.offsetWidth;

    // Perform scrolling based on mouse position
    if (isMouseOverSidebar) {
        sidebar.scrollTop += event.deltaY;
    } else if (isMouseOverContent) {
        content.scrollTop += event.deltaY;
    }
});


function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');
    const closeBtn = document.getElementById('closeBtn');

    if (sidebar.classList.contains('show')) {
        sidebar.classList.remove('show');
        toggleBtn.classList.remove('hide');
        closeBtn.style.display = 'none'; // Hide close button when sidebar is closed
    } else {
        sidebar.classList.add('show');
        toggleBtn.classList.add('hide');
        if (window.innerWidth < 995) {
            closeBtn.style.display = 'block'; // Show close button when sidebar is open and width is less than 995px
        }
    }
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleBtn');
    const closeBtn = document.getElementById('closeBtn');

    sidebar.classList.remove('show');
    toggleBtn.classList.remove('hide');
    closeBtn.style.display = 'none'; // Hide close button when sidebar is closed
}

// Add event listener to handle window resize
window.addEventListener('resize', function () {
    const closeBtn = document.getElementById('closeBtn');
    const sidebar = document.getElementById('sidebar');

    if (window.innerWidth >= 995) {
        closeBtn.style.display = 'none'; // Hide close button when width is 995px or more
        sidebar.classList.remove('show'); // Close the sidebar when width is 995px or more
    }
});



function loadContent(page, address) {
    const content = document.getElementById('content');
    content.innerHTML = 'Loading...'; // Display loading message while content is loading

    // Simulate fetching content from the server (you can use AJAX for real content loading)
    fetch(`content/${page}`)
        .then(response => response.text())
        .then(data => {
            content.innerHTML = data;
            updateAddress(address);

            // Explicitly call MathJax.typeset() after updating content
            MathJax.typeset();
        })
        .catch(error => {
            content.innerHTML = 'Error loading content';
        });
}

function updateAddress(address) {
    // Update the address in the browser without reloading the page
    history.pushState(null, null, `#${address}`);
}

// Add event listener to handle back/forward navigation
window.addEventListener('popstate', function (event) {
    const address = window.location.hash.slice(1); // Get the address from the URL
    loadContent(`${address}.html`, address); // Load content based on the address
});

// Simulate initial content load based on the current address
const initialAddress = window.location.hash.slice(1);
if (initialAddress) {
    loadContent(`${initialAddress}.html`, initialAddress);
}


