select * from users;

insert into users (role_id, email, password_hash, name, contact_no, dob)
values 
-- students or freshers 
(100, 'student1@gmail.com', 'abc@123', 'ashwin', '8965412278', '1999-08-14'),
(100, 'student2@gmail.com', 'abc@123', 'atish', '9564328975', '2000-06-04'),
(100, 'student3@gmail.com', 'abc@123', 'asta', '8974126568', '1999-01-10'),
(100, 'student4@gmail.com', 'abc@123', 'raj', '9945211876', '2001-05-02'),

-- employees
(200, 'employee1@gmail.com', 'xyz@789', 'sanjay', '9845632188', '1995-12-26'),
(200, 'employee2@gmail.com', 'xyz@789', 'ramesh', '8985458876', '1995-03-06'),

-- college staff
(300, 'staff1@gmail.com', 'xyz@789', 'harshil', '9818825633', '1996-02-26'),
(300, 'staff2@gmail.com', 'xyz@789', 'vivek', '9885458566', '1994-11-16');

-- -----------------------------------------------------------------

select * from institutes;

insert into institutes (name, address, contact_no, email, verification_status)
values 
('SPIT', 'andheri', 7458987128, 'support@spit.com', 'Registered'),
('PR College', 'GG Road', 8975949872, 'support@prclg.com', 'Unknown'),
('CD College', 'Opp. AB Mall', 7594259872, 'support@cdclg.com', 'Registered'),
('MN College', 'TS building', 8975987362, 'support@mnclg.com', 'Unknown');

-- --------------------------------------------------------------------

select * from companies;

insert into companies (cin, name, address, contact_no, email)
values 
('U39431MH2022PLC635155', 'NeoGen INFOTECH PRIVATE LIMITED', '168, Tower, Tech Park, Delhi, India', 9865748412, 'neogen@info.com'),
('L49290GJ2015PTC637820', 'Omniscient SOLUTIONS LIMITED', '242, Wing, Eureka Tower, Bangalore, India', 8215748412, 'omniscient@company.com');

-- -------------------------------------------------------------------

select * from candidates;

insert into candidates (institute_id, user_id, course, passout_year, skills, future_plan)
values 
(1, 2, 'B.Tech', '2023-03-18', 'Java, PHP, Laravel, SQL', 'employment'),
(2, 4, 'BCA', '2023-03-18', 'Python, ML', 'Higher Study'),
(2, 1, 'MCA', '2023-03-18', 'C++, DSA', 'employment'),
(3, 3, 'engg', '2023-03-18', 'Javascript, Node, ReactJS', 'employment');

-- --------------------------------------------------------------------

select * from employees;
insert into employees (company_id, user_id, designation)
values
(2, 1, 'Backend Developer'),
(2, 3, 'Frontend Developer'),
(1, 2, 'Fullstack Developer');

-- ---------------------------------------------------------

select * from institutes;

select u.name, c.course, i.name as instute_name, i.verification_status, c.passout_year, c.skills, c.future_plan, co.name as company_name, e.designation
from candidates c, users u, institutes i, employees e, companies co
where u.user_id = c.user_id and i.institute_id = c.institute_id and e.user_id = u.user_id and e.company_id = co.company_id;

select * from users u 
join candidates c on u.user_id = c.user_id 
join institutes i on c.institute_id = i.institute_id
left join employees e on e.user_id = u.user_id;
-- -------------------------

-- #### Usecase ####

-- Step 1.0 : clg will upload student data into users and candidates table

-- Step 1.1 : find or add clg in database with one of following
select * from institutes where name = 'SPIT';
-- 				##### or #####
insert into institutes (name, address, contact_no, email, verification_status)
values ('SPIT', 'Andheri', '8954698721', 'abcd@spit.com', 'Registered');

-- Step 1.2 : now clg will create the candidate profile on the platform
insert into users (role_id, email, name, contact_no, dob)
values (100, 'ashwinkoli02@gmail.com', 'Ashwin Koli', '9594694362', '1999-08-04');

insert into candidates (institute_id, user_id, course, passout_year, skills, future_plan)
values (4, 9, 'MCA', '2023-02-20', 'Python, C++, ML, Java', 'employment');

-- check data
select u.name as candidate_name, u.email, u.dob, c.course, c.skills, i.name as clg_name, c.passout_year  from candidates c, users u, institutes i
where u.user_id = c.user_id and c.institute_id = i.institute_id
and u.name like 'Ashwin %';

select * from users;
select * from institutes;
select * from candidates;