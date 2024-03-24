import axios from 'axios';

class CheckersService {
    // Fetch the initial board state from the backend
    async getInitialBoard(): Promise<any> {
        try {
            const response = await axios.get('/get-initial-board');
            console.log("Board initialized successfully");
        } catch (error) {
            console.error('Error fetching initial board:', error);
            throw new Error('Failed to fetch initial board');
        }
    }

    // Send the user move to the backend for processing
    async sendUserMove(moveData: { X1: number, Y1: number, X2: number, Y2: number }): Promise<any> {
        try {
            const response = await axios.put('/user-move', moveData);
            console.log("User made a move successfully");
        } catch (error) {
            console.error('Error sending user move:', error);
            throw new Error('Failed to send user move');
        }
    }

    // Request the backend to calculate the computer's move
    async calculateComputerMove(color: string, boardState: string): Promise<any> {
        try {
            const response = await axios.put('/comp-move', { color, boardState });
            return response.data;
        } catch (error) {
            console.error('Error calculating computer move:', error);
            throw new Error('Failed to calculate computer move');
        }
    }
}

export default new CheckersService();
