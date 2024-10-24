// // SettingsDisplay.test.jsx
// import { render, screen } from "@testing-library/react";
// import "@testing-library/jest-dom";
// import { vi } from "vitest";
// import SettingsDisplay from "./SettingsDisplay";

// // Mocking the useDataConnections hook
// vi.mock("./useDataConnections", () => ({
//   useDataConnections: vi.fn(),
// }));

// describe("SettingsDisplay", () => {
//   const mockDataConnections = {
//     system: [
//       {
//         id: "EPMS",
//         name: "EPMS",
//         description: "The Quantum EPMS database that holds the patient records",
//       },
//       {
//         id: "NDR",
//         name: "National Data Repository",
//         description: "The server where CBS data should be sent to",
//       },
//     ],
//     user: [
//       {
//         id: "MyOwnConnection",
//         name: "My Own Project",
//         description: "My own project",
//       },
//     ],
//   };

//   beforeEach(() => {
//     const { useDataConnections } = require("./useDataConnections");
//     useDataConnections.mockReturnValue(mockDataConnections);
//   });

//   it("renders the system and user connections", () => {
//     render(<SettingsDisplay />);

//     // Check that System Connections section renders
//     const systemHeading = screen.getByText(/System Connections/i);
//     expect(systemHeading).toBeInTheDocument();

//     // Check that User Connections section renders
//     const userHeading = screen.getByText(/User Connections/i);
//     expect(userHeading).toBeInTheDocument();

//     // Check that system connections are rendered
//     mockDataConnections.system.forEach((connection) => {
//       const systemConnection = screen.getByText(connection.name);
//       expect(systemConnection).toBeInTheDocument();
//       const description = screen.getByText(connection.description);
//       expect(description).toBeInTheDocument();
//     });

//     // Check that user connections are rendered
//     mockDataConnections.user.forEach((connection) => {
//       const userConnection = screen.getByText(connection.name);
//       expect(userConnection).toBeInTheDocument();
//       const description = screen.getByText(connection.description);
//       expect(description).toBeInTheDocument();
//     });
//   });

//   it("renders empty state if no data connections are available", () => {
//     const { useDataConnections } = require("./useDataConnections");
//     useDataConnections.mockReturnValue({ system: [], user: [] });

//     render(<SettingsDisplay />);

//     const systemList =
//       screen.getByText(/System Connections/i).nextElementSibling;
//     expect(systemList).toBeEmptyDOMElement();

//     const userList = screen.getByText(/User Connections/i).nextElementSibling;
//     expect(userList).toBeEmptyDOMElement();
//   });

//   it("handles fetch error gracefully", () => {
//     const { useDataConnections } = require("./useDataConnections");
//     useDataConnections.mockImplementation(() => {
//       throw new Error("Failed to fetch");
//     });

//     render(<SettingsDisplay />);

//     // We expect nothing to render if data fetch fails, so just ensure the component didn't break
//     expect(screen.queryByText(/System Connections/i)).toBeNull();
//     expect(screen.queryByText(/User Connections/i)).toBeNull();
//   });
// });
