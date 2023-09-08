import { useState } from "react";

function Profile( {getAccountData} ) {
    const [inputVals, setInputVals] = useState([{
        month: "",
        year: ""}
    ]);

    const onValChange = (event, ind) => {
        let data = [...inputVals];
        data[ind][event.target.name] = event.target.value;

        setInputVals(data);
    }

    const setMonth = (e, ind) => {
        let data = [...inputVals];
        data[ind]["month"] = e.target.value;

        setInputVals(data);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = [...inputVals];

        getAccountData(data);
    }

    return (
        <div>
            <form>
            {inputVals.map((input, ind) => {
                return (
                    <div key={ind}>
                        <select
                        value={input.month}
                        onChange={e=>setMonth(e, ind)}>
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
                            onChange={e => onValChange(e, ind)}
                        />&nbsp;
                    </div>
                    
                )
            })}
            <br/>
            <div>
                <button
                    type="submit"
                    onClick={e => handleSubmit(e)}>Submit
                </button>
            </div>
        </form>
        </div>
    );
}

export default Profile;