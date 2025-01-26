import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, TextField, Typography } from "@mui/material";

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetch("https://test-app-backend-agr5.onrender.com/data")
      .then((response) => response.json())
      .then((jsonData) => {
        let filtered = [];
        jsonData.map((data) => {
          filtered.push({
            flowName: data.flowName,
            CAS: data.CAS,
            processName: data.processName,
            country: data.country,
            processDescription: data.processDescription,
            bioCarbonContent: data.bioCarbonContent,
            carbonContent: data.carbonContent,
            referencePeriod: data.referencePeriod,
            OverallQuality: data.OverallQuality,
            Completeness_TfS: data.Completeness_TfS,
          });
        });
        setData(filtered);
        setFilteredData(filtered);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // Handle Search
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);
    if (value) {
      setFilteredData(
        data.filter((row) =>
          Object.values(row).some((field) =>
            String(field).toLowerCase().includes(value)
          )
        )
      );
    } else {
      setFilteredData(data);
    }
  };

  // Convert data keys to columns dynamically
  const columns =
    data.length > 0
      ? Object.keys(data[0]).map((key) => ({
          field: key,
          headerName: key.toUpperCase(),
          flex: 1,
          sortable: true,
        }))
      : [];

  if (loading) return <Typography variant="h6">Loading data...</Typography>;

  return (
    <Box sx={{ height: "100vh", padding: 4, backgroundColor: "#f9f9f9" }}>
      <Box
        sx={{
          margin: "auto",
          backgroundColor: "#fff",
          padding: 3,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2, textAlign: "center" }}>
          Carbon Content Data
        </Typography>

        {/* Search Box */}
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchText}
          onChange={handleSearch}
          sx={{ marginBottom: 2 }}
        />

        {/* Data Grid */}
        <Box sx={{ height: 600 }}>
          <DataGrid
            rows={filteredData.map((row, index) => ({ id: index, ...row }))}
            columns={columns}
            disableSelectionOnClick
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 15,
                },
              },
            }}
            pageSizeOptions={[15, 25, 35]}
            autoHeight
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-cell": {
                textAlign: "center",
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default App;
