import React from "react";
import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import AuthPage from "../components/Login";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {BrowserRouter} from "react-router-dom";
import {setDoc} from "firebase/firestore";

jest.mock("firebase/auth", () => ({
	getAuth: jest.fn(() => ({})),
	createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock("firebase/analytics", () => ({
	getAnalytics: jest.fn(),
	isSupported: jest.fn(() => Promise.resolve(false)),
}));

jest.mock("firebase/app", () => ({
  	initializeApp: jest.fn(() => ({})),
}));

jest.mock("firebase/firestore", () => ({
    getFirestore: jest.fn(() => ({})),
    doc: jest.fn(() => ({})),
    setDoc: jest.fn(() => Promise.resolve()),
}));

jest.mock("react-router-dom", () => ({
	...jest.requireActual("react-router-dom"),
	useNavigate: () => jest.fn(),
}));
  

const renderSignup = () => {
    render(
        <BrowserRouter>
        <AuthPage />
        </BrowserRouter>
    );
    fireEvent.click(screen.getByText("Don't have an account? Sign Up"));
};

describe("SignUp component", () => {
    test("Password must be minimum of 8 characters long", async () => {
        createUserWithEmailAndPassword.mockRejectedValueOnce(new Error("Password must be minimum of 8 characters long"));
        renderSignup();

        fireEvent.change(screen.getByPlaceholderText("First Name"), {
            target: { value: "Peter" },
        });
        fireEvent.change(screen.getByPlaceholderText("Last Name"), {
            target: { value: "Parker" },
        });
        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "H123456@gmail.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "234" },
        });
        fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

        const error = await waitFor(() =>
            screen.getByText("Password must be minimum of 8 characters long")
        );
        expect(error).toBeInTheDocument();
    });

    test("Email must be minimum of 4 characters long", async () => {
        createUserWithEmailAndPassword.mockRejectedValueOnce(new Error("Email must be minimum of 4 characters long"));
        renderSignup();

        fireEvent.change(screen.getByPlaceholderText("First Name"), {
            target: { value: "Peter" },
        });
        fireEvent.change(screen.getByPlaceholderText("Last Name"), {
            target: { value: "Parker" },
        });
        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "h@gmail.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "123456789!" },
        });
        fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

        const error = await waitFor(() =>
            screen.getByText("Email must be minimum of 4 characters long")
        );
        expect(error).toBeInTheDocument();
    });

    test("Email contains spaces", async () => {
        createUserWithEmailAndPassword.mockRejectedValueOnce(new Error("Email contains spaces, re-enter username"));
        renderSignup();

        fireEvent.change(screen.getByPlaceholderText("First Name"), {
            target: { value: "Peter" },
        });
        fireEvent.change(screen.getByPlaceholderText("Last Name"), {
            target: { value: "Parker" },
        });
        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "H124566 @gmail.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "123456789!" },
        });
        fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

        const error = await waitFor(() =>
            screen.getByText("Email contains spaces, re-enter username")
        );
        expect(error).toBeInTheDocument();
    });

    test("Password includes spaces", async () => {
        createUserWithEmailAndPassword.mockRejectedValueOnce(new Error("Password includes spaces, please re-enter password"));
        renderSignup();

        fireEvent.change(screen.getByPlaceholderText("First Name"), {
            target: { value: "Peter" },
        });
        fireEvent.change(screen.getByPlaceholderText("Last Name"), {
            target: { value: "Parker" },
        });
        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "H123456@gmail.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "12   455555" },
        });
        fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

        const error = await waitFor(() =>
            screen.getByText("Password includes spaces, please re-enter password")
        );
        expect(error).toBeInTheDocument();
    });

    test("Sign-up successful", async () => {
        createUserWithEmailAndPassword.mockResolvedValueOnce({ user: { uid: "user123" } });
        renderSignup();

        fireEvent.change(screen.getByPlaceholderText("First Name"), {
            target: { value: "Peter" },
        });
        fireEvent.change(screen.getByPlaceholderText("Last Name"), {
            target: { value: "Parker" },
        });
        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "spideyisbest@gmail.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "Webs420!" },
        });
        fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

        await waitFor(() => expect(setDoc).toHaveBeenCalled());
    });

    test("First Name too long", async () => {
        createUserWithEmailAndPassword.mockRejectedValueOnce(new Error("First Name invalid, must be between 1 to 27 characters long"));
        renderSignup();

        fireEvent.change(screen.getByPlaceholderText("First Name"), {
            target: { value: "Featherstonehaughwetherell" },
        });
        fireEvent.change(screen.getByPlaceholderText("Last Name"), {
            target: { value: "Parker" },
        });
        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "H123456@gmail.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "123456789!" },
        });
        fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

        const error = await waitFor(() =>
            screen.getByText("First Name invalid, must be between 1 to 27 characters long")
        );
        expect(error).toBeInTheDocument();
    });

    test("Last Name too long", async () => {
        createUserWithEmailAndPassword.mockRejectedValueOnce(new Error("Last Name invalid, must be between 1 to 27 characters long"));
        renderSignup();

        fireEvent.change(screen.getByPlaceholderText("First Name"), {
            target: { value: "Peter" },
        });
        fireEvent.change(screen.getByPlaceholderText("Last Name"), {
            target: { value: "Featherstonehaughwetherell" },
        });
        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "H123456@gmail.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "123456789!" },
        });
        fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

        const error = await waitFor(() =>
            screen.getByText("Last Name invalid, must be between 1 to 27 characters long")
        );
        expect(error).toBeInTheDocument();
    });

    test("First Name contains special characters", async () => {
        createUserWithEmailAndPassword.mockRejectedValueOnce(new Error("First Name invalid, must not contain any special characters"));
        renderSignup();

        fireEvent.change(screen.getByPlaceholderText("First Name"), {
            target: { value: "Featherstonehaugh-W" },
        });
        fireEvent.change(screen.getByPlaceholderText("Last Name"), {
            target: { value: "Parker" },
        });
        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "H123456@gmail.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "123456789!" },
        });
        fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

        const error = await waitFor(() =>
            screen.getByText("First Name invalid, must not contain any special characters")
        );
        expect(error).toBeInTheDocument();
    });

    test("Last Name contains special characters", async () => {
        createUserWithEmailAndPassword.mockRejectedValueOnce(new Error("Last Name invalid, must not contain any special characters"));
        renderSignup();

        fireEvent.change(screen.getByPlaceholderText("First Name"), {
            target: { value: "Peter" },
        });
        fireEvent.change(screen.getByPlaceholderText("Last Name"), {
            target: { value: "Featherstonehaugh-W" },
        });
        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "H123456@gmail.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "123456789!" },
        });
        fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

        const error = await waitFor(() =>
            screen.getByText("Last Name invalid, must not contain any special characters")
        );
        expect(error).toBeInTheDocument();
    });
});
