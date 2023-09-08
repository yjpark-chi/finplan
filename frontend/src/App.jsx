import React, { useState, useEffect } from "react";
import './App.css'
import axios from "axios";
import Form from "./components/Form.jsx";
import Income from "./components/Income.jsx";
import Profile from "./components/Profile.jsx";



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
                    <Profile
                        getAccountData={getAccountData}/>
                    <br />
                    {profileData &&
                        <div>
                            You earned: ${profileData.monthly_income}<br/><br/>
                            You spent:
                            {
                                Object.keys(profileData.monthly_spend).map((key, index) => ( 
                                <p key={index}>{key}: ${profileData.monthly_spend[key]}</p> 
                                ))
                            }
                            {renderSavingsMessage()}<br/><br/>
                        </div>
                    }
                <button onClick={goBack}>Back</button>
            </div>
        )
    };

    const calculateSavings = () => {
        if (!profileData) {
            console.log("Error: could not retrieve profile data.");
            return null;
        }

        const savings = profileData.monthly_income - profileData.monthly_spend['Total'];
        return savings;
    };

    const renderSavingsMessage = () => {
        const savings = calculateSavings();
    
        if (savings === null) {
            console.log("Error: could not retrieve profile data.")
            return null;
        }
    
        const message = savings >= 0 ? 'You saved:' : 'You overspent:';
        const color = savings >= 0 ? 'green' : 'red';
        const fontWeight = 'bold';
    
        return (
            <div style={{ color, fontWeight }}>
            {message} ${savings}
            </div>
        );
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

    function getAccountData(data) {
        const url = `http://localhost:5000/profile?month=${data[0]["month"]}&year=${data[0]["year"]}`;
        axios({
            method: "GET",
            url: url,
        })
        .then((response) => {
            const res = response.data
            setProfileData(({
                monthly_spend: res.spend,
                monthly_income: res.income}))
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
                    <button onClick={() => setView("profile")}>Overview</button><br/><br/>
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
