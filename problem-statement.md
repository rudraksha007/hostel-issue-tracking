# Problem Statement 2: Smart Hostel Issue Tracking System
Design and develop a full-stack web platform that enables students and hostel/campus authorities to efficiently report, track, and resolve hostelrelated issues. The system should improve transparency, reduce response time, and provide data-driven insights into recurring infrastructure problems.
## Objective
To replace informal complaint methods (verbal complaints, WhatsApp groups, paper registers) with a structured, accountable, and traceable digital system for hostel and campus facility management.
### Core Functional Requirements
#### 1. Authentication & Role-Based Access Control
- Secure authentication system with clearly defined roles:
    - Student: Can report issues, view status, and interact with announcements.
    - Management: Full system control, issue assignment, analytics, and moderation. Can view assigned issues, update status, and add remarks.
- Access and visibility strictly governed by role permissions
#### 2. Issue Reporting System
- Students can report issues with:
    - Category (plumbing, electrical, cleanliness, internet, furniture, etc.).
    - Priority level (low, medium, high, emergency).
    - Description with optional media uploads (images/videos).
- Issue visibility options:
    - Public issues visible to all users.
    - Private issues visible only to hostel management and relevant staff.
- Automatic tagging with hostel, block, and room based on user profile.
#### 3. Issue Status Workflow
- Defined lifecycle: Reported → Assigned → In Progress → Resolved → Closed
- Assignment to specific caretakers or maintenance teams.
- Timestamp tracking for all status changes.
#### 4. Hostel-Specific News & Announcements
- Announcement system for updates such as:
    - Cleaning schedules.
    - Pest control drives.
    - Water or electricity downtime.
    - Maintenance notices.
- Announcements targeted by hostel, block/wing, and user role.
#### 5. Lost & Found Module
- Section for reporting lost or found items within hostel premises.
- Features include item description, location, date, images, and status (lost, found, claimed).
- Claim workflow through the platform with admin or caretaker moderation.
#### 6. Analytics & Monitoring Dashboard
- Management dashboard displaying:
    - Most frequently reported issue categories.
    - Hostel/block-wise issue density.
    - Average response and resolution times.
    - Pending vs resolved issue ratios.
    - Public issues only.
#### 7. Extended / Value-Added Features
 - Community Interaction: Interaction on public issues and announcements through comments, threaded replies, and reactions. Helps validate recurring issues and highlight urgency. 
 - Duplicate Issue Management: Ability to merge similar or duplicate issues while preserving all reporters under a single resolution workflow.