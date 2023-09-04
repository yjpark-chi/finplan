import { useState } from "react";

function Income({ postData }) {
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [inputVals, setInputVals] = useState([{
        month: "",
        year: "",
        income: ""}
    ]);

    const addRow = () => {
        let newrow = {
            month: "",
            year: "",
            income: ""};
        setInputVals([...inputVals, newrow]);
    };

    const clearInputs = () => {
        setInputVals([{
            month: "",
            year: "",
            income: ""},
        ]);
        setConfirmationMessage("");
    };

    const onValChange = (ind, event) => {
        let data = [...inputVals];
        data[ind][event.target.name] = event.target.value;
        setInputVals(data);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(inputVals);
        const fieldIsEmpty = inputVals.some((input) =>
            input.month === "" || input.year === "" || input.income === ""
        );
        if (fieldIsEmpty) {
            alert("Please fill out all fields.");
        } else {
            let data = [...inputVals];
            postData(data, "add-income");
            setConfirmationMessage("Submitted!");
            setTimeout(() => setConfirmationMessage(""), 3000);
        }
    };

    const setMonth = (ind, e) => {
        let data = [...inputVals];
        data[ind]["month"] = e.target.value;
        setInputVals(data);
    };

    const removeRow = (ind) => {
        let data = [...inputVals];
        data.splice(ind, 1);
        setInputVals(data);
    };

    return (
        <div>
            <form>
            {inputVals.map((input, ind) => {
                return (
                    <div key={ind}>
                        <select
                        value={input.month}
                        onChange={e=>setMonth(ind, e)}>
                            <option value="">Select month</option>
                            <option value="January">January</option>
                            <option value="February">February</option>
                            <option value="March">March</option>
                            <option value="April">April</option>
                            <option value="April">May</option>
                            <option value="June">June</option>
                            <option value="July">July</option>
                            <option value="August">August</option>
                            <option value="September">September</option>
                            <option value="Octber">October</option>
                            <option value="November">November</option>
                            <option value="December">December</option>
                        </select>&nbsp;
                        <input 
                            type='text'
                            name='year'
                            placeholder='Year (ex: 2023)'
                            value={input.year}
                            onChange={event => onValChange(ind, event)}
                        />&nbsp;
                        <input 
                            type='number'
                            name='income'
                            placeholder='Income (ex: 1000)'
                            value={input.income}
                            onChange={event => onValChange(ind, event)}
                        />&nbsp;
                        <button onClick={()=>removeRow(ind)}>Remove</button>
                    </div>
                    
                )
            })}
            <br/>
            <div>
                <button
                    type="button"
                    onClick={addRow}>Add row
                </button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button
                    type="submit"
                    onClick={e => handleSubmit(e)}>Submit
                </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button
                    type="button"
                    onClick={clearInputs}>Clear all
                </button>
            </div>
        </form>
        {confirmationMessage && <p>{confirmationMessage}</p>}
        </div>
    );
}

export default Income;
