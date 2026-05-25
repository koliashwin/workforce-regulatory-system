drop table if exists candidates;
drop table if exists employee_history;
drop table if exists employees;
drop table if exists institutes;
drop table if exists companies;
drop table if exists disputes;
drop table if exists Users;
drop table if exists roles;

create table roles (
	role_id int primary key auto_increment,
    role varchar(255) not null,
    role_code int unique not null
);

create table Users (
	user_id int primary key auto_increment,
    role_code int not null,
	email varchar(255) unique not null,
	password_hash varchar(255) not null default 'Abced@12345',
	name varchar(255) not null,
    contact_no varchar(10) unique not null,
	dob date not null,
	created_on datetime default current_timestamp,
    updated_on datetime default current_timestamp,
	last_login datetime,
    
    foreign key(role_code) references roles(role_code)
);

create table Institutes (
	institute_id int primary key auto_increment,
    institute_code int unique not null,
    user_id int not null,
    name varchar(255) not null,
    address text not null,
    contact_no varchar(20) not null,
    email varchar(100) not null,
    verification_status enum('Registered', 'Unknown') not null default 'Unknown',
    foreign key (user_id) references users(user_id)
);

create table Candidates (
	candidate_id int primary key auto_increment,
    institute_id int not null,
    user_id int not null,
    course varchar(255) not null,
    passout_year year not null,
    skills text,
    future_plan varchar(255) default 'employment',
    
    foreign key (institute_id) references Institutes(institute_id),
    foreign key (user_id) references users(user_id)
);

create table Companies (
	company_id int primary key auto_increment,
    cin varchar(30) unique not null,
    user_id int not null,
    name varchar(255) not null,
    address text not null,
    contact_no varchar(20) not null,
    email varchar(100) not null,
    verification_status enum('Registered', 'Unknown') not null default 'Unknown',
    foreign key (user_id) references users(user_id)
);

create table Employees (
	emp_id int primary key auto_increment,
    company_id int not null,
    user_id int not null,
    designation varchar(255) not null,
    
    foreign key (user_id) references users(user_id),
    foreign key (company_id) references companies(company_id)
);

create table Employee_history (
	history_id int primary key auto_increment,
    company_id int not null,
    emp_id int not null,
    joining_date date not null,
    exit_date date,
    status varchar(100),
    
    foreign key (company_id) references companies(company_id),
    foreign key (emp_id) references employees(emp_id)
);

create table disputes (
	dispute_id int primary key auto_increment,
    raised_by_type enum('candidate', 'employee', 'company', 'institute') not null,
    raised_by_id int not null,
    raised_against_type enum('candidate', 'employee', 'company', 'institute') not null,
    raised_against_id int not null,
    topic varchar(255) not null,
    description text,
    status ENUM('pending','under_review','resolved','rejected') not null default 'pending',
    created_on datetime default current_timestamp,
    updated_on datetime default current_timestamp on update current_timestamp
);

create table audit_logs (
	log_id int primary key auto_increment,
    action varchar(200) not null,
    performed_by varchar(100),
    performed_by_id int,
    target_type varchar(100),
    target_id int,
    description text,
    metadata json,
    created_on datetime default current_timestamp
);

-- DB alteration in iteration 2

-- ── 1. Add joining_date_company & exit_date_company columns ──
-- Separate company-submitted dates from candidate-confirmed dates
-- This is how we detect mismatches cleanly

ALTER TABLE employee_history
    ADD COLUMN joining_date_company DATE,
    ADD COLUMN joining_date_candidate DATE,
    ADD COLUMN exit_date_company DATE,
    ADD COLUMN exit_date_candidate DATE;

-- Migrate existing data — treat existing joining_date as company-submitted
UPDATE employee_history SET joining_date_company = joining_date where joining_date is not null;
UPDATE employee_history SET exit_date_company = exit_date WHERE exit_date IS NOT NULL;

DESCRIBE employee_history;

-- ── 2. Update status ENUM with full lifecycle states ──────────
ALTER TABLE employee_history
    MODIFY COLUMN status ENUM(
        'joining initiated',
        'joining confirmed',
        'joining date mismatch',
        'joining completed',
        'joining documents incomplete',
        'exit initiated',
        'exit confirmed',
        'exit date mismatch',
        'exit completed',
        'exit documents incomplete'
    ) DEFAULT 'joining initiated';

-- ── 3. Joining documents table ────────────────────────────────
CREATE TABLE joining_documents (
    doc_id          INT PRIMARY KEY AUTO_INCREMENT,
    history_id      INT NOT NULL,
    emp_id          INT NOT NULL,

    -- Documents company gives to candidate (received by candidate)
    offer_letter            BOOLEAN DEFAULT FALSE,
    appointment_letter      BOOLEAN DEFAULT FALSE,
    salary_breakdown        BOOLEAN DEFAULT FALSE,
    nda_agreement           BOOLEAN DEFAULT FALSE,
    id_card_issued          BOOLEAN DEFAULT FALSE,

    -- Documents candidate submits to company
    aadhaar_submitted       BOOLEAN DEFAULT FALSE,
    pan_submitted           BOOLEAN DEFAULT FALSE,
    form_11_submitted       BOOLEAN DEFAULT FALSE,
    bank_details_submitted  BOOLEAN DEFAULT FALSE,
    photos_submitted        BOOLEAN DEFAULT FALSE,
    education_docs_submitted BOOLEAN DEFAULT FALSE,
    prev_exp_docs_submitted BOOLEAN DEFAULT FALSE,

    -- Meta
    submitted_by    INT NOT NULL,       -- user_id of candidate
    submitted_on    DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes           TEXT,

    FOREIGN KEY (history_id) REFERENCES employee_history(history_id),
    FOREIGN KEY (emp_id)     REFERENCES employees(emp_id)
);

-- ── 4. Exit documents table ───────────────────────────────────
CREATE TABLE exit_documents (
    doc_id          INT PRIMARY KEY AUTO_INCREMENT,
    history_id      INT NOT NULL,
    emp_id          INT NOT NULL,

    -- Documents candidate receives from company
    experience_letter       BOOLEAN DEFAULT FALSE,
    relieving_letter        BOOLEAN DEFAULT FALSE,
    fnf_settlement          BOOLEAN DEFAULT FALSE,
    salary_slip_last3       BOOLEAN DEFAULT FALSE,
    pf_contribution_letter  BOOLEAN DEFAULT FALSE,
    no_dues_certificate     BOOLEAN DEFAULT FALSE,
    form_16                 BOOLEAN DEFAULT FALSE,

    -- Documents candidate submits to company
    resignation_email       BOOLEAN DEFAULT FALSE,
    company_id_returned     BOOLEAN DEFAULT FALSE,
    company_assets_returned BOOLEAN DEFAULT FALSE,
    nda_compliance          BOOLEAN DEFAULT FALSE,

    -- Meta
    submitted_by    INT NOT NULL,       -- user_id of candidate
    submitted_on    DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes           TEXT,

    FOREIGN KEY (history_id) REFERENCES employee_history(history_id),
    FOREIGN KEY (emp_id)     REFERENCES employees(emp_id)
);

-- ── 5. Fix disputes status ENUM ───────────────────────────────
-- Standardise to use spaces (matches your service code)
ALTER TABLE disputes
    MODIFY COLUMN status ENUM(
        'pending',
        'under review',
        'resolved',
        'rejected'
    ) NOT NULL DEFAULT 'pending';


-- Notifications 

CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id         INT NOT NULL,
    type            VARCHAR(60) NOT NULL,
    title           VARCHAR(160) NOT NULL,
    message         TEXT NOT NULL,
    is_read         BOOLEAN DEFAULT FALSE,
    created_on      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user_unread
    ON notifications (user_id, is_read, created_on DESC);
