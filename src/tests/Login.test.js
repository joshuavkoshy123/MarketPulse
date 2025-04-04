import React from "react";
import {render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../components/Login";
import {signInWithEmailAndPassword } from "firebase/auth";
import {BrowserRouter } from "react-router-dom";

jest.mock("firebase/auth", () => ({
	getAuth: jest.fn(() => ({})),
	signInWithEmailAndPassword: jest.fn(),
}));

jest.mock("firebase/analytics", () => ({
	getAnalytics: jest.fn(),
	isSupported: jest.fn(() => Promise.resolve(false)),
}));

jest.mock("firebase/app", () => ({
  	initializeApp: jest.fn(() => ({})),
}));

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useNavigate: () => jest.fn(),
}));

const renderWithRouter = (ui) => {
  	return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Login component", () => {
	test("Valid input", () => {
		renderWithRouter(<Login />);

		fireEvent.change(screen.getByPlaceholderText("Email"), {
			target: {value: "test@email.com"},
		});
		fireEvent.change(screen.getByPlaceholderText("Password"), {
			target: {value: "TestPassword"},
		});

		expect(screen.getByPlaceholderText("Email").value).toBe("test@email.com");
		expect(screen.getByPlaceholderText("Password").value).toBe("TestPassword");
	});

	test("Password shorter than 8 chars", async () => {
		signInWithEmailAndPassword.mockRejectedValueOnce(new Error("Password too short"));
		renderWithRouter(<Login />);

		fireEvent.change(screen.getByPlaceholderText("Email"), {
			target: {value: "test@email.com"},
		});
		fireEvent.change(screen.getByPlaceholderText("Password"), {
			target: {value: "Pass"},
		});
		fireEvent.click(screen.getByRole("button", {name: /login/i}));

		const errorDiv = await waitFor(() => screen.getByText("Password too short"));
		expect(errorDiv).toBeInTheDocument();
	});

	test("Email shorter than 4 chars", async () => {
		signInWithEmailAndPassword.mockRejectedValueOnce(new Error("Email too short"));
		renderWithRouter(<Login />);

		fireEvent.change(screen.getByPlaceholderText("Email"), {
			target: {value: "a"},
		});
		fireEvent.change(screen.getByPlaceholderText("Password"), {
			target: {value: "TestPassword"},
		});
		fireEvent.click(screen.getByRole("button", {name: /login/i}));

		const errorDiv = await waitFor(() => screen.getByText("Email too short"));
		expect(errorDiv).toBeInTheDocument();
	});

  	test("Email with spaces", async () => {
		signInWithEmailAndPassword.mockRejectedValueOnce(new Error("Email contains spaces"));
		renderWithRouter(<Login />);

		fireEvent.change(screen.getByPlaceholderText("Email"), {
			target: {value: "test @email.com"},
		});
		fireEvent.change(screen.getByPlaceholderText("Password"), {
			target: {value: "TestPassword"},
		});
		fireEvent.click(screen.getByRole("button", {name: /login/i}));

		const errorDiv = await waitFor(() => screen.getByText("Email contains spaces"));
		expect(errorDiv).toBeInTheDocument();
	});

  	test("Password with spaces", async () => {
		signInWithEmailAndPassword.mockRejectedValueOnce(new Error("Password contains spaces"));
		renderWithRouter(<Login />);

		fireEvent.change(screen.getByPlaceholderText("Email"), {
			target: {value: "test@email.com"},
		});
		fireEvent.change(screen.getByPlaceholderText("Password"), {
			target: {value: "Test Password"},
		});
		fireEvent.click(screen.getByRole("button", {name: /login/i }));

		const errorDiv = await waitFor(() => screen.getByText("Password contains spaces"));
		expect(errorDiv).toBeInTheDocument();
  	});
});
