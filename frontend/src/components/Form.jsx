import { useState} from "react"


function Form( {postData} ) {
    const [confirmationMessage, setConfirmationMessage] = useState("");
    const [inputVals, setInputVals] = useState([{
        date: '',
        amount: '',
        type: '',
        notes: ''
        }
    ]);

    const onValChange = (ind, event) => {
        let data = [...inputVals];
        data[ind][event.target.name] = event.target.value;
        setInputVals(data);
    };

    const addRow = () => {
        let newrow = {
            date: '',
            amount: '',
            type: '',
            notes: ''
        };
        setInputVals([...inputVals, newrow]);
    };

    const removeRow = (ind) => {
        let data = [...inputVals];
        data.splice(ind, 1);
        setInputVals(data);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fieldIsEmpty = inputVals.some((input) =>
            input.date === "" || input.amount === ""
        );
    
        if (fieldIsEmpty) {
            alert("Please fill in all fields before submitting.");
        } else {
            let data = [...inputVals];
            postData(data, "add-spending");
            setConfirmationMessage("Submitted!");
            setTimeout(() => setConfirmationMessage(""), 3000);
        }
    };

    const clearInputs = () => {
        setInputVals([{
            date: '',
            amount: '',
            type: '',
            notes: ''}
        ]);
        setConfirmationMessage("");
    }

    const setType = (ind, e) => {
        let data = [...inputVals];
        data[ind]["type"] = e.target.value;
        setInputVals(data);
    }

    return (
        <form>
            {inputVals.map((input, ind) => {
                return (
                    <div key={ind}>
                        <input
                            type='date'
                            name='date'
                            placeholder="Date"
                            value={input.date}
                            onChange={event => onValChange(ind, event)}
                        />&nbsp;
                        <input 
                            type='number'
                            name='amount'
                            placeholder='Amount'
                            value={input.amount}
                            onChange={event => onValChange(ind, event)}
                        />&nbsp;
                        <select 
                            value={input.type}
                            onChange={e=>setType(ind, e)}>
                            <option />
                            <option value="Housing">Housing</option>
                            <option value="Transportation">Transportation</option>
                            <option value="Groceries">Groceries</option>
                            <option value="Utilities">Utilities and Insurance</option>
                            <option value="Medical">Medical and Healthcare</option>
                            <option value="Savings">Savings, Investments, and Debt Payments</option>
                            <option value="Entertainment">Entertainment, Leisure, and Recreation</option>
                            <option value="Other">Other</option>
                        </select>&nbsp;
                        <input 
                            name='notes'
                            placeholder='Notes (optional)'
                            value={input.notes}
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
            {confirmationMessage && <p>{confirmationMessage}</p>}
        </form>
    )
}


export default Form;