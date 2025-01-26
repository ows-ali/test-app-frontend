import React, { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState({ column: "", value: "" });

  useEffect(() => {
    fetch("http://127.0.0.1:8000/data")
      .then((response) => response.json())
      .then((response) => {
        console.log("1", { response: response });
        setData(response);
        setFilteredData(response);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleFilter = () => {
    const { column, value } = filter;
    fetch(`http://127.0.0.1:8000/data/filtered?column=${column}&value=${value}`)
      .then((response) => response.json())
      .then((response) => {
        console.log({ response });
        if (!response.detail) setFilteredData(response);
      })
      .catch((error) => {
        console.error("Error applying filter:", error);
      });
  };

  console.log({ filteredData });
  return (
    <div className="App">
      <h1>Dataset Viewer</h1>
      <div>
        <input
          type="text"
          placeholder="Column Name"
          value={filter.column}
          onChange={(e) => setFilter({ ...filter, column: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter Value"
          value={filter.value}
          onChange={(e) => setFilter({ ...filter, value: e.target.value })}
        />
        <button onClick={handleFilter}>Apply Filter</button>
      </div>

      <h2>Filtered Data</h2>
      <table border="1">
        <thead>
          <tr>
            {data.length > 0 &&
              Object.keys(data[0]).map((key) => <th key={key}>{key}</th>)}
          </tr>
        </thead>
        <tbody>
          Result
          {filteredData.map((row, index) => (
            <tr key={index}>
              {Object.values(row).map((value, i) => (
                <td key={i}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
