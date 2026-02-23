import cron from "node-cron";
import { autoReturnExpiredBookings } from "../modules/bookings/bookings.services";

// Schedule the cron job
// Runs every 5 minutes: "*/5 * * * *"
cron.schedule("*/5 * * * *", async () => {
    try {
        const count = await autoReturnExpiredBookings();
        if (count > 0) {
            console.log(`${count} bookings auto-returned.`);
        }
    } catch (error) {
        console.error("Error in auto-return cron:", error);
    }
});