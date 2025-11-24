import React, { useEffect } from 'react'
import instituteAPI from '../../api/modules/instituteAPI'

const InstituteHome = () => {
    // api testing
    // useEffect(() => {
    //     instituteAPI.getStudents()
    //         .then((res) => console.log(res.data))
    //         .catch((err) => console.log(err))
    // }, [])

    

    const create_sample_student = () => {
        const sample_student_data = {
            "role_id": 100,
            "email": "prajwal3@mail.com",
            "password_hash": "string",
            "name": "Prajwal Warkhade",
            "contact_no": "7587412154",
            "dob": "1997-07-23",
            "created_on": "string",
            "updated_on": "string",
            "last_login": "string",
            "user_id": 0,
            "institute_id": 1,
            "course": "MCA",
            "passout_year": "2023-02-20",
            "skills": "Java, SpringBoot",
            "institute_name": "string",
            "institute_email": "clg1@mail.com",
            "institute_code": 0
        }

        instituteAPI.addStudents(sample_student_data)
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err))
    }

    const get_students_list = () => {
        instituteAPI.getStudents()
            .then((res) => console.log(res.data))
            .catch((err) => console.log(err))
    }

    return (
        <>
        <h1>Institute Home page</h1>
        <button onClick={create_sample_student}>Create Student</button>
        <button onClick={get_students_list}>Student List</button>
        </>
    )
}

export default InstituteHome
