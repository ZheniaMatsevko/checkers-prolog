import axios from 'axios';

export default class CheckersService {
    // Fetch the initial board state from the backend
    static async getInitialBoard(): Promise<any> {
        try {
            const response = await axios.get('http://localhost:3001/get-initial-board', );
            console.log("Board initialized successfully");
        } catch (error) {
            console.error('Error fetching initial board:', error);
            throw new Error('Failed to fetch initial board');
        }
    }

    // Send the user move to the backend for processing
    static async sendUserMove(moveData: { X1: number, Y1: number, X2: number, Y2: number }): Promise<any> {
        try {
            const response = await axios.put('http://localhost:3001/user-move', moveData);
            console.log("User made a move successfully");
        } catch (error) {
            console.error('Error sending user move:', error);
            throw new Error('Failed to send user move');
        }
    }

    // Request the backend to calculate the computer's move
    static async calculateComputerMove(color: string): Promise<any> {
        try {
            const response = await axios.put('http://localhost:3001/comp-move', { color });
            return response.data;
        } catch (error) {
            console.error('Error calculating computer move:', error);
            throw new Error('Failed to calculate computer move');
        }
    }
}

