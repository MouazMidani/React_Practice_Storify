# Storify

A modern, full-stack storage management solution inspired by giants like Google Drive and Dropbox.

---

🚧 **Project Status: Work in Progress** 🚧  
This project is actively being developed. New features and improvements are being added regularly.

---

🚀 **Hosted Latest Update**  
Check out the current state of the application: [Hosted Demo Link](https://react-practice-storify.onrender.com)

---

✨ **Features**

This application offers a comprehensive set of features for file management and user authentication, powered by Appwrite as the backend-as-a-service.

- **Secure Authentication**: Implements secure, passwordless One-Time Password (OTP) authentication via email for login and registration.
- **Dashboard**: A streamlined main dashboard (managed via Expo Router Slot) to track storage usage, recent uploads, and file categories.
- **File Uploads**: Supports drag-and-drop multifile uploads across various document, image, and media types.
- **File Operations**: Ability to rename, preview (including PDFs), download, and delete files.
- **File Sharing**: Securely share files with other registered users, with the option to restrict shared actions.
- **Global Search**: Instantly find any file across your entire storage with a global search function.
- **Mobile-First Design**: A completely mobile-responsive UI that works flawlessly on any device.

---

⚙️ **Tech Stack**

**Frontend & Mobile Development**
- **React Native**: The primary framework for building the cross-platform mobile application.
- **Expo Router**: Used for file-system-based routing, including the use of Expo Router Slot for the main dashboard layout.
- **Zustand**: Fast and scalable state management using modern React Hooks.
- **TypeScript**: For type safety and better developer experience.
- **React Native `StyleSheet`**: For styling the application using standard React Native components.

**Backend & Database**
- **Appwrite**: Open-source Backend-as-a-Service (BaaS) providing:
  - **Authentication**: OTP and user account management.
  - **Databases**: Storing user metadata and file-related documents.
  - **Storage**: Handling all file uploads and storage.
  - **Email**: For sending OTPs and other notifications.

---

🤝 **Contributing**

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.


---

## 🔐 Authentication Flow

This is how the authentication flow works in **Storify**, from user interaction to fully authenticated state:

1. **User Initiates Login**  
   The user enters their email (and optionally full name for registration). The component calls `createAccount()` and `verifySecret()` functions.

2. **Appwrite Handles Authentication**  
   `verifySecret()` communicates with Appwrite to create a session. Once successful, Appwrite returns session information.

3. **AuthStore Updates**  
   The Zustand `AuthStore` is updated with the session and user information. The store automatically persists the data to platform-specific storage:
   - **Mobile (iOS/Android)**: `SecureStore.setItemAsync()`
   - **Web**: `localStorage.setItem()`

4. **Components React Automatically**  
   Any subscribed React components detect the updated auth state and re-render. Protected routes redirect based on the current status (`authenticated` or `unauthenticated`).

5. **User Redirected**  
   Once authenticated, the app navigates to the main dashboard. Logging out clears the session, store, and local storage.

---

### 🔹 Flow Visualization Images

Here are snapshots of the authentication flow:
<img width="905" height="888" alt="Screenshot 2025-10-27 011929" src="https://github.com/user-attachments/assets/a72a0409-f78d-4392-98ad-715c0b488136" />
<img width="898" height="888" alt="Screenshot 2025-10-27 012021" src="https://github.com/user-attachments/assets/90619eb0-0955-4909-b187-adcd28e580aa" />
<img width="892" height="878" alt="Screenshot 2025-10-27 012053" src="https://github.com/user-attachments/assets/7a48aa9f-57ca-42af-bc92-2655148fb5e7" />
<img width="895" height="667" alt="Screenshot 2025-10-27 012119" src="https://github.com/user-attachments/assets/95164e50-b572-437a-9196-52ef4734f4c7" />
