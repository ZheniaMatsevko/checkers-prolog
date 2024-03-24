import axios from "axios";
import {BoardModel} from "../models/BoardModel";
import {ColorsEnum} from "../enums/ColorsEnum";

export default class CheckersService {
    static async get_next_move(board: BoardModel, color: ColorsEnum): Promise<{ x: number, y: number }> {
        try {
            // Create Prolog query based on the current state of the game board and player's color
            const prologQuery = `get_next_move(${JSON.stringify(board)}, ${color}).`;

            // Send the Prolog query to the server
            const response = await axios.post("http://localhost:3000/prolog_query", { query: prologQuery });

            // Parse the response to extract the next move coordinates (x, y)
            const { x, y } = response.data;

            console.log("Coordinates:" + x + " " + y);
            // Return the next move coordinates
            return { x, y };
        } catch (error) {
            console.error("Error getting next move:", error);
            throw error;
        }
    }

}
