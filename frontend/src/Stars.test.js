import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Stars from "./Stars";
import axios from "axios";

// Mock axios, żeby nie robić prawdziwych requestów
jest.mock("axios");

describe("Stars component", () => {
    beforeEach(() => {
        axios.get.mockImplementation((url) => {
            if (url.includes("/api/stars")) {
                return Promise.resolve({
                    data: [
                        { id: "1", name: "Polaris", description: "Jasna gwiazda", photoUrl: "", constellations: [], isOn: false }
                    ]
                });
            }
            if (url.includes("/api/constellations")) {
                return Promise.resolve({
                    data: [
                        { id: "a", name: "Orion", description: "", photoUrl: "", stars: [] }
                    ]
                });
            }
            return Promise.resolve({ data: [] });
        });
        axios.post.mockClear();
        axios.put.mockClear();
        axios.delete.mockClear();
    });

    it("wyświetla listę gwiazd", async () => {
        render(<Stars />);
        expect(await screen.findByText("Polaris")).toBeInTheDocument();
    });

    it("dodaje nową gwiazdę po wysłaniu formularza", async () => {
        axios.post.mockResolvedValueOnce({ data: { id: "2", name: "Vega", description: "Opis", photoUrl: "", constellations: [] } });
        render(<Stars />);
        fireEvent.change(screen.getByPlaceholderText("Nazwa gwiazdy"), { target: { value: "Vega" } });
        fireEvent.change(screen.getByPlaceholderText("Opis"), { target: { value: "Opis" } });
        fireEvent.click(screen.getByText("Dodaj"));
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith("http://localhost:3001/api/stars", expect.objectContaining({ name: "Vega" }));
        });
    });

    it("po kliknięciu Edytuj pojawia się formularz edycji", async () => {
        render(<Stars />);
        fireEvent.click(await screen.findByText("Edytuj"));
        expect(screen.getByDisplayValue("Polaris")).toBeInTheDocument();
    });

    it("usuwa gwiazdę po kliknięciu 'Usuń'", async () => {
        axios.delete.mockResolvedValueOnce({});
        render(<Stars />);
        fireEvent.click(await screen.findByText("Usuń"));
        await waitFor(() => {
            expect(axios.delete).toHaveBeenCalled();
        });
    });

    it("po kliknięciu żarówki wywołuje przełączenie ON/OFF", async () => {
        axios.post.mockResolvedValueOnce({});
        render(<Stars />);
        fireEvent.click(await screen.findByTitle("Zaświeć"));
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith("http://localhost:3001/api/stars/1/toggle");
        });
    });
});
