import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App"; // Adjust the path to your App component

describe("App Component", () => {
  beforeEach(() => {
    // Mock the fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              flowName: "Flow 1",
              CAS: "12345",
              processName: "Process A",
              country: "Country 1",
              processDescription: "Description 1",
              bioCarbonContent: 10,
              carbonContent: 20,
              referencePeriod: "2021",
              OverallQuality: "Good",
              Completeness_TfS: "Complete",
            },
            {
              flowName: "Flow 2",
              CAS: "67890",
              processName: "Process B",
              country: "Country 2",
              processDescription: "Description 2",
              bioCarbonContent: 15,
              carbonContent: 25,
              referencePeriod: "2022",
              OverallQuality: "Excellent",
              Completeness_TfS: "Complete",
            },
          ]),
      })
    );
  });

  test("should display loading text initially", () => {
    render(<App />);
    // Check for loading text before data is fetched
    expect(screen.getByText(/Loading data.../i)).toBeInTheDocument();
  });

  test("should display data after fetch", async () => {
    render(<App />);

    // Wait for the data to be fetched and displayed
    await screen.findByText(/Carbon Content Data/i);

    // Check if the data grid is displayed after data is fetched
    expect(screen.getByText(/Flow 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Flow 2/i)).toBeInTheDocument();
  });

  test("should filter rows based on search input", async () => {
    render(<App />);

    // Wait for data to load
    await screen.findByText(/Carbon Content Data/i);

    // Find the search box and simulate typing in the input
    const searchInput = screen.getByLabelText(/Search/i);
    fireEvent.change(searchInput, { target: { value: "Flow 1" } });

    // Check if only the relevant row appears
    expect(screen.getByText(/Flow 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/Flow 2/i)).not.toBeInTheDocument();
  });

  test("should display no results if search term doesn't match", async () => {
    render(<App />);

    // Wait for data to load
    await screen.findByText(/Carbon Content Data/i);

    // Find the search box and simulate typing a term that doesn't exist
    const searchInput = screen.getByLabelText(/Search/i);
    fireEvent.change(searchInput, { target: { value: "Non-existent Flow" } });

    // Check if no rows are displayed
    expect(screen.queryByText(/Flow 1/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Flow 2/i)).not.toBeInTheDocument();
  });
});
