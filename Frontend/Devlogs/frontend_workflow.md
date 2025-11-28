# Frontend Workflow

<!-- this file will contain the infomation/workflows of the implemented features -->
# General Flow (Common/General Workflows)

##  Pages (General Flow)
- ### General Workflow :
  - Pages will have at least 2 workflows as follows
    1. Common content over all similar pages (reffer following example):
        - **src/layout/PublicLayout.jsx** → **src/routes/AppRouter.jsx** → **src/App.jsx**
    2. Page Specific content (reffer following example):
        - **src/public/Home.jsx → src/routers/AppRouter.jsx → src/App.jsx**

- ### Deatails:
  - Pages will be classified in 2 main categories:
    - **Public/Common pages :**
      - such pages will not required login credential
      - Public pages will render common navigation 
      - this can be done by making common components/layouts as parent route and main page content as child route to that
    - **Protected Pages :**
      - such pages will either requires credential or spesific role to access perticular data
      - Protected pages will render navigation and sidebars based on the user's role.
      - this can be done by making mapped components/layouts as parent route and main page content as child routes
      - In parent route make sure to configure roles correctly to populate the require data
#

## API Workflow (Common Flow)
- ### General Workflow :
  - **src/api/axiosClient.js → src/api/modules/####.js → src/pages/####.jsx**

- ### Details :
  - **src/api/axiosClient.js :**
    - this file contains following:
      - backend connection configuration
      - read token from already stored user in localStorage
      - General Response format
  - **src/api/modules/ :**
    - this folder will contain multiple files. each such file will will contain dictionary with **{Key: Value}** pairs where:
      - Key = identifier
      - Value = a funtion with relevent endpoint and payload
    ```js
    const candidateAPI = {
        getProfile: (payload) => axiosClient.get("candidates/view_profile", payload),
        exitConfirm: (payload) => axiosClient.post("candidates/exit_confirm", payload),
        joiningConfirm: (payload) => axiosClient.post("candidates/joining_confirm", payload),
    };
    ```
  - **src/pages/ or src/components/** :
    - the configured APIs will be used in some pages or components to get and post data on backend
#


## Public Routes (Common Flow)
- ### General WorkFlow :
  - **src/pages/****.jsx → src/routers/AppRouter.jsx → src/App.jsx**
  - **src/layout/****.jsx → src/routers/AppRouter.jsx → src/App.jsx**

- ### Details:
  - **src/pages/****.jsx & src/layout/****.jsx :** 
    - these files will contain componets which will be rendred on a specific route
  - **src/routers/AppRouter.jsx :**
    - created Routes hirarchy 
      - **parent** : common component (`<PublicLayout />`)
      - **children** : page specific components (`<Login />` & `<Home />`)
    - map the specific components to specific paths/endpoints
    - eg.:
```html
<Route element={<PublicLayout />}>        <!--common component-->
    <Route path='/login' element={<Login />} /> <!--page component-->
    <Route path='/' element={<Home />} />   <!--page component-->
</Route>
```
#

## Proctected Routes (Common Flow)
- ### General WorkFlow :
  - **src/pages/****.jsx → src/routers/ProtectedRoute.jsx → src/routers/AppRouter.jsx → src/App.jsx**
  - **src/layout/****.jsx → src/routers/ProtectedRoute.jsx → src/routers/AppRouter.jsx → src/App.jsx**

- ### Details:
  - **src/pages/****.jsx & src/layout/****.jsx :** 
    - these files will contain componets which will be rendred on a specific route
  - **src/routers/ProtectedRoute.jsx :**
    - this file have the logic to check for valid user.
    - if user is valid then provid access to relevant child routes else redirect to predifined warning page
  - **src/routers/AppRouter.jsx :**
    - created Routes hirarchy and specify access contitions
      - **parent :** Access logic (`<ProtectedRoute />`)
      - **sub-parent :** Common Component (`<DashboardLayout />`)
      - **children :** main page containt wrapped in access conditions (`<CandidateHome />`)
    - map the specific components to specific paths/endpoints
    - eg.:
```html
<Route element={<ProtectedRoute />}>        <!--Access logic wraper-->
    <Route element={<DashboardLayout />}>   <!--common component-->

        {/* Candidate Routes */}
        <Route path='/candidate' element={<ProtectedRoute allowedRoles={['candidate']}/>}>      <!--Access condidition wraper-->
            <Route path='home' element={<CandidateHome />} /> <!--main page content-->
        </Route>
                        
        {/* Institute Routes */}
        <Route path='/institute' element={<ProtectedRoute allowedRoles={['institute']}/>}>     <!--Access condidition wraper-->
            <Route path='home' element={<InstituteHome />} />   <!--main page containt-->
        </Route>

    </Route>
</Route>
```
#

# Features WorkFlow (Specift to certain feature)

## Login
- ### WorkFlow :
  - **src/context/AuthContext.jsx → src/pages/auth/Login.jsx → src/routers/AppRouter.jsx → src/App.jsx**

- ### Details:
  - **src/context/AuthContext.jsx :**  
    - Created 1 state variable 
      - `const [user, setUser]` : this will first check browser's localStorage if userDate exit then store it into `user` else keep it empty
    - Created 2 functions:
      - `const login = (userData) => { ... }` :
        - Store the recieved payload into state variable `user`  
        - Store same payload into LocalStorage of the browser (used for presistance login)
      - `const logout = () => { ... }` :
        - empty the state variable `user`
        - delete the user data from LocalStorage (to prevent presistance login)
    - Make required functions available to all the child components
    # 
  - **src/pages/auth/Login.jsx :**
    - `useEffect(() => { ... })` : if user already exits in local storage then navigate to relevant landing page
    - `const handileLogin = () => {}` : verify login credentials and update localStorag (right now it just a temporary logic for testing purpose)
    - page content
    #
  - **src/routers/AppRouter.jsx :**
    - added a route inside **Public Pages section**
      - `<Route path='/login' element={<Login />} />`
#

## Onboard Students (Institute Feature)

- ### Workflow :
  - **src/api/axiosClient.js → src/api/modules/instituteAPI.js → src/pages/institute/OnboardStudent.jsx → src/routes/ProtectedRoute.jsx → src/routes/AppRouter.jsx → src/App.jsx**

- ### Details :
  - **src/api/axiosClient.js :** API configuration layer. connects the frontend with backend
  - **src/api/modules/instituteAPI.js :** collection of institute module specific endpoints along with params
  - **src/pages/institute/OnboardStudent.jsx :** Form for passing student/candidate data to backend.
    - **a state variable `[form, setForm]` :**
      - defines the data structure in which the data should be passed to backend. all keys should be same as backend payload
    - **const handleChange :**
      - this function updates the relevant key-value pair in the state variable for every input in form
    - **const handleSubmit :**
      - this function will try to call the required API with recieved payload `instituteAPI.onboardStudent(form)`
      - display relevent alert message whenever succeed or failed
    - **[page content] :** React/html code for page components
  - **src/routes/ProtectedRoute.jsx :** access getway for routes
  - **src/routes/AppRouter.jsx :** define route path for `<OnboardStudent />`
  - **src/App.jsx :** main file to run application
#

## Candidate List (Institute Feature)
<!-- this will be moved to Admin Feature in futerue -->
<!-- & this will be updated to Student List in specific college -->

- ### Workflow :
  - **src/api/axiosClient.js → src/api/modules/instituteAPI.js → src/pages/institute/CandidateList.jsx → src/routes/ProtectedRoute.jsx → src/routes/AppRouter.jsx → src/App.jsx**

- ### Details :
  - **src/api/axiosClient.js :** API configuration layer. connects the frontend with backend
  - **src/api/modules/instituteAPI.js :** collection of institute module specific endpoints along with params
  - **src/pages/institute/CandidateList.jsx :** A view to retirve candidates list from backend and display it to user
    - **a state variable [candidates, setCandidates] :** empty state variable.
    - **useEffect() :** whenever the page loads this hook will do following:
      - call relevant API `instituteAPI.getCandidateList()`
      - stored retrived data into state variable `setCandidates`
    - **[page content] :** React/html code for page components & populate the data from state variable
  - **src/routes/ProtectedRoute.jsx :** access getway for routes
  - **src/routes/AppRouter.jsx :** define route path for `<CandidateList />`
  - **src/App.jsx :** main file to run application
#

## Company List (Company Feature)
<!-- this will be moved to Admin Feature in future -->
<!-- & thiw will be updated to Company Profile view -->

- ### Workflow :
  - **src/api/axiosClient.js → src/api/modules/companyAPI.js → src/pages/company/CompanyList.jsx → src/routes/ProtectedRoute.jsx → src/routes/AppRouter.jsx → src/App.jsx**

- ### Details :
  - (Same as **Candidate List (Institute Feature)**)
#

## Employee List (Company Feature)
<!-- this will be moved to Admin Feature in future -->
<!-- & thiw will be updated to Compnay Employees (employees specific to that company) -->

- ### Workflow :
  - **src/api/axiosClient.js → src/api/modules/companyAPI.js → src/pages/company/EmployeeList.jsx → src/routes/ProtectedRoute.jsx → src/routes/AppRouter.jsx → src/App.jsx**

- ### Details :
  - (Same as **Candidate List (Institute Feature)**)
#

## Register Company (Company Feature)

- ### Workflow :
  - **src/api/axiosClient.js → src/api/modules/compnayAPI.js → src/pages/company/RegisterCompany.jsx → src/routes/ProtectedRoute.jsx → src/routes/AppRouter.jsx → src/App.jsx**

- ### Details :
  - (Same as **Onboard Student (Institute Feature)**)
#

## Verify Company (Company Feature)

- ### Workflow :
  - **src/api/axiosClient.js → src/api/modules/compnayAPI.js → src/pages/company/VerifyCompany.jsx → src/routes/ProtectedRoute.jsx → src/routes/AppRouter.jsx → src/App.jsx**

- ### Details :
  - (Same as **Onboard Student (Institute Feature)**)
#

## Onboard Employee (Company Feature)

- ### Workflow :
  - **src/api/axiosClient.js → src/api/modules/compnayAPI.js → src/pages/company/OnboardEmployee.jsx → src/routes/ProtectedRoute.jsx → src/routes/AppRouter.jsx → src/App.jsx**

- ### Details :
  - (Same as **Onboard Student (Institute Feature)**)
#

## Employee Exits (Company Feature)

- ### Workflow :
  - **src/api/axiosClient.js → src/api/modules/compnayAPI.js → src/pages/company/EmployeeExits.jsx → src/routes/ProtectedRoute.jsx → src/routes/AppRouter.jsx → src/App.jsx**

- ### Details :
  - (Same as **Onboard Student (Institute Feature)**)
#

## Candidate Confirms Joining Date (Candidate Feature)

- ### Workflow :
  - **src/api/axiosClient.js → src/api/modules/candidateAPI.js → src/pages/candidate/JoiningConfirm.jsx → src/routes/ProtectedRoute.jsx → src/routes/AppRouter.jsx → src/App.jsx**

- ### Details :
  - (Same as **Onboard Student (Institute Feature)**)
#

## Candidate Confirms Exit Date (Candidate Feature)

- ### Workflow :
  - **src/api/axiosClient.js → src/api/modules/candidateAPI.js → src/pages/candidate/ExitConfirm.jsx → src/routes/ProtectedRoute.jsx → src/routes/AppRouter.jsx → src/App.jsx**

- ### Details :
  - (Same as **Onboard Student (Institute Feature)**)
#

## Candidate Profile View (Candidate Feature)

- ### Workflow :
  - **src/api/axiosClient.js → src/api/modules/compnayAPI.js → src/pages/candidate/Profile.jsx → src/routes/ProtectedRoute.jsx → src/routes/AppRouter.jsx → src/App.jsx**

- ### Details :
  - (Similar to **Candidate List (Institute Feature)** only difference is that data Retireved form API is more complex and needs structuring in html/react page code)