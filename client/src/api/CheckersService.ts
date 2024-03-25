import axios from 'axios';
import {TCellCoords} from "../types/TCellCoords";

interface MoveData {
    X1: number,
    Y1: number,
    X2: number,
    Y2: number,
    eatenCheckers: TCellCoords[]
}

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
    static async sendUserMove(moveData: MoveData): Promise<void> {
        try {
            const response = await axios.put('http://localhost:3001/user-move', moveData);
            console.log("User made a move successfully");
        } catch (error) {
            console.error('Error sending user move:', error);
            throw new Error('Failed to send user move');
        }
    }

    static async setDifficulty(difficulty: string): Promise<void> {
        try {
            console.log(difficulty); // Check if difficulty is received correctly here
            const response = await axios.post('http://localhost:3001/set-difficulty', null, {
                params: { difficulty: difficulty }
            });
            console.log("Difficulty set successfully");
        } catch (error) {
            console.error('Error setting difficulty:', error);
            throw new Error('Failed to set difficulty');
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
    static async getAvailableUserMoves(color: string): Promise<any> {
        try {
            const response = await axios.get('http://localhost:3001/get-user-moves', {
                params: { color } // Send color as a query parameter
            });
            return response.data;
        } catch (error) {
            console.error('Error calculating possible user moves:', error);
            throw new Error('Failed to calculate possible user moves');
        }
    }

}

