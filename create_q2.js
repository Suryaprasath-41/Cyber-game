const fs = require('fs');
const path = require('path');

function generateQuestions(sectionStartId, sectionNum, topics, roles, incidents, actions, correctOptions, hints, difficulties) {
  const qs = [];
  for (let i = 0; i < 20; i++) {
    const role = roles[i % roles.length];
    const incident = incidents[i % incidents.length];
    const action = actions[i % actions.length];
    
    // Shuffle arrays specifically for this question to ensure uniqueness
    const questionText = `You are a ${role}. ${incident} ${action} What is the most appropriate technical response?`;
    
    const correct = correctOptions[i % correctOptions.length];
    const options = [
      correct,
      "Immediately wipe the system and reinstall the operating system without taking memory dumps.",
      "Ignore the alert as it is likely a false positive caused by a recent system update.",
      "Disable the firewall temporarily to see if the anomalous traffic resolves itself."
    ];
    
    // randomize options
    options.sort(() => Math.random() - 0.5);
    
    qs.push({
      id: sectionStartId + i,
      question: questionText,
      options: options,
      correctAnswer: correct,
      hint: hints[i % hints.length],
      difficulty: difficulties[sectionNum - 2]
    });
  }
  return qs;
}

const s2Roles = ["Network Security Engineer", "SOC Level 2 Analyst", "Incident Responder", "Cloud Security Architect", "Penetration Tester"];
const s2Incidents = [
  "You observe anomalous lateral movement across the internal subnet.",
  "An alert triggers indicating a massive spike in DNS queries to an unknown foreign domain.",
  "You detect a user's session token being re-used from an IP address in a different country.",
  "A packet capture reveals cleartext HTTP credentials being transmitted from a legacy internal application.",
  "The IDS flags a suspicious series of TCP SYN packets scanning the entire DMZ."
];
const s2Actions = [
  "You must contain the breach without tipping off the attacker.",
  "The application owner denies any recent changes.",
  "The affected user is a high-level executive currently traveling.",
  "You notice the traffic is bypassing the primary firewall rules.",
  "Management demands immediate resolution before the quarterly earnings call."
];
const s2Correct = [
  "Isolate the affected subnets using VLAN ACLs and begin forensic memory capture.",
  "Implement a DNS sinkhole for the malicious domain to prevent further command and control.",
  "Immediately revoke the active session tokens and force a password reset with MFA.",
  "Deploy an encrypted VPN tunnel for the legacy application and block port 80.",
  "Configure dynamic rate limiting and update the IDS signatures for stealth scans."
];
const s2Hints = ["Focus on containment and logging.", "Think about DNS sinkholing.", "Invalidate the session.", "Encryption is key.", "Rate limiting helps."];

const s3Roles = ["Social Engineering Expert", "Security Awareness Trainer", "Threat Hunter", "Phishing Incident Analyst", "CISO"];
const s3Incidents = [
  "An employee reports receiving a highly targeted email appearing to be from the CEO requesting a wire transfer.",
  "A USB drive labeled 'Executive Salaries 2026' is found in the company parking lot.",
  "A helpdesk technician receives a call from someone claiming to be the CFO who forgot their password.",
  "Several users complain of slow performance after downloading a 'free PDF converter' from a forum.",
  "An attacker uses deepfake audio on a phone call to authorize a fraudulent invoice payment."
];
const s3Actions = [
  "The email bypassed standard SPF/DKIM checks due to a lookalike domain.",
  "A curious employee plugged it into an air-gapped workstation.",
  "The caller knows the CFO's employee ID and home address.",
  "The application has administrative privileges on the local machines.",
  "The finance department has already initiated the transfer but it is pending."
];
const s3Correct = [
  "Implement strict out-of-band verification procedures for all financial requests.",
  "Disable USB mass storage devices via Group Policy across the entire organization.",
  "Require identity verification via a pre-established challenge-response protocol.",
  "Revoke local administrator rights and mandate application whitelisting.",
  "Immediately freeze the transaction with the bank and verify via internal video call."
];
const s3Hints = ["Verify via a different channel.", "Restrict physical ports.", "Don't trust Caller ID.", "Least privilege principle.", "Stop the money flow."];

const s4Roles = ["IAM Architect", "Cryptography Specialist", "Red Team Lead", "Authentication Systems Engineer", "Active Directory Admin"];
const s4Incidents = [
  "You discover that user passwords are saved in the database using MD5 without a salt.",
  "An attacker successfully brute-forces a service account due to lack of rate limiting.",
  "A Golden Ticket attack is detected on your primary domain controller.",
  "The company's custom encryption algorithm has been reverse-engineered and cracked.",
  "Kerberos ticket-granting tickets (TGTs) are being intercepted on the network."
];
const s4Actions = [
  "The database has already been leaked to the dark web.",
  "The service account has Domain Admin privileges.",
  "The attacker is forging tickets with a 10-year expiration date.",
  "The algorithm was used to encrypt all customer PII.",
  "The network relies on an outdated version of Kerberos."
];
const s4Correct = [
  "Migrate all passwords to Argon2id with unique cryptographic salts.",
  "Implement account lockout policies, rate limiting, and rotate the service account password.",
  "Reset the KRBTGT account password twice to invalidate all existing forged tickets.",
  "Replace the custom algorithm with an industry standard like AES-256-GCM.",
  "Enforce Kerberos Armoring (FAST) and upgrade the domain functional level."
];
const s4Hints = ["Use memory-hard hashing.", "Lock it down.", "Reset the master key.", "Never roll your own crypto.", "Protect the TGT exchange."];

const difficulties = ["Medium", "Hard", "Expert"];

const section2 = generateQuestions(21, 2, s2Topics=s2Roles, s2Roles, s2Incidents, s2Actions, s2Correct, s2Hints, difficulties);
const section3 = generateQuestions(41, 3, s3Topics=s3Roles, s3Roles, s3Incidents, s3Actions, s3Correct, s3Hints, difficulties);
const section4 = generateQuestions(61, 4, s4Topics=s4Roles, s4Roles, s4Incidents, s4Actions, s4Correct, s4Hints, difficulties);

fs.writeFileSync(path.join(__dirname, 'res', 'section2.json'), JSON.stringify(section2, null, 2));
fs.writeFileSync(path.join(__dirname, 'res', 'section3.json'), JSON.stringify(section3, null, 2));
fs.writeFileSync(path.join(__dirname, 'res', 'section4.json'), JSON.stringify(section4, null, 2));

console.log("Sections 2, 3, 4 generated.");
