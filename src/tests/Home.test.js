import {render, screen, fireEvent, waitFor} from '@testing-library/react';
import Home from '../pages/Home';
import userEvent from '@testing-library/user-event';

global.fetch = jest.fn();

describe('Home Component', () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    test('renders without crashing', () => {
        render(<Home />);
        expect(screen.getByPlaceholderText(/Search.../i)).toBeInTheDocument();
    });

    test('fetches and displays news articles', async () => {
        // Mock the fetch response
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue({
                articles: [
                    {
                        title: "Test Article",
                        description: "Test description",
                        urlToImage: "https://example.com/image.jpg",
                        url: "https://example.com",
                        source: { name: "Test Source" },
                        publishedAt: "2025-04-01T12:00:00Z"
                    },
                ],
            }),
        });

        render(<Home />);
        
        await waitFor(() => expect(screen.getByText(/Test Article/i)).toBeInTheDocument());
        
        expect(screen.getByText(/Test Article/i)).toBeInTheDocument();
        expect(screen.getByText(/Test description/i)).toBeInTheDocument();
    });

    test('handles search input and fetches data', async () => {
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue({
                articles: [
                    {
                        title: "Stocks News",
                        description: "Stocks description",
                        urlToImage: "https://example.com/stocks.jpg",
                        url: "https://example.com/stocks",
                        source: { name: "Stocks Source" },
                        publishedAt: "2025-04-01T12:00:00Z"
                    },
                ],
            }),
        });
        
        render(<Home />);
        
        const input = screen.getByPlaceholderText(/Search.../i);
        await userEvent.type(input, 'Stocks{enter}');

        await waitFor(() => expect(screen.getByText(/Stocks News/i)).toBeInTheDocument());
        
        expect(screen.getByText(/Stocks News/i)).toBeInTheDocument();
        expect(screen.getByText(/Stocks description/i)).toBeInTheDocument();
        expect(screen.getByAltText(/News/i)).toHaveAttribute('src', 'https://example.com/stocks.jpg');
    });

    test('displays no articles when no data is returned', async () => {
        fetch.mockResolvedValueOnce({
            json: jest.fn().mockResolvedValue({ articles: [] }),
        });

        render(<Home />);

        await waitFor(() => expect(screen.getByText(/No articles found/i)).toBeInTheDocument());
    });

    test('handles fetch errors gracefully', async () => {
        fetch.mockRejectedValueOnce(new Error('Failed to fetch'));

        render(<Home />);

        await waitFor(() => expect(screen.getByText(/No articles found/i)).toBeInTheDocument());
    });
});
