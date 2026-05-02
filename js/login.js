//login.js

// Import Firebase components using the modular syntax
/* 
import { sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js'; //User authentication
import { collection, query, where, getDocs, updateDoc, doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js'; //Database interactions
import { auth, db } from './firebaseConfig.js'; //Modularized Firebase configuration
*/


// ================== DUMMY USERS ==================
const dummyUsers = [
    {
        username: "admin",
        password: "123456",
        email: "admin@photonest.com",
        role: "admin",
        status: "active"
    },
    {
        username: "user",
        password: "123456",
        email: "user@photonest.com",
        role: "user",
        status: "active"
    },
    {
        username: "banned",
        password: "123456",
        email: "banned@photonest.com",
        role: "user",
        status: "banned"
    }
];


// Select the login form from the HTML
const loginForm = document.querySelector('.login-form');

// Check if the login form exists on the page
if (loginForm) {
    // Select the username and password input fields
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // Add an event listener to handle form submission
   loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const username = usernameInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    console.log(`Attempting login with: ${username}`);

    // Find user in dummy data
    const user = dummyUsers.find(u => u.username === username);

    if (!user) {
        alert("No user found with that username.");
        return;
    }

    // Check password
    if (user.password !== password) {
        alert("Incorrect password.");
        return;
    }

    // Check banned
    if (user.status === "banned") {
        window.location.href = '../html/BannedMessage.html';
        return;
    }

   sessionStorage.clear();

sessionStorage.setItem("user", JSON.stringify(user));
sessionStorage.setItem("userId", user.uid || user.username);
sessionStorage.setItem("username", user.username);
sessionStorage.setItem("role", user.role);

window.location.href = "../html/UserDashboard.html";
});
}



// Track inactivity and logout user
let inactivityTimeout; // Declare a variable for the inactivity timeout

// Function to reset the inactivity timer
function resetInactivityTimer() {
    clearTimeout(inactivityTimeout); // Clear the existing timer
    inactivityTimeout = setTimeout(async () => { // Start a new timer
        alert("You have been logged out due to inactivity."); // Alert the user
        const userId = auth.currentUser ? auth.currentUser.uid : null;

        if (userId) {
            // Log inactivity logout activity
            await logActivity(userId, "logout", "User logged out due to inactivity.");
        }

        logout(); // Log out the user
    }, 15 * 60 * 1000); // 15 minutes
}

async function updateLastActive() {
    const userId = auth.currentUser ? auth.currentUser.uid : null; // Get the current user's ID
    if (!userId) return;

    const sessionRef = doc(db, "sessions", userId); // Reference to the user's session document
    const currentTimestamp = new Date().toISOString(); // Get the current timestamp

    try {
        // Check if the session document exists
        const sessionSnapshot = await getDoc(sessionRef);
        if (sessionSnapshot.exists()) {
            // Update the last active timestamp if the document exists
            await updateDoc(sessionRef, { lastActive: currentTimestamp });
            
        } else {
            // Create the document with initial data if it doesn't exist
            await setDoc(sessionRef, {
                lastActive: currentTimestamp,
                status: "online", // Default status
                userId: userId,   // Save user ID
                loginTime: currentTimestamp, // Set the login time
                logoutTime: null, // No logout yet
            });
            console.log("Session document created and last active timestamp set:", currentTimestamp);
        }
    } catch (error) {
        console.error("Error updating lastActive:", error); // Log any errors
    }
}


function handleUserActivity() {
    resetInactivityTimer(); // Reset inactivity timeout on user activity
    updateLastActive();      // Update the last active timestamp
}

// Consolidate event listeners for user activity
window.addEventListener('mousemove', handleUserActivity); // Track mouse movement
window.addEventListener('keydown', handleUserActivity); // Track keyboard input
window.addEventListener('touchstart', handleUserActivity); // Track touch input
window.addEventListener('scroll', handleUserActivity); // Track scrolling

// Initialize inactivity timer
resetInactivityTimer(); // Start the inactivity timer

// Function to log out the user and update Firestore
export function logout() {
    sessionStorage.clear();
    clearTimeout(inactivityTimeout);
    window.location.href = '../index.html';
}
// Reference the logout button
const logoutButton = document.querySelector('.logout-button');

// Attach the logout function to the button
if (logoutButton) {
    logoutButton.addEventListener('click', async (event) => {
        event.preventDefault();
        const confirmLogout = confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            await logout();
        }
    });
}





// Update session status before the browser is closed
window.addEventListener('beforeunload', () => {
   const userId = sessionStorage.getItem("username");
    if (userId) {
        const sessionRef = doc(db, "sessions", userId); // Reference to the user's session document
        const logoutTimestamp = new Date().toISOString(); // Get the current timestamp

        const payload = JSON.stringify({
            status: "offline",  // Update the user's status to offline
            logoutTime: logoutTimestamp, // Save the logout time
        });


        navigator.sendBeacon('/update-session', payload); // Send data to the server
    }
});




// Log Activity Function
async function logActivity(userId, category, message) {
    const activityLogRef = collection(db, "ActivityLogs");
    const timestamp = new Date().toISOString();

    try {
        await setDoc(doc(activityLogRef), {
            userId: userId,
            category: category,
            message: message,
            timestamp: timestamp,
        });
        console.log(`Activity logged: ${category} - ${message}`);
    } catch (error) {
        console.error("Error logging activity:", error);
    }
}


document.addEventListener('DOMContentLoaded', () => {

// Wait for 2 seconds and then hide the splash screen
setTimeout(() => {
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        splashScreen.style.transition = 'opacity 0.5s ease'; // Smooth fade-out
        splashScreen.style.opacity = '0'; // Fade-out effect
        
        // Remove the splash screen from the DOM after the fade-out
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 500); // Matches the transition duration
    }
}, 2000); // 2 seconds

// ===== Forgot Password Modal Logic =====
const forgotPasswordModal = document.getElementById('forgot-password-modal');
const closeButton = document.querySelector('.close-button');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const forgotPasswordMessage = document.getElementById('forgot-password-message');
const forgotPasswordLink = document.querySelector('a[href*="forget"]'); // Select the "Forgot your password?" link

// Check if the forgot password elements exist in the DOM
if (forgotPasswordModal && closeButton && forgotPasswordForm && forgotPasswordLink) {
    // Open the modal when clicking on the "Forgot your password?" link
    forgotPasswordLink.addEventListener('click', (event) => {
        event.preventDefault();
        forgotPasswordModal.classList.remove('hidden'); // Show the modal
    });

    // Close modal when clicking the close button
    closeButton.addEventListener('click', () => {
        forgotPasswordModal.classList.add('hidden'); // Hide modal
        forgotPasswordMessage.textContent = ''; // Clear previous messages
    });

    // Close modal when clicking outside the modal content
    forgotPasswordModal.addEventListener('click', (event) => {
        if (event.target === forgotPasswordModal) {
            forgotPasswordModal.classList.add('hidden'); // Hide modal
            forgotPasswordMessage.textContent = ''; // Clear messages
        }
    });

    // Handle form submission for password reset
    forgotPasswordForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent the default form submission
        const email = document.getElementById('forgot-email').value.trim().toLowerCase();

        try {
            // Check if the email exists in the Firestore database
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                forgotPasswordMessage.textContent = 'No account found with this email address.';
                forgotPasswordMessage.style.color = 'red';
                return;
            }

            // Send the password reset email using Firebase Authentication
           // await sendPasswordResetEmail(auth, email);
           
            forgotPasswordMessage.textContent = 'Password reset link sent to your email.';
            forgotPasswordMessage.style.color = 'green';

            // Optional: Close the modal after a delay
            setTimeout(() => {
                forgotPasswordModal.classList.add('hidden');
                forgotPasswordMessage.textContent = '';
            }, 3000);
        } catch (error) {
            console.error("Error sending password reset email:", error);
            forgotPasswordMessage.textContent = 'Error sending reset email. Please try again.';
            forgotPasswordMessage.style.color = 'red';
        }
    });
} else {
    console.log("Forgot password elements not found in the DOM. Skipping modal logic.");
}
// ===== End of Forgot Password Modal Logic =====



});






