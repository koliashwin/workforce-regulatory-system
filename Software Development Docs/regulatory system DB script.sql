drop table candidates;
drop table employee_history;
drop table employees;
drop table institutes;
drop table companies;
drop table disputes;
drop table Users;

create table Users (
	user_id int primary key auto_increment,
    role_id int not null,
	email varchar(255) unique not null,
	password_hash varchar(255) not null default 'Abced@12345',
	name varchar(255) not null,
    contact_no varchar(10) unique not null,
	dob date not null,
	created_on datetime default current_timestamp,
    updated_on datetime default current_timestamp,
	last_login datetime
);

-- create table roles (
-- 	role_id int primary key auto_increment,
--     role varchar(255) not null,
--     code int not null
-- );

create table Institutes (
	institute_id int primary key auto_increment,
    name varchar(255) not null,
    address text not null,
    contact_no varchar(20) not null,
    email varchar(100) not null,
    verification_status enum('Registered', 'Unknown') not null default 'Unknown'
);

create table Candidates (
	candidate_id int primary key auto_increment,
    institute_id int not null,
    user_id int not null,
    course varchar(255) not null,
    passout_year date not null,
    skills text,
    future_plan varchar(255) default 'employment',
    
    foreign key (institute_id) references Institutes(institute_id),
    foreign key (user_id) references users(user_id)
);

create table Companies (
	company_id int primary key auto_increment,
    cin varchar(30) unique not null,
    name varchar(255) not null,
    address text not null,
    contact_no varchar(20) not null,
    email varchar(100) not null,
    verification_status enum('Registered', 'Unknown') not null default 'Unknown'
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
    status text,
    
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