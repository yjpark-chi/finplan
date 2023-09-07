import React, { useState, useEffect } from "react";
import './App.css'
import axios from "axios";
import Form from "./components/Form.jsx";
import Income from "./components/Income.jsx";



function App() {

    const [curView, setView] = useState("main");
    const [profileData, setProfileData] = useState(null);


    const goBack = () => {
        setProfileData(null);
        setView("main")
    };


    function showProfile() {
        return (
            <div>
            <h1>This month,</h1>
            {profileData &&
                <div>
                    <p>You earned: {profileData.monthly_income}</p>
                    <p>You spent: {profileData.monthly_spend}</p>
                </div>
            }
            <button onClick={goBack}>Back</button>
            </div>
        )
    };


    function showForm() {
        return (
            <div>
                <h1>Enter your spending here</h1>
                <Form 
                    postData={postData}/>
                <br/>
                <button onClick={goBack}>Back</button>
            </div>
        )
    }

    function showAddIncome() {
        return (
            <div>
            <h1>Enter your income</h1>

            <Income
                postData={postData}/><br/>
            <button onClick={goBack}>Back</button>
            </div>
        )
    };

    function getAccountData() {
        axios({
            method: "GET",
            url:"http://localhost:5000/profile",
        })
        .then((response) => {
            const res = response.data
            setProfileData(({
                monthly_spend: res.spend,
                monthly_income: res.income}))
            setView("profile")
        }).catch((error) => {
            if (error.response) {
                console.log(error.response)
                console.log(error.response.status)
                }
        })
    }

    function postData(data, endpoint) {
        var url = `http://localhost:5000/${endpoint}`;

        axios.post(url, data)
            .then((response) => {
                console.log(response);
            }).catch((error) => {
                if (error.response) {
                    console.log(error.response)
                    console.log(error.response.status)
                }
            });
    }

    function displayView() {
        if (curView == "main") {
            return (
                <div>
                    <h1>Hello, what would you like to do today?</h1>
                    <button onClick={getAccountData}>Overview</button><br/><br/>
                    <button onClick={() => setView("add")}>Add spending</button><br/><br/>
                    <button onClick={() => setView("income")}>Add income</button>
                </div>
            );
        } else if (curView == "profile") {
            return (
                showProfile()
            )
        } else if (curView == "add") {
            return (
                showForm()
            )
        } else if (curView == "income") {
            return (
                showAddIncome()
            )
        }
    }

    return (
        <div>
            {displayView()}
        </div>
    )
    
}

export default App
