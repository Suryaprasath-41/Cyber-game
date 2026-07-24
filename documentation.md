# 3xploit - Complete Documentation

## 1. User Overview

**Exploit (3xploit)** is an open-source, educational cybersecurity game designed for beginners and originally built for college coursework. The game presents a fun, engaging way to learn about basic cybersecurity concepts without requiring any prior experience.

### Story & Gameplay
- **Setting:** The game takes place in a fictional location called **Cursor City**.
- **Objective:** The user completes various cybersecurity modules to save the city from cybercriminals.
- **Mechanics:** The game features a 3D robot navigating a cityscape. After the user correctly answers a multiple-choice question, the robot jumps over a building.
- **Rules:** 
  - Players are given **3 lives**.
  - If 3 questions are answered incorrectly, the game ends with a failing animation.
  - Answering all questions correctly triggers a winning animation and allows the user to play again.
- **Accounts & Leaderboard:** Users can create an account and log in. Scores and completion times are saved and displayed on a global leaderboard.

### Game Modules
There are four unique modules, each with its own specific environment, unique colors, and set of questions:
1. Ransomware
2. Session Hijacking
3. Bruteforce Attack
4. Trojan Horse

---

## 2. Technical Overview

The project is built on a full-stack JavaScript environment, combining modern 3D graphics on the frontend with a robust backend architecture.

### Tech Stack
- **Backend:** [Express.js](https://expressjs.com/) (Node.js)
- **Frontend / Templating:** HTML/CSS with [ThreeJS](https://threejs.org/) for the 3D environments and Handlebars (`express-handlebars`) for server-side view rendering.
- **Database:** MongoDB, managed via `mongoose` ODM.
- **Session Management:** `express-session` is used for handling user logins and tracking state.

### Project Structure
- `/res`: Contains JSON files storing the question data for each game module.
- `/routes`: Contains the Express routers (`main.js`, `users.js`, `game.js`) for handling API and page navigation.
- `/schemas`: Contains Mongoose schemas for the database.
  - **UserSchema.js**: Defines `email`, `username`, and `password`.
  - **ScoreSchema.js**: Tracks `username`, `score`, `level`, `time`, `module`, and `lastPlayed`.
- `/scripts`: Frontend JavaScript files, including game logic and ThreeJS rendering.
- `/static`: CSS stylesheets (e.g., `style.css`, `game.css`, `auth.css`) and image assets.
- `/views`: Handlebars layouts, partials, and specific pages for rendering the UI.
- `server.js`: The entry point for the backend, setting up middlewares, static routes, DB connection, and server port listening (Port 8080).

---

## 3. Question Data (QnA)

The following multiple-choice questions are used in the game, categorized by module. The correct answers are marked in bold.

### Module 1: Bruteforce Attack
1. **Q: Which password would be difficult for a hacker to figure out?**
   - Password1234
   - Il0VemYdoG
   - **dE0%yS3M86** *(Correct)*
   - CyberSecurity
2. **Q: You are tasked with advising the citizens of cursor city on how to protect themselves against brute force attacks? What do you suggest?**
   - Use 2-factor authentication for log in
   - Lockout access to account after multiple failed login attempts for a certain amount of time
   - Limit Logins to a Specified IP Address or Range
   - **All of the above** *(Correct)*
3. **Q: Which amongst the following is cryptanalytic attack?**
   - Trojan Horse
   - **Bruce Force Attack** *(Correct)*
   - Ransomeware
   - Session Hijacking

### Module 2: Ransomware
1. **Q: Employees of one of the IT giants are not able to access files on their network and the company has received a random call demanding for 1 million USD in exchange of the company’s data. What could possibly be happened with the company’s network?**
   - Brute Force attack
   - Session Hijacking
   - **Ransomware attack** *(Correct)*
   - Man-in-the-middle attack
2. **Q: As an organization, what measures can be taken to minimize the damage that can be caused in case of a ransomware attack?**
   - Encrypt as much network as possible
   - Keep network in one single segment
   - Divide organization network into multiple segments
   - **Both A and C** *(Correct)*
3. **Q: Which of the following are possible instances which can increase the chances of ransomware attack?**
   - Opening or closing a pop-up note on a web browser
   - Clicking a legitimate advertising site
   - Opening email attachments or downloading a ZIP file through email
   - **All of the above** *(Correct)*

### Module 3: Session Hijacking
1. **Q: Which of the following is the way of session hijacking?**
   - Brute force
   - Maleware
   - Session fixation
   - **All of the above** *(Correct)*
2. **Q: You shop online at home. You are suddenly called away while browsing your favorite items on the website, and your user has been logged in on the shopping website on your computer. This behavior could lead you to which of the following attacks?**
   - **Session Hijacking** *(Correct)*
   - Ransomware
   - Trojan Horse
   - None of the above
3. **Q: Which of the following session hijacking exploit is a browser extension developed for Firefox?**
   - CookieCadger
   - DroidSheep
   - **Firesheep** *(Correct)*
   - WhatsApp sniffer
4. **Q: How can you minimize the possibility of being attacked by session hijacking?**
   - Only use free public WiFi in places you frequent enter
   - Create a long complex session password. Use it for many website
   - Download a free old version of security software
   - **Log out the website after you are done using the website** *(Correct)*

### Module 4: Trojan Horse
1. **Q: You are suspecting that you might have installed a malware on your computer. What are the signs?**
   - Overall lag of the computer
   - Unrecognizable files, website redirects and unresponsiveness
   - webcam suddenly turns on for no apparent reason
   - **All of the above** *(Correct)*
2. **Q: You just received an email with an attachment. The emails seem to be about some sort of promotion from your favorite clothing store. You are asked to download the attachment and get store credits if you forward the email to 5 friends. What do you do?**
   - **Check the sender of the email and check if the email is from a legitimate source. If in doubt, report it as spam and delete the email.** *(Correct)*
   - Forward the email to 5 friends immediately for store credits.
   - Download the attachment
   - Move the email to trash immediately.
3. **Q: How do you best describe what remote access trojans can do?**
   - **Once access is gained, the hacker can use the infected machine for a number of illegal activities** *(Correct)*
   - A special type of trojan horse
   - A weaker type of trojan horse
   - None of the above
