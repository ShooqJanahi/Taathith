import { createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { doc, setDoc, query, where, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { auth, db } from "./firebaseConfig.js";

const signupForm = document.querySelector(".signup-form");

document.addEventListener("DOMContentLoaded", () => {
    hideSplash();
    setupPasswordToggle();
});

function hideSplash() {
    setTimeout(() => {
        const splashScreen = document.getElementById("splash-screen");

        if (splashScreen) {
            splashScreen.classList.add("hidden");

            setTimeout(() => {
                splashScreen.style.display = "none";
            }, 600);
        }
    }, 1200);
}

async function isUniqueUser(username, email, phone) {
    const usersRef = collection(db, "users");

    const usernameQuery = query(usersRef, where("username", "==", username));
    const emailQuery = query(usersRef, where("email", "==", email));
    const phoneQuery = query(usersRef, where("phone", "==", phone));

    const [usernameSnapshot, emailSnapshot, phoneSnapshot] = await Promise.all([
        getDocs(usernameQuery),
        getDocs(emailQuery),
        getDocs(phoneQuery),
    ]);

    return {
        isUsernameUnique: usernameSnapshot.empty,
        isEmailUnique: emailSnapshot.empty,
        isPhoneUnique: phoneSnapshot.empty,
    };
}

function isValidEmail(email) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

function isStrongPassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
}

function isNumeric(value) {
    return /^[0-9]{8}$/.test(value);
}

function hasNoSpaces(value) {
    return /^\S+$/.test(value);
}

function setupPasswordToggle() {
    document.querySelectorAll(".toggle-password").forEach(button => {
        button.addEventListener("click", () => {
            const input = button.previousElementSibling;
            const type = input.type === "password" ? "text" : "password";

            input.type = type;
            button.classList.toggle("fa-eye");
            button.classList.toggle("fa-eye-slash");
        });
    });
}

signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const username = document.getElementById("username").value.trim().toLowerCase();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();
    const repeatPassword = document.getElementById("repeat-password").value.trim();

    if (!hasNoSpaces(username)) {
        alert("Username cannot contain spaces.");
        return;
    }

    if (password !== repeatPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (!isNumeric(phone)) {
        alert("Phone number should be 8 digits only.");
        return;
    }

    if (!isStrongPassword(password)) {
        alert("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
        return;
    }

    if (!isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    try {
        const { isUsernameUnique, isEmailUnique, isPhoneUnique } =
            await isUniqueUser(username, email, phone);

        if (!isUsernameUnique) {
            alert("This username is already taken.");
            return;
        }

        if (!isEmailUnique) {
            alert("This email is already registered.");
            return;
        }

        if (!isPhoneUnique) {
            alert("This phone number is already associated with an account.");
            return;
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCredential.user.uid;

        const newUser = {
            uid: userId,
            firstName,
            lastName,
            username,
            email,
            phone,
            role: "user",
            status: "active",
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            cart: [],
            favourites: [],
            orderHistory: []
        };

        await setDoc(doc(db, "users", userId), newUser);

        await sendEmailVerification(userCredential.user);

        // Save newly created account as the current session user
        sessionStorage.setItem("user", JSON.stringify(newUser));
        sessionStorage.setItem("userId", userId);
        sessionStorage.setItem("username", username);
        sessionStorage.setItem("role", "user");

        alert("Account created successfully.");

        signupForm.reset();

        window.location.href = "../html/UserDashboard.html";

    } catch (error) {
        console.error("Error creating user:", error);
        alert("Failed to create user: " + error.message);
    }
});